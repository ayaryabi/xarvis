# Stripe Checkout Flow Documentation

This document outlines the step-by-step user and data flow for initiating a Stripe subscription checkout within the XARVIS application.

**Core Assumption:** User sign-up via Clerk automatically triggers the creation of corresponding `user` and `organization` records in the Supabase database via webhooks or other integrations.

## Key Files Involved

*   **UI Components:**
    *   `src/features/subscription/pages/PricingPage.tsx`: Displays pricing, handles automatic redirect after login.
    *   `src/features/subscription/components/PricingTable.tsx`: Shows plan details.
    *   `src/features/subscription/components/CheckoutButton.tsx`: Handles user clicks, checks auth state, calls helper.
    *   `src/app/(auth)/...`: Clerk's UI pages for sign-up/sign-in.
*   **Frontend Logic:**
    *   `src/features/subscription/api/checkout-api.ts`: (Helper Function) Contains `fetch` logic to call the backend checkout API.
    *   `src/features/auth/hooks/use-auth.ts` (or Clerk's built-ins): Checks user authentication state.
    *   `useSearchParams` (from `next/navigation`): Reads URL query parameters.
    *   *(Future)* `src/features/subscription/hooks/useSubscriptionStatus.ts`: Uses React Query to fetch current status from `/api/subscription`.
*   **Backend API Endpoints:**
    *   `/app/api/checkout/route.ts`: Handles `POST` request from frontend; checks auth & DB; calls Stripe API; returns Stripe session URL or error.
    *   `/app/api/webhooks/stripe/route.ts`: Handles incoming `POST` webhook from Stripe; verifies signature; updates database based on event (e.g., `checkout.session.completed`).
    *   *(Future)* `/app/api/subscription/route.ts`: Handles `GET` request from frontend; checks DB; returns current subscription status.
*   **Shared Libraries:**
    *   `src/lib/stripe/client.ts`: Initializes Stripe SDK.
    *   `src/lib/stripe/webhooks.ts`: Contains logic for handling specific webhook events (e.g., `handleCheckoutSessionCompleted`).
    *   `src/lib/supabase/client.ts`, `src/lib/supabase/db.ts`: Supabase client and database helper functions (e.g., `getUserOrgId`, `getOrgSubscription`, `updateOrgSubscription`).
    *   `src/lib/utils/url.ts`: Helper to get the application's base URL.

---

## Scenario 1: Brand New User -> Wants Trial

1.  **User Action:** Lands on `/pricing` (not logged in), clicks "Start Trial" button for `PLAN_A`.
2.  **`CheckoutButton.tsx`:** Detects user is not signed in. Redirects browser to `/sign-up?redirect_url=/pricing?action=checkout&priceId=PLAN_A`.
3.  **Clerk:** User completes sign-up flow.
4.  **Backend Integration:** User/Organization created in Supabase (assumed).
5.  **Clerk:** Redirects the now logged-in user back to `/pricing?action=checkout&priceId=PLAN_A`.
6.  **`PricingPage.tsx` (`useEffect`):** Detects `isSignedIn=true` and the `action=checkout` & `priceId` parameters. Automatically calls `createCheckoutSession('PLAN_A')`.
7.  **`checkout-api.ts` (`createCheckoutSession`):** Sends `POST /api/checkout` with body `{ priceId: 'PLAN_A' }`.
8.  **`/api/checkout/route.ts`:**
    *   Gets `userId` via `auth()`.
    *   Looks up `organizationId` from DB using `userId`.
    *   Checks `organization_subscriptions` table for `organizationId` -> Finds nothing.
    *   Calls `stripe.checkout.sessions.create(...)` with `PLAN_A`, trial details, and `{ metadata: { supabaseOrgId: organizationId } }`.
    *   Receives `{ url: 'stripe_url...' }` from Stripe.
    *   Returns `NextResponse.json({ url: 'stripe_url...' })`.
9.  **`checkout-api.ts`:** Receives response, returns the `url`.
10. **`PricingPage.tsx` (`useEffect`):** Receives the `url`, redirects browser via `window.location.href = 'stripe_url...'`.
11. **User & Stripe:** User completes checkout on Stripe. Stripe redirects user to `/dashboard` (success_url).
12. **`/api/webhooks/stripe/route.ts` (Background):**
    *   Receives `checkout.session.completed` webhook from Stripe.
    *   Verifies signature.
    *   Extracts `organizationId` from metadata, extracts Stripe IDs (`subscription`, `customer`).
    *   Calls handler function (e.g., `handleCheckoutSessionCompleted` from `lib/stripe/webhooks.ts`) which updates `organization_subscriptions` table for `organizationId` with Stripe IDs and `status: 'trialing'`.
    *   Returns `200 OK` to Stripe.

**Result:** New user completes sign-up and starts trial successfully. DB reflects trial status.

---

## Scenario 2: Existing User (No Subscription) -> Logs In -> Wants Trial

*   Identical flow to Scenario 1, except:
    *   Step 2 redirects to `/sign-in?redirect_url=...`.
    *   Step 3 involves logging in, not signing up.
    *   Step 4 is skipped (user/org already exist).
*   The rest (Steps 5-12) proceeds identically as the DB check in Step 8 finds no existing subscription.

**Result:** Existing user logs in and starts trial successfully. DB reflects trial status.

---

## Scenario 3: Existing User (WITH Subscription) -> Clicks "Start Trial" (Backend Safety Check)

*   *Note: Ideally prevented by Scenario 4 UI.*
1.  **User Action:** Lands on `/pricing` (logged in, already subscribed), clicks "Start Trial" button for `PLAN_A`.
2.  **`CheckoutButton.tsx`:** Detects user is signed in. Calls `createCheckoutSession('PLAN_A')`.
3.  **`checkout-api.ts`:** Sends `POST /api/checkout` with body `{ priceId: 'PLAN_A' }`.
4.  **`/api/checkout/route.ts`:**
    *   Gets `userId` via `auth()`.
    *   Looks up `organizationId`.
    *   Checks `organization_subscriptions` table -> **Finds existing 'active' or 'trialing' subscription.**
    *   **Does NOT call Stripe.**
    *   Returns an error response (e.g., `NextResponse.json({ message: 'Already subscribed' }, { status: 400 })`).
5.  **`checkout-api.ts`:** Receives error response (`!response.ok`). Throws an error (e.g., `new Error('Already subscribed')`).
6.  **`CheckoutButton.tsx`:** Catches the error from the helper function. Shows an error message to the user (e.g., alert).

**Result:** Checkout process is stopped by the backend. No duplicate Stripe session created. User sees an error.

---

## Scenario 4: Existing User (WITH Subscription) -> Lands on Pricing Page (Ideal UX)

1.  **User Action:** Lands on `/pricing` (logged in, already subscribed).
2.  **Frontend State Fetching (`PricingPage.tsx` or Layout):**
    *   A hook (`useSubscriptionStatus`) uses React Query to fetch data from `GET /api/subscription`.
    *   *(The `/api/subscription/route.ts` endpoint simply looks up the user's organization and returns its current status from the `organization_subscriptions` table, e.g., `{ status: 'active' }`)*.
3.  **Conditional Rendering (`PricingTable.tsx` or `PricingPage.tsx`):**
    *   The component receives the `{ status: 'active' }` data via the hook/React Query.
    *   It uses this status to conditionally render UI. **It does NOT render the "Start Trial" `CheckoutButton`.**
    *   Instead, it renders alternative UI, like "You are currently subscribed" text or a "Manage Subscription" button (which would eventually link to the Stripe Billing Portal).

**Result:** User is immediately shown they are subscribed and is not presented with the option to start a trial again, providing a smooth user experience and preventing unnecessary clicks/errors.

---

## Phase 1 Setup Checklist (Folders & Placeholders)

1.  **Create Feature Folders:**
    *   `mkdir -p src/features/subscription/api`
    *   `mkdir -p src/features/subscription/components`
    *   `mkdir -p src/features/subscription/hooks`
    *   `mkdir -p src/features/subscription/pages`
2.  **Create API Route Folders:**
    *   `mkdir -p src/app/api/checkout`
    *   `mkdir -p src/app/api/webhooks/stripe`
    *   `mkdir -p src/app/api/subscription`
    *   `mkdir -p src/app/api/\(billing\)/portal`
3.  **Create Library Folder:**
    *   `mkdir -p src/lib/stripe`
4.  **Create Placeholder Files (touch command):**
    *   `touch src/features/subscription/api/checkout-api.ts`
    *   `touch src/features/subscription/api/subscription-api.ts` # For future status check
    *   `touch src/features/subscription/components/CheckoutButton.tsx`
    *   `touch src/features/subscription/components/PricingTable.tsx`
    *   `touch src/features/subscription/hooks/useSubscriptionStatus.ts` # For future status check
    *   `touch src/features/subscription/pages/PricingPage.tsx`
    *   `touch src/app/api/checkout/route.ts`
    *   `touch src/app/api/webhooks/stripe/route.ts`
    *   `touch src/app/api/subscription/route.ts`
    *   `touch src/app/api/\(billing\)/portal/route.ts`
    *   `touch src/lib/stripe/client.ts`
    *   `touch src/lib/stripe/webhooks.ts` # Added per revised plan
5.  **Initialize Stripe Client:**
    *   Add basic Stripe client initialization code to `src/lib/stripe/client.ts`.
6.  **Environment Variables:**
    *   Add `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.local`.
7.  **Install Stripe:**
    *   `npm install stripe --legacy-peer-deps`

*(Note: This checklist assumes `src/lib/supabase/db.ts` and `src/lib/utils/url.ts` will be created/updated as needed during implementation. Add `src/lib/stripe/webhooks.ts` placeholder.)*

---

## Phase 2: Core Checkout Flow - Implementation Plan

**Phase 2a: Checkout Initiation & Redirect**

*   **Goal:** Get the user from clicking the button to the Stripe checkout page successfully, handling auth and preventing duplicates.
*   **Steps:**
    1.  **Database Helpers (`src/lib/supabase/db.ts`):** Implement/Verify `getUserOrgId` and `getOrgSubscription`.
    2.  **URL Helper (`src/lib/utils/url.ts`):** Implement/Verify `getBaseUrl`.
    3.  **Backend API (`/api/checkout/route.ts`):** Implement `POST` handler logic (auth, DB check, Stripe call, metadata, return URL/error).
    4.  **Frontend Helper (`checkout-api.ts`):** Implement `createCheckoutSession` function.
    5.  **Frontend UI (`CheckoutButton`, `PricingTable`, `PricingPage`):** Implement components, auth check, post-login redirect, call helper.
*   **Testing Goal:** Verify correct redirection/error handling for logged-out, new logged-in, and already subscribed users.

**Phase 2b: Webhook Confirmation & Database Update**

*   **Goal:** Process the confirmation from Stripe and update the database.
*   **Steps:**
    1.  **Database Helper (`src/lib/supabase/db.ts`):** Implement/Verify `updateOrgSubscription`.
    2.  **Webhook Handler Logic (`src/lib/stripe/webhooks.ts`):** Implement `handleCheckoutSessionCompleted` function (extract IDs, call `updateOrgSubscription`).
    3.  **Webhook API Endpoint (`/api/webhooks/stripe/route.ts`):** Implement `POST` handler (verify signature, dispatch to `handleCheckoutSessionCompleted`).
*   **Testing Goal:** Use Stripe CLI/test webhooks to verify DB update on `checkout.session.completed` event.
