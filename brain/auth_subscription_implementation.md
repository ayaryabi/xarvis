# XARVIS Authentication & Subscription Implementation Plan

## Overview

This document outlines the step-by-step implementation plan for authentication and subscription management in XARVIS. The implementation follows the architecture defined in `architecture.txt` and `folder_architecture.md`.

## Implementation Summary

This implementation plan is divided into 5 key phases:

1. **Database Setup** (Supabase)
   - Create core tables (users, organizations, members, subscription plans, subscriptions, usage logs)
   - Set up default subscription plans (Free and Pro tiers)
   - Implement row-level security for data protection

2. **Authentication** (Clerk)
   - Configure Clerk application and OAuth providers
   - Set up Next.js integration with authentication pages
   - Implement authentication middleware for route protection
   - Create webhook handler for user synchronization with Supabase
   - Build custom auth hook for accessing user data

3. **Subscription Management** (Stripe)
   - Set up Stripe integration and price plans
   - Implement Stripe client and webhook handlers
   - Create API endpoints for checkout and customer portal
   - Build subscription management React hook

4. **UI Implementation**
   - Create subscription management page
   - Implement feature gate component for access control
   - Build usage tracking utility

5. **Testing & Validation**
   - Test authentication flows
   - Validate subscription management
   - Verify usage tracking and feature gating

Each phase includes detailed implementation steps with code examples that follow the XARVIS architecture and modern Next.js patterns.

## Phase 1: Database Setup (Supabase)

### 1.1. Core Tables Setup

```sql
-- Create the base tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE,
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{}'
);

CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  monthly_price DECIMAL NOT NULL,
  yearly_price DECIMAL NOT NULL,
  limits JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE organization_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  status TEXT NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### 1.2. Add Default Subscription Plans

```sql
INSERT INTO subscription_plans (name, monthly_price, yearly_price, limits)
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
```

### 1.3. Setup Row-Level Security (RLS)

```sql
-- Only allow access to users that are part of an organization
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own user data" ON users
  FOR SELECT USING (auth.uid() = id);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view organizations they belong to" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id 
      FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Similar policies for other tables
```

## Phase 2: Authentication Setup (Clerk)

### 2.1. Clerk Configuration

1. Create a Clerk application at [dashboard.clerk.dev](https://dashboard.clerk.dev)
2. Configure OAuth providers (Google, etc.)
3. Setup redirect URLs for authentication flow

### 2.2. Next.js Integration

1. Install Clerk SDK:
```bash
npm install @clerk/nextjs
```

2. Configure Environment Variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### 2.3. Create Authentication Components

1. Create the ClerkProvider in `src/app/layout.tsx`:
```tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

2. Create login page in `src/app/(auth)/login/page.tsx`:
```tsx
import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn />
    </div>
  );
}
```

3. Create register page in `src/app/(auth)/register/page.tsx`:
```tsx
import { SignUp } from '@clerk/nextjs';

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignUp />
    </div>
  );
}
```

### 2.4. Setup Authentication Middleware

