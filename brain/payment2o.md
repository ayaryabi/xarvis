# XARVIS Subscription System Implementation Plan

## High-Level Implementation Phases

This plan breaks down the payment system implementation into manageable phases:

1.  **Phase 1: Setup & Foundation**
    *   **Goal**: Prepare database and Stripe environment.
    *   **Tasks**:
        *   Update `organization_subscriptions` table: Add `trial_ends_at` and `current_period_start` columns.
        *   Stripe Account Setup: Create Stripe account (if needed).
        *   Stripe Product Setup: Define your subscription product(s) and price(s) in the Stripe dashboard, ensuring a 7-day trial period is configured for the relevant price.
        *   API Keys & Secrets: Obtain Stripe publishable key, secret key, and webhook signing secret.
        *   Environment Variables: Add Stripe keys/secrets and `NEXT_PUBLIC_APP_URL` to your `.env` file(s).

2.  **Phase 2: Core Checkout Flow**
    *   **Goal**: Enable users to initiate checkout and be redirected to Stripe.
    *   **Tasks**:
        *   Create Stripe Client (`lib/stripe/client.ts`).
        *   Implement backend API route (`/api/checkout/route.ts`) to create Stripe Checkout Sessions (including metadata: `clerk_id`, `user_id`, `organization_id`).
        *   Implement frontend API helper (`features/subscription/api/checkout-api.ts`).
        *   Create basic checkout button component (`features/subscription/components/checkout-button.tsx`) on the pricing page.
        *   Handle redirect logic in the pricing page component (`features/subscription/pages/pricing-page.tsx` or similar).

3.  **Phase 3: Webhook Handling & Trial Activation**
    *   **Goal**: Activate the user's trial subscription in the database when Stripe confirms payment details.
    *   **Tasks**:
        *   Implement backend API route (`/api/webhooks/stripe/route.ts`) to receive Stripe webhooks.
        *   Implement webhook signature verification (`lib/stripe/webhooks.ts`).
        *   Handle the `checkout.session.completed` event in the webhook handler.
        *   Update the `organization_subscriptions` record in the database: Set `status` to `trialing`, store Stripe IDs (`customer_id`, `subscription_id`), and set `trial_ends_at`, `current_period_start`, `current_period_end`.
        *   Set up local webhook testing using Stripe CLI (`stripe listen --forward-to ...`).

4.  **Phase 4: Frontend State & UI Integration**
    *   **Goal**: Display subscription status and control feature access in the UI.
    *   **Tasks**:
        *   Implement React Query hook (`features/subscription/hooks/use-subscription.ts`) to fetch subscription data.
        *   Implement `SubscriptionProvider` (`features/subscription/components/subscription-provider.tsx`).
        *   Wrap the application layout (`app/layout.tsx`) with `SubscriptionProvider`.
        *   Create basic UI components to display subscription status (`features/subscription/components/subscription-status.tsx`).
        *   Implement basic access control based on subscription status (e.g., disabling premium features if not active/trialing).

5.  **Phase 5: Subscription Management & Additional Webhooks**
    *   **Goal**: Allow users to manage their subscription and handle ongoing subscription events.
    *   **Tasks**:
        *   Implement backend logic to create Stripe Billing Portal sessions.
        *   Add a link/button in user settings to redirect to the Stripe Billing Portal.
        *   Expand webhook handler (`/api/webhooks/stripe/route.ts`) to handle other crucial events:
            *   `customer.subscription.updated`: For plan changes, status updates.
            *   `customer.subscription.deleted`: For cancellations.
            *   `invoice.paid`: To update `current_period_start/end` on successful renewals.
            *   `invoice.payment_failed`: To handle payment issues (e.g., notify user, potentially restrict access).

---

# XARVIS Subscription Flow Documentation

## Full Subscription Flow Explained

Here's the complete flow from user signup to active subscription:

## 1. User Signs Up (Authentication)

1. **User clicks "Try for 7 days free" on pricing page**
   - If not logged in, redirected to signup page

2. **Clerk Authentication**
   - User creates account with email/password or social login
   - Clerk generates unique user ID
   - Clerk sends webhook to your app (`/api/webhooks/clerk`)
   - Your webhook handler creates records in your database: 
     - `users` table entry
     - `organizations` table entry (user gets their own org)
     - `organization_subscriptions` table entry with `status: 'incomplete'` (trial not yet active)
   - User is now authenticated but doesn't have trial access yet.

3. **Redirect After Signup**
   - After successful signup, user is redirected back to pricing page or directly to checkout.
   - The URL might contain a parameter like `?signup=success`

## 2. Checkout Process

1. **User clicks "Try for 7 days free" again**
   - This time they're logged in
   - Your frontend component (`features/subscription/components/pricing-table.tsx`) handles the click

2. **Frontend API Call**
   - Component calls `checkoutApi.createCheckoutSession()` from `features/subscription/api/checkout-api.ts`
   - This makes an HTTP POST request to `/api/checkout`

