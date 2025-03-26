# Stripe Payment Implementation Guide

## Current Progress

You've completed most of the Authentication Setup:
- Clerk integration with Next.js app
- Sign-in and sign-up pages using Clerk components
- Authentication middleware
- Webhook handler for Clerk events
- User synchronization with Supabase
- Database setup with all necessary tables

## Next Steps for Stripe Payment Implementation

### 1. Set Up Stripe Account & Products

1. **Create a Stripe Account**:
   - Register at [stripe.com](https://stripe.com)
   - Complete account verification

2. **Configure Products & Pricing**:
   - Create at least two products: "Free Plan" and "Pro Plan"
   - Set up pricing tiers matching your subscription_plans table
   - Record the Stripe Price IDs for each plan
   - Update your subscription_plans table with these Stripe Price IDs

### 2. Install Stripe SDK

```
npm install stripe @stripe/stripe-js
```

### 3. Create Stripe Client in Your App

Create a new file at `/src/lib/stripe/client.ts`:

```typescript
import Stripe from 'stripe';

// Initialize Stripe with your secret key (server-side only)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the latest API version
});

// Public key for client-side Stripe elements
export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
```

### 4. Create Stripe Webhook Handler

Create a webhook handler at `/src/app/api/webhooks/stripe/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { updateSubscriptionStatus } from '@/lib/supabase/db';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;
  
  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    // Handle subscription events
    if (event.type.startsWith('customer.subscription.')) {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Update subscription status in your database
      await updateSubscriptionStatus({
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      });
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    return new NextResponse(`Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 400 });
  }
}
```

### 5. Add Subscription Management Functions

Create functions in `/src/lib/supabase/db.ts` to handle subscription operations:

```typescript
// Update a subscription's status based on Stripe events
export async function updateSubscriptionStatus({
  stripeSubscriptionId,
  status,
  currentPeriodEnd
}: {
  stripeSubscriptionId: string;
  status: string;
  currentPeriodEnd: Date;
}) {
  const { data, error } = await supabaseAdmin
    .from('organization_subscriptions')
    .update({
      status,
      current_period_end: currentPeriodEnd
    })
    .eq('stripe_subscription_id', stripeSubscriptionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get subscription plan details
export async function getSubscriptionPlan(planId: string) {
  const { data, error } = await supabaseAdmin
    .from('subscription_plans')
    .select('*')
    .eq('id', planId)
    .single();

  if (error) throw error;
  return data;
}
```

### 6. Create Subscription API Routes

Create API routes for subscription management:

1. **Create Checkout Session API** at `/src/app/api/subscriptions/checkout/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { stripe } from '@/lib/stripe/client';
import { getSubscriptionPlan } from '@/lib/supabase/db';

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get request body
    const { planId, organizationId } = await req.json();
    
    // Get plan details
    const plan = await getSubscriptionPlan(planId);
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      metadata: {
        organizationId,
        planId,
        userId
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new NextResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
```

2. **Create Portal Session API** at `/src/app/api/subscriptions/portal/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { stripe } from '@/lib/stripe/client';
import { getUserSubscription } from '@/lib/supabase/db';

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get request body
    const { organizationId } = await req.json();
    
    // Get subscription details
    const subscription = await getUserSubscription(organizationId);
    if (!subscription?.stripe_customer_id) {
      return new NextResponse('No subscription found', { status: 404 });
    }
    
    // Create Stripe billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return new NextResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
```

### 7. Create useSubscription Hook

Create a custom hook at `/src/hooks/use-subscription.ts`:

```typescript
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabaseClient } from '@/lib/supabase/client';

export function useSubscription(organizationId: string) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !organizationId) return;

    async function fetchSubscription() {
      try {
        setLoading(true);
        const { data, error } = await supabaseClient
          .from('organization_subscriptions')
          .select(`
            *,
            subscription_plans(*)
          `)
          .eq('organization_id', organizationId)
          .single();

        if (error) throw error;
        setSubscription(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [user, organizationId]);

  const isFeatureAllowed = (feature: string, requiredCount = 1) => {
    if (!subscription?.subscription_plans?.limits) return false;

    // Parse the feature path (e.g., 'agents.orion.daily_reports')
    const parts = feature.split('.');
    let currentLimit = subscription.subscription_plans.limits;

    // Navigate through the limit JSON structure
    for (let i = 0; i < parts.length; i++) {
      if (!currentLimit[parts[i]]) return false;
      
      if (i === parts.length - 1) {
        const limit = currentLimit[parts[i]];
        // -1 means unlimited
        return limit === -1 || limit >= requiredCount;
      }
      
      currentLimit = currentLimit[parts[i]];
    }

    return false;
  };

  // Function to redirect to checkout
  const checkout = async (planId: string) => {
    const response = await fetch('/api/subscriptions/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, organizationId }),
    });
    
    const { url } = await response.json();
    window.location.href = url;
  };

  // Function to redirect to customer portal
  const manageSubscription = async () => {
    const response = await fetch('/api/subscriptions/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId }),
    });
    
    const { url } = await response.json();
    window.location.href = url;
  };

  return {
    subscription,
    loading,
    error,
    isFeatureAllowed,
    checkout,
    manageSubscription,
  };
}
```

### 8. Build User Interface

1. **Create Billing Page** at `/src/app/billing/page.tsx`:
   - Show current subscription status
   - Display plan details and limits
   - Provide buttons to upgrade or manage subscription
   - Show usage metrics for each feature

2. **Create Feature Gate Component** at `/src/components/feature-gate.tsx`:

```tsx
import { PropsWithChildren } from 'react';
import { useSubscription } from '@/hooks/use-subscription';

interface FeatureGateProps extends PropsWithChildren {
  feature: string;
  count?: number;
  fallback?: React.ReactNode;
  organizationId: string;
}

export function FeatureGate({ 
  feature, 
  count = 1, 
  fallback = null, 
  organizationId,
  children 
}: FeatureGateProps) {
  const { isFeatureAllowed, loading } = useSubscription(organizationId);
  
  if (loading) return <div>Loading...</div>;
  
  if (isFeatureAllowed(feature, count)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}
```

### 9. Implement Usage Tracking

Create a utility function at `/src/lib/track-usage.ts`:

```typescript
import { supabaseClient } from '@/lib/supabase/client';

export async function trackUsage({
  organizationId,
  feature,
  count = 1
}: {
  organizationId: string;
  feature: string;
  count?: number;
}) {
  try {
    const { data, error } = await supabaseClient.rpc('track_feature_usage', {
      org_id: organizationId,
      feature_name: feature,
      usage_count: count
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error tracking usage:', error);
    throw error;
  }
}
```

### 10. Environment Variables

Update your environment variables:

```
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 11. Test Flow

1. Set up a Stripe webhook locally using the Stripe CLI
2. Test creating a new user and verify they get the free plan
3. Test upgrading to the Pro plan
4. Verify subscription status updates correctly
5. Test feature gating based on plan limits
6. Test usage tracking for metered features

## Important Notes

1. **Stripe Pricing Structure**:
   - You'll need multiple prices for each plan (monthly vs yearly)
   - Consider offering trial periods for paid plans

2. **Webhook Security**:
   - Verify webhook signatures to prevent fraud
   - Use appropriate environment variables for production vs development

3. **Error Handling**:
   - Add proper error handling for payment failures
   - Implement retry mechanisms for idempotent operations

4. **User Experience**:
   - Show clear upgrade paths when users hit feature limits
   - Provide usage dashboards so users can monitor their consumption

This implementation combines Clerk for authentication, Supabase for data storage, and Stripe for payment processing to create a complete subscription management system with multiple pricing tiers.