Create `middleware.ts` at the project root:
```tsx
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/login',
    '/register',
    '/api/webhooks/clerk',
    '/api/webhooks/stripe'
  ],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### 2.5. Implement User Synchronization with Supabase

1. Create Clerk webhook handler in `src/app/api/webhooks/clerk/route.ts`:
```tsx
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const body = await req.json();
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
  
  // Validate webhook
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  
  try {
    const evt = wh.verify(JSON.stringify(body), {
      "svix-id": svix_id!,
      "svix-timestamp": svix_timestamp!,
      "svix-signature": svix_signature!,
    });
    
    const supabase = createClient();
    
    // Handle user creation
    if (evt.type === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      
      // Insert user into Supabase
      const { data, error } = await supabase
        .from('users')
        .insert({
          clerk_id: id,
          email: email_addresses[0].email_address,
          name: `${first_name || ''} ${last_name || ''}`.trim(),
          avatar_url: image_url,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Create default organization for new user
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: `${first_name || 'My'}'s Organization`,
        })
        .select()
        .single();
      
      if (orgError) throw orgError;
      
      // Add user as admin to organization
      await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: data.id,
          role: 'admin',
        });
      
      // Assign free subscription plan
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select()
        .eq('name', 'Free')
        .single();
      
      await supabase
        .from('organization_subscriptions')
        .insert({
          organization_id: org.id,
          plan_id: plan.id,
          status: 'active',
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year trial
        });
    }
    
    return new Response(null, { status: 200 });
  } catch (err) {
    console.error('Error in Clerk webhook', err);
    return new Response('Webhook verification failed', { status: 400 });
  }
}
```

### 2.6. Create Auth Hooks

Create `hooks/use-auth.ts`:
```tsx
import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { useOrganization as useClerkOrganization } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useAuth() {
  const { userId, isLoaded, isSignedIn } = useClerkAuth();
  const supabase = createClient();
  
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select(`
          id, 
          name, 
          email, 
          avatar_url,
          organization_members!inner (
            organization_id,
            role,
            organizations (
              id,
              name,
              settings
            )
          )
        `)
        .eq('clerk_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId && isSignedIn === true
  });
  
  return {
    user,
    isLoaded: isLoaded && !isLoading,
    isSignedIn,
    organizations: user?.organization_members?.map(m => m.organizations) || []
  };
}
```

## Phase 3: Subscription Management (Stripe)

### 3.1. Stripe Configuration

1. Create a Stripe account and set up a product with price plans
2. Set up webhook endpoints

### 3.2. Install Stripe SDK

```bash
npm install stripe @stripe/stripe-js
```

### 3.3. Configure Environment Variables

```
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
```

### 3.4. Create Stripe Client

Create `lib/stripe/client.ts`:
```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
```

### 3.5. Create Stripe Webhook Handler

Create `src/app/api/webhooks/stripe/route.ts`:
```typescript
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    const supabase = createClient();
    
    // Handle subscription events
    if (event.type === 'customer.subscription.created' ||
        event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0].price.id;
      
      // Find the corresponding plan in your database
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select()
        .eq('stripe_price_id', priceId)
        .single();
      
      if (!plan) {
        throw new Error(`No plan found for price: ${priceId}`);
      }
      
      // Update subscription in your database
      await supabase
        .from('organization_subscriptions')
        .update({
          plan_id: plan.id,
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000),
        })
        .eq('stripe_subscription_id', subscription.id);
    }
    
    // Handle payment failure
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice;
      const subscription = invoice.subscription as string;
      
      await supabase
        .from('organization_subscriptions')
        .update({
          status: 'past_due',
        })
        .eq('stripe_subscription_id', subscription);
    }
    
    return new Response(null, { status: 200 });
  } catch (err) {
    console.error('Error processing Stripe webhook:', err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
```

### 3.6. Create Subscription API Endpoints

Create `src/app/api/subscription/route.ts`:
```typescript
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const { priceId, organizationId } = await req.json();
    const supabase = createClient();
    
    // Get organization and check if user is admin
    const { data: membership } = await supabase
      .from('organization_members')
      .select()
      .eq('organization_id', organizationId)
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();
    
    if (!membership) {
      return new Response('Not an admin of this organization', { status: 403 });
    }
    
    // Get organization's current subscription
    const { data: subscription } = await supabase
      .from('organization_subscriptions')
      .select()
      .eq('organization_id', organizationId)
      .single();
    
    // Get organization for customer info
    const { data: organization } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single();
    
    // Get user for customer info
    const { data: user } = await supabase
      .from('users')
      .select('email, name')
      .eq('clerk_id', userId)
      .single();
    
    let customerId = subscription?.stripe_customer_id;
    
    // If no customer yet, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: organization.name,
        metadata: {
          organizationId
        }
      });
      
      customerId = customer.id;
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
      metadata: {
        organizationId
      }
    });
    
    // Update customer ID if needed
    if (!subscription?.stripe_customer_id) {
      await supabase
        .from('organization_subscriptions')
        .update({
          stripe_customer_id: customerId
        })
        .eq('id', subscription.id);
    }
    
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response('Error creating checkout session', { status: 500 });
  }
}
```

### 3.7. Create Customer Portal API Endpoint

Create `src/app/api/subscription/portal/route.ts`:
```typescript
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const { organizationId } = await req.json();
    const supabase = createClient();
    
    // Get organization subscription
    const { data: subscription } = await supabase
      .from('organization_subscriptions')
      .select()
      .eq('organization_id', organizationId)
      .single();
    
    if (!subscription?.stripe_customer_id) {
      return new Response('No subscription found', { status: 404 });
    }
    
    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return new Response('Error creating portal session', { status: 500 });
  }
}
```

### 3.8. Create Subscription React Hook

Create `hooks/use-subscription.ts`:
```typescript
import { useAuth } from './use-auth';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useSubscription(organizationId?: string) {
  const { user, isLoaded } = useAuth();
  const supabase = createClient();
  
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      
      const { data, error } = await supabase
        .from('organization_subscriptions')
        .select(`
          id,
          status,
          current_period_end,
          subscription_plans (
            id,
            name,
            monthly_price,
            yearly_price,
            limits
          )
        `)
        .eq('organization_id', organizationId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!organizationId && isLoaded
  });
  
  // Check if a feature is allowed based on plan limits
  const isFeatureAllowed = (feature: string, count: number) => {
    if (!subscription) return false;
    
    const plan = subscription.subscription_plans;
    const limits = plan.limits;
    
    // Handle nested features like "agents.orion.daily_reports"
    const path = feature.split('.');
    let current = limits;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) return false;
      current = current[path[i]];
    }
    
    const limit = current[path[path.length - 1]];
    return typeof limit === 'number' && count <= limit;
  };
  
  return {
    subscription,
    isLoading,
    plan: subscription?.subscription_plans,
    status: subscription?.status,
    isFeatureAllowed,
  };
}
```

## Phase 4: UI Implementation

### 4.1. Create Billing Page

Create `src/app/(dashboard)/settings/billing/page.tsx`:
```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export default function BillingPage() {
  const { user } = useAuth();
  const organizationId = user?.organization_members?.[0]?.organization_id;
  const { subscription, plan, status } = useSubscription(organizationId);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  
  // Get available plans
  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select()
        .eq('is_active', true)
        .order('monthly_price', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });
  
  const handleUpgrade = async (priceId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          organizationId,
        }),
      });
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error upgrading:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/subscription/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId,
        }),
      });
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error opening portal:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>
      
      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        {plan ? (
          <div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium">{plan.name}</p>
                <p className="text-gray-600">${plan.monthly_price}/month</p>
                <p className="text-sm mt-2">Status: <span className="font-medium capitalize">{status}</span></p>
                {subscription?.current_period_end && (
                  <p className="text-sm text-gray-600 mt-1">
                    Renews on {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <button
                onClick={handleManageSubscription}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Manage Subscription
              </button>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Plan Limits:</h3>
              <ul className="grid grid-cols-2 gap-2">
                {Object.entries(plan.limits).map(([key, value]) => {
                  if (typeof value === 'object') return null;
                  return (
                    <li key={key} className="flex items-center">
                      <span className="capitalize">{key.replace('_', ' ')}:</span>
                      <span className="ml-2 font-medium">{value}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          <p>No active subscription found.</p>
        )}
      </div>
      
      {/* Available Plans */}
      <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans?.map((availablePlan) => (
          <div key={availablePlan.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-2">{availablePlan.name}</h3>
            <p className="text-2xl font-bold mb-4">${availablePlan.monthly_price}<span className="text-sm font-normal text-gray-600">/month</span></p>
            
            <ul className="mb-6 space-y-2">
              {Object.entries(availablePlan.limits).map(([key, value]) => {
                if (typeof value === 'object') return null;
                return (
                  <li key={key} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="capitalize">{key.replace('_', ' ')}:</span>
                    <span className="ml-1">{value}</span>
                  </li>
                );
              })}
            </ul>
            
            <button
              onClick={() => handleUpgrade(availablePlan.stripe_price_id)}
              disabled={isLoading || (plan?.id === availablePlan.id && status === 'active')}
              className={`w-full py-2 rounded font-medium ${
                plan?.id === availablePlan.id && status === 'active'
                  ? 'bg-gray-200 text-gray-800 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {plan?.id === availablePlan.id && status === 'active'
                ? 'Current Plan'
                : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 4.2. Create Feature Gate Component

Create `components/common/FeatureGate.tsx`:
```tsx
'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';

interface FeatureGateProps {
  feature: string;
  count?: number;
  fallback?: ReactNode;
  children: ReactNode;
}

export function FeatureGate({ 
  feature, 
  count = 1, 
  fallback = null, 
  children 
}: FeatureGateProps) {
  const { user } = useAuth();
  const organizationId = user?.organization_members?.[0]?.organization_id;
  const { isFeatureAllowed, isLoading } = useSubscription(organizationId);
  
  if (isLoading) {
    return null;
  }
  
  if (isFeatureAllowed(feature, count)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}
```

### 4.3. Create Usage Tracking Utility

Create `lib/usage/track.ts`:
```typescript
import { createClient } from '@/lib/supabase/client';

export async function trackUsage(organizationId: string, feature: string, count: number = 1) {
  const supabase = createClient();
  
  // Get current usage period (assuming monthly)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  
  // Check if we have a usage record for this period
  const { data: existingLog } = await supabase
    .from('usage_logs')
    .select()
    .eq('organization_id', organizationId)
    .eq('feature', feature)
    .gte('period_start', startOfMonth.toISOString())
    .lte('period_end', endOfMonth.toISOString())
    .single();
  
  if (existingLog) {
    // Update existing log
    await supabase
      .from('usage_logs')
      .update({
        count: existingLog.count + count
      })
      .eq('id', existingLog.id);
  } else {
    // Create new log
    await supabase
      .from('usage_logs')
      .insert({
        organization_id: organizationId,
        feature,
        count,
        period_start: startOfMonth.toISOString(),
        period_end: endOfMonth.toISOString()
      });
  }
}
```

## Phase 5: Testing and Validation

### 5.1. Test Authentication Flow

1. Test user registration
2. Test user login
3. Test protected routes
4. Test Clerk webhook for user creation
5. Test organization creation

### 5.2. Test Subscription Flow

1. Test free plan assignment for new users
2. Test subscription upgrade
3. Test Stripe webhook handling
4. Test billing portal access
5. Test feature gating based on subscription plan

### 5.3. Test Usage Tracking

1. Test tracking usage for features
2. Test limit enforcement
3. Test usage reporting

## Next Steps

After completing the authentication and subscription setup, the next steps would be:

1. Implement the dashboard structure
2. Create the channel system
3. Implement Facebook OAuth integration
4. Set up data fetching for Facebook accounts
5. Refactor and implement the Orion agent 