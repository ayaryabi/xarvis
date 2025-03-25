-- Create the necessary tables for XARVIS authentication and subscription management

-- Users table - stores basic user information from Clerk
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add an index on clerk_id for faster lookups
CREATE INDEX users_clerk_id_idx ON public.users(clerk_id);

-- Organizations table - top-level entities for multi-tenancy
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization members - establishes user membership in organizations
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- Options: 'admin', 'member'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure a user can only have one role per organization
  UNIQUE(organization_id, user_id)
);

-- Add indexes for faster lookups
CREATE INDEX organization_members_user_id_idx ON public.organization_members(user_id);
CREATE INDEX organization_members_organization_id_idx ON public.organization_members(organization_id);

-- Subscription plans - defines available plans and their limitations
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  stripe_price_id TEXT, -- Link to Stripe price ID
  monthly_price DECIMAL NOT NULL,
  yearly_price DECIMAL NOT NULL,
  limits JSONB NOT NULL, -- Store feature limits as JSON
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization subscriptions - tracks each organization's subscription
CREATE TABLE public.organization_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'past_due', 'canceled', 'trialing'
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure an organization only has one active subscription
  UNIQUE(organization_id)
);

-- Add an index for faster lookups
CREATE INDEX organization_subscriptions_org_id_idx ON public.organization_subscriptions(organization_id);

-- Usage logs - tracks feature usage for metered features
CREATE TABLE public.usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  feature TEXT NOT NULL, -- e.g. 'channels', 'agents.orion.daily_reports'
  count INTEGER NOT NULL DEFAULT 1,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster lookups and filtering
CREATE INDEX usage_logs_org_id_feature_idx ON public.usage_logs(organization_id, feature);
CREATE INDEX usage_logs_period_idx ON public.usage_logs(period_start, period_end);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, monthly_price, yearly_price, limits) 
VALUES 
(
  'Free', 
  0, 
  0, 
  '{
    "channels": 1,
    "members": 2,
    "ad_accounts": 1,
    "agents": {
      "orion": {
        "daily_reports": 1,
        "monitored_accounts": 1
      }
    }
  }'
),
(
  'Pro', 
  49.99, 
  499.90, 
  '{
    "channels": 5,
    "members": 10,
    "ad_accounts": 3,
    "agents": {
      "orion": {
        "daily_reports": 10,
        "monitored_accounts": 3
      }
    }
  }'
);

