# XARVIS Authentication & Subscription Implementation Guide

This guide provides a practical walkthrough of implementing authentication and subscription management in XARVIS, explaining both what to do and why each step matters.

## Database Setup: The Foundation

**Step 1: Create the core database tables in Supabase**

You'll need to create several interconnected tables that form the foundation of your multi-tenant system:

- **users table**: Stores basic user information and links to Clerk authentication with fields for `id`, `clerk_id`, `email`, `name`, and `avatar_url`. This table is essential because it bridges the external authentication (Clerk) with your application's data model.

- **organizations table**: Defines the top-level grouping for multi-tenancy with fields for `id`, `name`, and `settings`. This is necessary because in a SaaS application, each customer typically represents an organization rather than just an individual user.

- **organization_members table**: Establishes the many-to-many relationship between users and organizations with fields like `organization_id`, `user_id`, and `role`. This table enables team collaboration by allowing multiple users to belong to the same organization with different permission levels.

- **subscription_plans table**: Defines the available pricing tiers with fields for `name`, `monthly_price`, `yearly_price`, and `limits`. The `limits` field uses JSONB to store a flexible structure of feature restrictions, which gives you the ability to easily add new limitations without changing your database schema.

- **organization_subscriptions table**: Tracks each organization's active subscription with fields for `organization_id`, `plan_id`, `stripe_subscription_id`, and `status`. This table connects your internal subscription data with Stripe's payment system.

- **usage_logs table**: Records feature usage for metered features with fields for `organization_id`, `feature`, `count`, and date ranges. This is crucial for enforcing usage limits and providing transparency to customers about their consumption.

**Step 2: Configure default subscription plans**

Insert at least two subscription plans:

- A **Free plan** with very limited capabilities (1 channel, 2 members, 1 ad account)
- A **Pro plan** with expanded limits (5 channels, 10 members, 3 ad accounts)

This structure allows new users to try the system without payment while providing a clear upgrade path when they need more capacity.

**Step 3: Implement Row-Level Security**

Apply Supabase RLS policies to ensure data security by controlling access based on user identity. For example, users should only see organizations they are members of, and subscription data should only be visible to organization admins. This prevents data leakage between different tenants of your application.

## Authentication Setup: Secure User Identity

**Step 1: Configure Clerk**

Set up a Clerk application to handle the user authentication flow, including:

- Creating your application in the Clerk dashboard
- Setting up OAuth providers like Google for seamless sign-in
- Configuring redirect URLs to ensure smooth authentication flow

Clerk handles all the complex security aspects of authentication, including sessions, tokens, and multi-factor authentication, allowing you to focus on your core application.

**Step 2: Integrate Clerk with Next.js**

Install the Clerk SDK and configure your environment variables with the necessary Clerk API keys. Add the `ClerkProvider` to your root layout to enable authentication throughout your application. This makes authentication state available to all components.

**Step 3: Create authentication pages**

Build the login and registration pages using Clerk's pre-built components. These provide a polished authentication experience with minimal effort, handling edge cases like password resets and email verification.

**Step 4: Implement authentication middleware**

Set up the Clerk middleware to protect routes that require authentication. The middleware checks if users are logged in before allowing access to protected pages and API routes. You'll configure public routes like the landing page and webhook endpoints to remain accessible without authentication.

**Step 5: Synchronize Clerk users with your database**

Create a webhook handler that listens for Clerk user events and syncs them with your Supabase database. When a new user registers:

1. Create an entry in your `users` table with their Clerk ID and profile information
2. Automatically create a new organization for them
3. Add them as an admin to that organization
4. Assign the free subscription plan to their organization

This synchronization ensures that your application data model stays in sync with the authentication system, creating a seamless user onboarding experience.

**Step 6: Build an auth hook for frontend access**

Create a custom React hook (`useAuth`) that combines Clerk's authentication state with your Supabase user data. This hook provides components with the authenticated user's information and their organizations, simplifying access to authentication context throughout your application.

## Subscription Management: Monetizing Your Application

**Step 1: Set up Stripe**

Create a Stripe account and configure your product with the same pricing tiers defined in your database. Set up webhook endpoints to receive real-time payment events. Stripe provides reliable payment processing and subscription management with support for multiple payment methods and currencies.

**Step 2: Create the Stripe client**

Install the Stripe SDK and set up a server-side client for interacting with the Stripe API. This client will be used to create checkout sessions, manage subscriptions, and process webhooks.

**Step 3: Implement the Stripe webhook handler**

Create an API route that processes Stripe webhook events such as:

- Subscription creation and updates
- Payment failures
- Subscription cancellations

When these events occur, update your database to reflect the current subscription status. This keeps your internal subscription records in sync with the payment processor's data.

**Step 4: Create subscription API endpoints**

Build API routes for:

- Initiating subscription checkouts: When users want to upgrade, this creates a Stripe checkout session and redirects them to Stripe's payment page
- Accessing the customer portal: Allows users to manage their existing subscription, update payment methods, and view billing history

These endpoints connect your frontend subscription management UI to Stripe's payment infrastructure.

**Step 5: Implement the subscription hook**

Create a custom React hook (`useSubscription`) that:

1. Fetches the current organization's subscription data
2. Provides the subscription status and plan details to components
3. Offers an `isFeatureAllowed` method to check if a specific feature is available based on the organization's plan

This hook is crucial for implementing feature gating throughout your application, ensuring users only access features included in their subscription plan.

## UI Implementation: User-Facing Management

**Step 1: Build the billing page**

Create a subscription management page with:

- Current plan details and status
- Visual presentation of usage limits and current consumption
- Plan comparison table showing the benefits of upgrading
- Buttons to manage the current subscription or upgrade to a higher tier

This page gives users transparency into their subscription and makes it easy to upgrade when needed.

**Step 2: Create the feature gate component**

Implement a reusable React component (`FeatureGate`) that:

1. Accepts a feature name and required usage count
2. Checks if the current organization's plan allows that usage
3. Renders its children only if the feature is allowed, or a fallback UI if not

This component provides a clean, declarative way to restrict access to premium features throughout your application.

**Step 3: Build the usage tracking utility**

Create a function (`trackUsage`) that records feature usage in your database, which:

1. Identifies the current billing period
2. Checks if a usage record already exists for the current period
3. Creates or updates the usage record accordingly

This utility enables you to enforce usage-based limits (like daily API calls or report generations) and provide usage analytics to users.

## Testing and Validation: Ensuring Everything Works

**Step 1: Test the authentication flow**

Verify that users can:
- Register for a new account
- Log in with existing credentials
- Access protected routes when authenticated
- Get automatically redirected to login when accessing protected content without authentication

Also ensure that user data correctly synchronizes between Clerk and your database.

**Step 2: Test the subscription flow**

Confirm that:
- New users automatically receive the free plan
- Users can upgrade to paid plans via Stripe
- Subscription changes in Stripe are reflected in your application
- Users can manage their subscription through the billing portal

**Step 3: Test usage tracking and feature gating**

Validate that:
- Feature usage is correctly tracked in the database
- Users cannot access features beyond their plan limits
- Usage counters reset appropriately at the beginning of new billing periods

## How to Use This Implementation

When implementing authentication and subscription management:

1. Start with the database setup to establish your data foundation
2. Implement authentication next, as it's required for almost everything else
3. Add subscription management capabilities
4. Build the UI components for user interaction
5. Finally, thoroughly test the entire flow

This layered approach ensures each component builds upon a solid foundation, resulting in a robust authentication and subscription system for your SaaS application. 