3. **Backend Checkout Creation**
   - `/api/checkout/route.ts` receives the request
   - It verifies the user is authenticated (using Clerk)
   - It gets user details from your database
   - It uses Stripe utilities (`lib/stripe/client.ts` and `checkout.ts`) to create a session
   - The session includes:
     - Trial period of 7 days
     - Product/price details
     - User's email (pre-filled)
     - Success/cancel URLs
     - Metadata with user ID and organization ID

4. **Redirect to Stripe**
   - Backend returns checkout session URL
   - Frontend redirects user to this URL
   - User sees Stripe's hosted checkout page

## 3. Payment Information Entry

1. **User enters payment details on Stripe checkout**
   - Credit card information
   - Billing address
   - Email (pre-filled from your system)

2. **Stripe validation**
   - Stripe validates the card (but doesn't charge it yet)
   - Stripe creates a customer record
   - Stripe creates a subscription with trial period

3. **Stripe redirect**
   - Stripe redirects user back to your success URL
   - This URL points to a page in your app (`/dashboard?checkout=success`)

## 4. Webhook Processing

1. **Stripe sends webhook events**
   - When checkout completes (payment details added), Stripe sends `checkout.session.completed` event
   - This hits your webhook endpoint (`/api/webhooks/stripe/route.ts`)

2. **Webhook verification**
   - Your endpoint verifies webhook signature using `lib/stripe/webhooks.ts`
   - This ensures the request actually came from Stripe

3. **Database updates & Trial Activation**
   - Your webhook handler extracts data from the event
   - It uses the metadata (user ID, org ID) to identify the customer
   - It updates the existing `organization_subscriptions` record:
     - Sets `stripe_customer_id` and `stripe_subscription_id`
     - Sets `status` to `"trialing"`
     - Sets `trial_ends_at` (e.g., 7 days from now)
     - Sets `current_period_start` and `current_period_end` (matching trial period initially)
   - **This step officially activates the trial period.**

4. **Feature access update**
   - Your system now recognizes the user has an active trial
   - They get access to premium features

## 5. Trial Period

1. **User uses service during trial**
   - User has full access to premium features
   - Your app checks subscription status for feature access

2. **Trial nearing end**
   - You might send reminder emails (using Stripe or your own system)
   - User can cancel before trial ends if they wish

3. **Trial ends**
   - Stripe automatically charges the customer's card
   - Stripe sends `invoice.paid` webhook event
   - Your webhook handler updates subscription status to "active"

## 6. Subscription Management

1. **User manages subscription**
   - User visits billing page (`/dashboard/settings/billing`)
   - Page displays subscription info from your database
   - Page renders Stripe Portal link using `stripe.billingPortal.sessions.create()`

2. **Cancellation flow**
   - User can cancel subscription through Stripe Portal
   - Stripe sends `customer.subscription.deleted` webhook
   - Your webhook handler updates subscription status to "canceled"
   - Features are restricted when subscription ends

## The Key Integration Points

1. **Authentication to Checkout**
   - Clerk user ID is stored with subscription
   - This links subscription to user account

2. **Frontend to Backend**
   - Components call API functions 
   - API functions make HTTP requests to routes
   - Routes process requests and return responses

3. **Backend to Stripe**
   - Your server communicates with Stripe API
   - Creates sessions, manages subscriptions

4. **Stripe to Your Server**
   - Webhooks notify your app of events
   - Your app updates database accordingly

5. **Database to Features**
   - Access control checks subscription status
   - Features shown/hidden based on plan

## Implementation Directory Structure

```
src/features/subscription/             # New feature directory
├── components/                        # Subscription components
│   ├── pricing-table.tsx              # Pricing table display
│   ├── subscription-card.tsx          # Individual plan card
│   ├── checkout-button.tsx            # Button to initiate checkout
│   ├── subscription-status.tsx        # Display current subscription status
│   └── billing-history.tsx            # Display billing history
├── hooks/                             # Subscription hooks
│   ├── use-subscription.ts            # Get subscription status
│   ├── use-checkout.ts                # Handle checkout process
│   └── use-billing.ts                 # Access billing information
├── api/                               # API integration
│   ├── subscription-api.ts            # Subscription-related API calls
│   └── checkout-api.ts                # Checkout session creation
├── types/                             # Type definitions
│   └── subscription-types.ts          # Types for plans, subscriptions, etc.
├── stores/                            # State management
│   └── subscription-store.ts          # Subscription state
└── pages/                             # Page components
    ├── pricing-page.tsx               # Pricing page
    ├── checkout-success-page.tsx      # Success page after checkout
    └── billing-page.tsx               # User's billing management page
```

## API Routes

```
src/app/
├── api/
    ├── checkout/                      # Checkout API
    │   └── route.ts                   # Create checkout session
    └── webhooks/
        └── stripe/                    # Stripe webhooks
            └── route.ts               # Handle Stripe events
```

## Library Utilities

```
src/lib/
└── stripe/                            # Stripe integration
    ├── client.ts                      # Stripe client initialization
    ├── checkout.ts                    # Checkout session creation
    └── webhooks.ts                    # Webhook handling utilities
```

## Database Schema

```
subscription_plans
├── id
├── name
├── stripe_price_id
├── monthly_price
├── features (JSON)
└── is_active

organization_subscriptions
├── id
├── organization_id
├── plan_id
├── stripe_customer_id
├── stripe_subscription_id
├── status
├── trial_ends_at
└── current_period_end
```

## React Query Implementation

To keep subscription state available throughout the application:

```
src/features/subscription/hooks/use-subscription.ts
```

```typescript
import { useQuery } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscription-api';

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: subscriptionApi.getCurrentSubscription,
    staleTime: 5 * 60 * 1000, // Keep cached for 5 minutes
    refetchOnWindowFocus: true // Refresh when user returns to app
  });
}
```

```
src/features/subscription/components/subscription-provider.tsx
```

```typescript
import { ReactNode } from 'react';
import { useSubscription } from '../hooks/use-subscription';
import { createContext, useContext } from 'react';

// Create context for subscription state
const SubscriptionContext = createContext<{
  isActive: boolean;
  isPremium: boolean;
  isTrialing: boolean;
  plan: string | null;
  trialEndsAt: Date | null;
}>({
  isActive: false,
  isPremium: false,
  isTrialing: false,
  plan: null,
  trialEndsAt: null
});

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { data: subscription } = useSubscription();
  
  // Derive subscription state
  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';
  const isPremium = isActive && subscription?.plan_id !== 'free';
  const isTrialing = subscription?.status === 'trialing';
  
  return (
    <SubscriptionContext.Provider value={{
      isActive,
      isPremium,
      isTrialing,
      plan: subscription?.plan_id || null,
      trialEndsAt: subscription?.trial_ends_at ? new Date(subscription.trial_ends_at) : null
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// Hook to use the subscription context
export function useSubscriptionStatus() {
  return useContext(SubscriptionContext);
}
```

Then wrap the application with this provider in your layout:

```tsx
// src/app/layout.tsx
import { SubscriptionProvider } from '@/features/subscription/components/subscription-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <QueryClientProvider client={queryClient}>
            <SubscriptionProvider>
              {children}
            </SubscriptionProvider>
          </QueryClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
```

## Webhook Flow Details

Here's a more detailed explanation of how webhooks update your application state:

1. **Webhook Event Triggers**:
   - Stripe events that trigger webhooks include:
     - `checkout.session.completed` - Initial checkout completed
     - `customer.subscription.created` - New subscription created
     - `customer.subscription.updated` - Subscription plan/status changed
     - `customer.subscription.deleted` - Subscription canceled
     - `invoice.paid` - Successful payment (renewing subscription)
     - `invoice.payment_failed` - Failed payment attempt

2. **Webhook Handler Implementation**:
   ```typescript
   // src/app/api/webhooks/stripe/route.ts
   export async function POST(req: Request) {
     // Verify webhook signature
     // ...
     
     // Handle different event types
     switch (event.type) {
       case 'checkout.session.completed':
         // Extract metadata from the event
         const { organization_id, clerk_id } = event.data.object.metadata;
         
         // Update database
         await supabaseAdmin
           .from('organization_subscriptions')
           .update({
             stripe_customer_id: event.data.object.customer,
             stripe_subscription_id: event.data.object.subscription,
             status: 'trialing',
             trial_ends_at: calculateTrialEndDate(7), // 7-day trial
           })
           .eq('organization_id', organization_id);
         break;
         
       // Handle other event types
       // ...
     }
     
     return NextResponse.json({ received: true });
   }
   ```

3. **Database to UI Flow**:
   - Webhook updates database record
   - React Query detects stale data on window focus/navigation
   - React Query refetches subscription data
   - UI components reflect updated subscription state

4. **Multiple Environments**:
   - Development: Use Stripe CLI for webhook forwarding
     ```bash
     stripe listen --forward-to localhost:3000/api/webhooks/stripe
     ```
   - Production: Configure webhook URL in Stripe Dashboard
     `https://yourdomain.com/api/webhooks/stripe`

This webhook integration ensures your application always reflects the current subscription state in Stripe, providing a seamless experience for users as they move through the subscription lifecycle.

## Metadata Strategy

When creating Stripe checkout sessions, include these important metadata fields:

```typescript
metadata: {
  clerk_id: user.clerk_id,       // Link to authentication
  user_id: user.id,              // Internal user ID
  organization_id: org.id        // Organization ID
}
```

This metadata is returned in webhook events, allowing you to connect Stripe events to the right records in your database. This is crucial for a multi-tenant application where you need to know which organization's subscription has changed.