-- Set up Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Users RLS policies
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- Organizations RLS policies
-- Users can view organizations they are members of
CREATE POLICY "Users can view organizations they belong to" 
  ON public.organizations FOR SELECT 
  USING (
    id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Users who are admins can update their organization
CREATE POLICY "Admin users can update their organizations" 
  ON public.organizations FOR UPDATE 
  USING (
    id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Organization members RLS policies
-- Users can view memberships in their organizations
CREATE POLICY "Users can view members in their organizations" 
  ON public.organization_members FOR SELECT 
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Admin users can manage members in their organizations
CREATE POLICY "Admin users can manage members" 
  ON public.organization_members FOR ALL 
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Subscription plans RLS policies
-- Everyone can view available plans
CREATE POLICY "Everyone can view subscription plans" 
  ON public.subscription_plans FOR SELECT 
  USING (true);

-- Organization subscriptions RLS policies
-- Users can view subscription for their organizations
CREATE POLICY "Users can view their organization subscription" 
  ON public.organization_subscriptions FOR SELECT 
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Admin users can manage subscriptions for their organizations
CREATE POLICY "Admin users can manage subscriptions" 
  ON public.organization_subscriptions FOR ALL 
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Usage logs RLS policies
-- Users can view usage logs for their organizations
CREATE POLICY "Users can view usage logs for their organizations" 
  ON public.usage_logs FOR SELECT 
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Create a function to help with tracking usage
CREATE OR REPLACE FUNCTION public.track_feature_usage(
  org_id UUID,
  feature_name TEXT,
  usage_count INTEGER DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
  current_period_start TIMESTAMP WITH TIME ZONE;
  current_period_end TIMESTAMP WITH TIME ZONE;
  existing_log_id UUID;
BEGIN
  -- Calculate current period (monthly)
  current_period_start := date_trunc('month', now());
  current_period_end := (date_trunc('month', now()) + interval '1 month' - interval '1 second');
  
  -- Check if we already have a log for this period
  SELECT id INTO existing_log_id
  FROM public.usage_logs
  WHERE organization_id = org_id
    AND feature = feature_name
    AND period_start = current_period_start
    AND period_end = current_period_end;
    
  IF existing_log_id IS NOT NULL THEN
    -- Update existing log
    UPDATE public.usage_logs
    SET count = count + usage_count,
        updated_at = now()
    WHERE id = existing_log_id;
  ELSE
    -- Create new log
    INSERT INTO public.usage_logs (
      organization_id,
      feature,
      count,
      period_start,
      period_end
    ) VALUES (
      org_id,
      feature_name,
      usage_count,
      current_period_start,
      current_period_end
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if a feature is allowed based on subscription
CREATE OR REPLACE FUNCTION public.is_feature_allowed(
  org_id UUID,
  feature_name TEXT,
  required_count INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
  current_period_start TIMESTAMP WITH TIME ZONE;
  current_period_end TIMESTAMP WITH TIME ZONE;
  feature_limit INTEGER;
  current_usage INTEGER;
  feature_parts TEXT[];
  current_limit JSONB;
  subscription_record RECORD;
BEGIN
  -- Get organization's subscription and plan
  SELECT 
    os.id,
    sp.limits
  INTO subscription_record
  FROM public.organization_subscriptions os
  JOIN public.subscription_plans sp ON os.plan_id = sp.id
  WHERE os.organization_id = org_id
    AND os.status IN ('active', 'trialing')
    AND (os.current_period_end IS NULL OR os.current_period_end > now());
  
  -- If no active subscription found, return false
  IF subscription_record.id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Parse the feature path (e.g., 'agents.orion.daily_reports')
  feature_parts := string_to_array(feature_name, '.');
  
  -- Navigate the JSONB object to find the limit
  current_limit := subscription_record.limits;
  
  -- Loop through feature parts to navigate the JSONB
  FOR i IN 1..array_length(feature_parts, 1) LOOP
    -- Check if this level exists in the JSON
    IF NOT current_limit ? feature_parts[i] THEN
      RETURN FALSE;
    END IF;
    
    -- If it's the last part, get the numeric limit
    IF i = array_length(feature_parts, 1) THEN
      feature_limit := (current_limit->feature_parts[i])::INTEGER;
    ELSE
      -- Otherwise, navigate deeper
      current_limit := current_limit->feature_parts[i];
    END IF;
  END LOOP;
  
  -- If we couldn't find a numeric limit, feature is not allowed
  IF feature_limit IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- For unlimited features
  IF feature_limit = -1 THEN
    RETURN TRUE;
  END IF;
  
  -- Calculate current period (monthly)
  current_period_start := date_trunc('month', now());
  current_period_end := (date_trunc('month', now()) + interval '1 month' - interval '1 second');
  
  -- Get current usage
  SELECT COALESCE(SUM(count), 0) 
  INTO current_usage
  FROM public.usage_logs
  WHERE organization_id = org_id
    AND feature = feature_name
    AND period_start = current_period_start
    AND period_end = current_period_end;
  
  -- Check if adding required_count would exceed limit
  RETURN (current_usage + required_count) <= feature_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_organizations_modtime
BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_organization_members_modtime
BEFORE UPDATE ON public.organization_members
FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_subscription_plans_modtime
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_organization_subscriptions_modtime
BEFORE UPDATE ON public.organization_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_usage_logs_modtime
BEFORE UPDATE ON public.usage_logs
FOR EACH ROW EXECUTE FUNCTION public.update_modified_column(); 