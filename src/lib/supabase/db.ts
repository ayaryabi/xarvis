import { supabaseAdmin } from './client';

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