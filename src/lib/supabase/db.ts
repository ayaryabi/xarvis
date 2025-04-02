import { supabaseAdmin } from './client';
import type { OrganizationSubscription, User, OrganizationMember } from './types'; // Import the types

/**
 * User-related database operations
 */
export const users = {
  // Create a new user in Supabase
  async create(userData: {
    clerk_id: string;
    email: string;
    name: string;
    avatar_url?: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get a user by their Clerk ID
  async getByClerkId(clerkId: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Update a user in Supabase
  async update(clerkId: string, userData: Partial<{
    email: string;
    name: string;
    avatar_url: string;
  }>) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(userData)
      .eq('clerk_id', clerkId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

/**
 * Organization-related database operations
 */
export const organizations = {
  // Create a new organization
  async create(organizationData: {
    name: string;
    settings?: Record<string, string | number | boolean | null>;
  }) {
    const { data, error } = await supabaseAdmin
      .from('organizations')
      .insert([organizationData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Add a member to an organization
  async addMember(organizationId: string, userId: string, role: 'admin' | 'member' = 'member') {
    const { data, error } = await supabaseAdmin
      .from('organization_members')
      .insert([{
        organization_id: organizationId,
        user_id: userId,
        role
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all organizations a user belongs to
  async getUserOrganizations(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('organizations')
      .select(`
        *,
        organization_members!inner(role),
        organization_subscriptions(
          *,
          subscription_plans(*)
        )
      `)
      .eq('organization_members.user_id', userId);

    if (error) throw error;
    return data;
  }
};


/**
 * Helper function to create a new user complete with organization.
 * This function is designed to be idempotent (safe to call multiple times).
 */
export async function createUserWithOrganization(userData: {
  clerk_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  organization_name?: string;
}) {
  console.log(`[DB] Attempting to create user/org for Clerk ID: ${userData.clerk_id}`);

  // 1. Check if user already exists
  let user = await users.getByClerkId(userData.clerk_id);

  if (user) {
    console.log(`[DB] User with Clerk ID ${userData.clerk_id} already exists (Supabase ID: ${user.id}). Skipping creation.`);
    // Optional: You could fetch and return existing organization details if needed
    // For now, just returning null indicates no *new* creation happened.
    return { user, organization: null }; // Indicate user exists, no new org created by *this* call
  }

  // 2. User does not exist, proceed with creation
  console.log(`[DB] User with Clerk ID ${userData.clerk_id} not found. Proceeding with creation...`);
  try {
    const organizationName = userData.organization_name || `${userData.name}'s Organization`;

    // Create user in Supabase
    user = await users.create(userData);
    console.log(`[DB] Created Supabase user ${user.id} for Clerk ID ${userData.clerk_id}`);

    // Create organization
    const organization = await organizations.create({
      name: organizationName
    });
    console.log(`[DB] Created organization ${organization.id} (${organization.name})`);

    // Add user as admin to organization
    await organizations.addMember(organization.id, user.id, 'admin');
    console.log(`[DB] Added user ${user.id} as admin to organization ${organization.id}`);

    return { user, organization };

  } catch (error: any) {
    // Handle potential race condition: If another webhook call created the user
    // between the initial check and the users.create call.
    if (error.code === '23505') { // Check for unique constraint violation
       console.warn(`[DB Warn] Race condition likely occurred for Clerk ID ${userData.clerk_id}. Another process may have created the user/org already. Attempting to fetch existing user.`);
       // Re-fetch the user to be sure
       const existingUser = await users.getByClerkId(userData.clerk_id);
       if (existingUser) {
         console.log(`[DB] Found existing user ${existingUser.id} after race condition.`);
         // You might want to fetch the associated org too if needed downstream
         return { user: existingUser, organization: null }; // Return existing user, indicate no *new* org created
       } else {
         console.error(`[DB Error] Failed to create user/org for ${userData.clerk_id} due to potential race condition, but couldn't find existing user afterwards. Error:`, error);
         throw error; // Re-throw if user still not found
       }
    } else {
      // Handle other errors during creation
      console.error(`[DB Error] Failed during createUserWithOrganization for Clerk ID ${userData.clerk_id}:`, error);
      throw error; // Re-throw the error to be handled by the webhook caller
    }
  }
}

/**
 * Gets the relevant organization ID, subscription details, user role within that org,
 * and user email for a given Clerk user ID.
 * Assumes the first organization found for the user is the relevant one.
 */
export async function getUserOrgSubRoleAndEmail(clerkId: string): Promise<{
  organizationId: string | null;
  subscription: OrganizationSubscription | null;
  role: OrganizationMember['role'] | null;
  email: string | null;
}> {
  if (!clerkId) {
    console.warn('[DB Warn] getUserOrgSubRoleAndEmail called with no clerkId');
    return { organizationId: null, subscription: null, role: null, email: null };
  }

  try {
    // 0. Find the Supabase user record (contains email and Supabase ID)
    const user = await users.getByClerkId(clerkId);

    if (!user) {
      console.warn(`[DB Warn] No Supabase user found for clerkId ${clerkId}`);
      return { organizationId: null, subscription: null, role: null, email: null };
    }
    const supabaseUserId = user.id;
    const userEmail = user.email;

    // 1. Find the first organization membership (contains org ID and role)
    const { data: memberData, error: memberError } = await supabaseAdmin
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', supabaseUserId)
      .limit(1)
      .single();

    if (memberError && memberError.code !== 'PGRST116') {
      console.error('[DB Error] Fetching organization member:', memberError);
      throw memberError;
    }

    if (!memberData) {
      console.log(`[DB Info] No organization found for Supabase user ${supabaseUserId} (clerkId: ${clerkId})`);
      return { organizationId: null, subscription: null, role: null, email: userEmail };
    }

    const organizationId = memberData.organization_id;
    const userRoleInOrg = memberData.role;

    // 2. Fetch the subscription details for that organization
    const { data: subscriptionData, error: subError } = await supabaseAdmin
      .from('organization_subscriptions')
      .select('*')
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (subError) {
      console.error('[DB Error] Fetching organization subscription:', subError);
      throw subError;
    }

    // 3. Return all the gathered info
    console.log(`[DB Info] Clerk ${clerkId}, User ${supabaseUserId}, Email ${userEmail}, Org ${organizationId}, Role ${userRoleInOrg}, Sub ${subscriptionData ? subscriptionData.id : 'None'}`);

    return {
      organizationId,
      subscription: subscriptionData,
      role: userRoleInOrg,
      email: userEmail,
    };

  } catch (error) {
    console.error('[DB Error] Failed in getUserOrgSubRoleAndEmail:', error);
    return { organizationId: null, subscription: null, role: null, email: null };
  }
}

// Remove or comment out the previous version if no longer needed
// export async function getUserOrgAndSubscription(clerkId: string): Promise<{
//   organizationId: string | null;
//   subscription: OrganizationSubscription | null;
// }> { ... } 

// --- NEW Subscription Functions for Stripe Webhooks ---

/**
 * Finds the internal Supabase plan ID based on a Stripe Price ID.
 */
export async function findPlanIdByStripePriceId(stripePriceId: string): Promise<string | null> {
  if (!stripePriceId) return null;

  try {
    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .select('id')
      .eq('stripe_price_id', stripePriceId)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error(`[DB Error] Failed to find plan for stripePriceId ${stripePriceId}:`, error);
      throw error;
    }

    return data?.id || null;
  } catch (error) {
    console.error('[DB Error] Exception in findPlanIdByStripePriceId:', error);
    return null;
  }
}

/**
 * Upserts subscription data into the organization_subscriptions table.
 * Uses stripe_subscription_id as the conflict target.
 */
export async function upsertOrganizationSubscription(data: {
  organization_id: string;
  plan_id: string; // Internal Supabase plan UUID
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: string;
  current_period_end: Date;
  current_period_start: Date;
  trial_ends_at: Date | null;
}) {
  console.log(`[DB] Upserting subscription: ${data.stripe_subscription_id} for Org: ${data.organization_id}`);
  try {
    const { error } = await supabaseAdmin
      .from('organization_subscriptions')
      .upsert(data, { onConflict: 'stripe_subscription_id' }); // Upsert based on Stripe Subscription ID

    if (error) {
      console.error(`[DB Error] Failed to upsert subscription ${data.stripe_subscription_id}:`, error);
      throw error;
    }
    console.log(`[DB] Successfully upserted subscription ${data.stripe_subscription_id}`);
  } catch (error) {
    console.error('[DB Error] Exception during subscription upsert:', error);
    throw error; // Re-throw to be caught by webhook handler
  }
}

/**
 * Updates only the status of a subscription based on the Stripe Subscription ID.
 */
export async function updateSubscriptionStatusBySubId(stripeSubscriptionId: string, status: string) {
  console.log(`[DB] Updating status for subscription ${stripeSubscriptionId} to ${status}`);
  try {
    const { error } = await supabaseAdmin
      .from('organization_subscriptions')
      .update({ status: status })
      .eq('stripe_subscription_id', stripeSubscriptionId);

    if (error) {
      console.error(`[DB Error] Failed to update status for subscription ${stripeSubscriptionId}:`, error);
      throw error;
    }
    console.log(`[DB] Successfully updated status for subscription ${stripeSubscriptionId}`);
  } catch (error) {
    console.error('[DB Error] Exception during subscription status update:', error);
    throw error; // Re-throw to be caught by webhook handler
  }
}

/**
 * Finds the internal Supabase organization ID based on a Stripe Subscription ID.
 */
export async function findOrgIdByStripeSubId(stripeSubscriptionId: string): Promise<string | null> {
  if (!stripeSubscriptionId) return null;

  try {
    const { data, error } = await supabaseAdmin
      .from('organization_subscriptions')
      .select('organization_id')
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error(`[DB Error] Failed to find org for stripeSubscriptionId ${stripeSubscriptionId}:`, error);
      throw error;
    }

    return data?.organization_id || null;
  } catch (error) {
    console.error('[DB Error] Exception in findOrgIdByStripeSubId:', error);
    return null;
  }
}

// NOTE: We are using upsert for simplicity. If finer-grained updates
// are needed (e.g., only updating specific fields based on event type),
// separate update functions like updateSubscriptionPeriod/updateSubscriptionStatus
// could be created and called instead of the generic upsert. 