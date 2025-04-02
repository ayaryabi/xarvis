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
 * Subscription-related database operations
 */
export const subscriptions = {
  // Get Free plan
  async getFreePlan() {
    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('name', 'Free')
      .single();

    if (error) throw error;
    return data;
  },

  // Assign Free plan to an organization
  async assignFreePlan(organizationId: string) {
    const freePlan = await this.getFreePlan();
    
    const { data, error } = await supabaseAdmin
      .from('organization_subscriptions')
      .insert([{
        organization_id: organizationId,
        plan_id: freePlan.id,
        status: 'active'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

/**
 * Helper function to create a new user complete with organization and free plan
 */
export async function createUserWithOrganization(userData: {
  clerk_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  organization_name?: string;
}) {
  const organizationName = userData.organization_name || `${userData.name}'s Organization`;
  
  // create a user in supabase
  const user = await users.create(userData);
  
  // Create organization
  const organization = await organizations.create({
    name: organizationName
  });
  
  // Add user as admin to organization
  await organizations.addMember(organization.id, user.id, 'admin');
  
  // Assign free plan
  await subscriptions.assignFreePlan(organization.id);
  
  return { user, organization };
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