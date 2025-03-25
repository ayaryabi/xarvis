export interface User {
  id: string;
  clerk_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'admin' | 'member';
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  stripe_price_id?: string;
  monthly_price: number;
  yearly_price: number;
  limits: {
    channels: number;
    members: number;
    ad_accounts: number;
    agents: {
      orion: {
        daily_reports: number;
        monitored_accounts: number;
      };
      [key: string]: any;
    };
    [key: string]: any;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationSubscription {
  id: string;
  organization_id: string;
  plan_id: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  current_period_end?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  plan?: SubscriptionPlan;
}

export interface UsageLog {
  id: string;
  organization_id: string;
  feature: string;
  count: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationWithSubscription extends Organization {
  organization_members: OrganizationMember[];
  organization_subscriptions: (OrganizationSubscription & {
    subscription_plans: SubscriptionPlan;
  })[];
} 