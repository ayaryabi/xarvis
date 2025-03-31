# XARVIS Refactoring Plan

## Overview
This document outlines the step-by-step plan to refactor the existing codebase to follow the new feature-based architecture described in folder2.md.

## Current State
- Basic Next.js app router structure is in place
- Authentication uses Clerk (minimal implementation)
- Marketing/landing page has some components
- Component structure uses numbered prefixes (0-ui, 1-common, etc.)
- Supabase integration exists

## Target State
- Feature-based architecture where each feature is self-contained
- App router pages are thin wrappers that import from feature modules
- Shared UI components remain centralized
- Shared layouts remain in components/layout while feature-specific layouts live in feature folders

## Refactoring Tasks

### 1. Create Feature Directory Structure
```bash
mkdir -p src/features/auth/{components,hooks,api,layouts,pages,stores,types}
mkdir -p src/features/marketing/{components,hooks,api,layouts,pages,types}
```

### 2. Refactor Auth Feature

#### 2.1. Create Minimal Auth Pages
Since we're using Clerk directly, we'll create minimal wrapper pages for consistency:

```bash
touch src/features/auth/pages/sign-in-page.tsx
touch src/features/auth/pages/sign-up-page.tsx
```

Content for sign-in-page.tsx:
```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn />;
}
```

This maintains the architecture pattern while keeping the implementation simple.

#### 2.2. Create Auth Layout (Feature-Specific Only)
If auth has a specific layout beyond the shared shells:

```bash
touch src/features/auth/layouts/auth-layout.tsx
```

This would be based on existing src/app/(auth)/layout.tsx, but focused only on auth-specific layout needs.

#### 2.3. Update App Router Pages
Update src/app/(auth)/sign-in/[[...sign-in]]/page.tsx:
```tsx
export { default } from "@/features/auth/pages/sign-in-page";
```

Update src/app/(auth)/sign-up/[[...sign-up]]/page.tsx:
```tsx
export { default } from "@/features/auth/pages/sign-up-page";
```

Update src/app/(auth)/layout.tsx:
```tsx
export { default } from "@/features/auth/layouts/auth-layout";
```

#### 2.4. Create Auth Hooks and Store
```bash
touch src/features/auth/hooks/use-auth.ts
touch src/features/auth/stores/auth-store.ts
```

The auth hook will leverage Clerk's hooks but provide a consistent interface for the rest of the application.

#### 2.5. Create Auth-Specific API Integration (Not Supabase Client)
```bash
touch src/features/auth/api/auth-api.ts
```

This will contain auth-specific API functions, but NOT the Supabase client initialization, which stays in lib.

### 3. Refactor Marketing Feature

#### 3.1. Organize Marketing Components
```bash
# Create directories for marketing feature
mkdir -p src/features/marketing/components
mkdir -p src/features/marketing/pages

# Move UI components to components folder
cp src/components/4-pages/marketing/hero.tsx src/features/marketing/components/
cp src/components/4-pages/marketing/metrics.tsx src/features/marketing/components/
cp src/components/4-pages/marketing/results.tsx src/features/marketing/components/
cp src/components/4-pages/marketing/cost-comparison.tsx src/features/marketing/components/
cp src/components/4-pages/marketing/coming-soon.tsx src/features/marketing/components/

# Keep home-content as a page assembly
cp src/components/4-pages/marketing/home-content.tsx src/features/marketing/pages/
```

#### 3.2. Create Marketing Pages
```bash
touch src/features/marketing/pages/home-page.tsx
```

Content for home-page.tsx:
```tsx
"use client"
import { HomeContent } from "@/features/marketing/pages/home-content";

export default function HomePage() {
  return <HomeContent />;
}
```

#### 3.3. Marketing Layout Structure
Keep the shared marketing shell in the components directory:
```bash
# No action needed - keep src/components/3-layout/shells/marketing-shell.tsx where it is
```

Create a feature-specific layout only if needed (with elements specific to marketing beyond the shell):
```bash
# Only if marketing has unique layout needs beyond the shell
touch src/features/marketing/layouts/marketing-layout.tsx
```

#### 3.4. Update App Router Pages
Update src/app/(marketing)/page.tsx:
```tsx
export { default } from "@/features/marketing/pages/home-page";
```

If using a feature-specific layout, update src/app/(marketing)/layout.tsx:
```tsx
export { default } from "@/features/marketing/layouts/marketing-layout";
```
Otherwise, use the shared shell directly.

### 4. Update Imports

After moving files, update all imports to point to the new locations. Here are the main patterns:

- Change `@/components/4-pages/marketing/...` to `@/features/marketing/components/...` or `@/features/marketing/pages/...` depending on whether it's a UI component or page assembly
- Change `@/components/2-features/landing/...` to `@/features/marketing/components/...`

This will need to be done for each file that imports the moved components.

### 5. Create Store Structure for Features

```bash
touch src/features/auth/stores/auth-store.ts
```

Basic implementation of auth-store.ts:
```ts
import { create } from 'zustand';
import { User } from '@clerk/nextjs/dist/types/server';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
}));
```

### 6. Implement Auth Hook

In src/features/auth/hooks/use-auth.ts:
```ts
import { useUser } from "@clerk/nextjs";
import { useAuthStore } from "../stores/auth-store";
import { useEffect } from "react";

export function useAuth() {
  const { user, isLoaded } = useUser();
  const { setUser, user: storeUser, isLoading } = useAuthStore();
  
  useEffect(() => {
    if (isLoaded) {
      setUser(user || null);
    }
  }, [user, isLoaded, setUser]);

  return {
    user: storeUser,
    isLoading: isLoading && !isLoaded,
  };
}
```

### 7. Keep Database Structure Intact

The Supabase client and database utilities should remain in the lib directory:
```
src/lib/supabase/
├── client.ts       # Client initialization - stays here
├── db.ts           # Database utilities - stays here
├── types.ts        # Database types - stays here
└── auth.ts         # Auth-specific functions - consider moving relevant parts to feature
```

Feature-specific database operations can be added to the feature's API layer:
```ts
// src/features/auth/api/auth-api.ts
import { supabaseClient } from "@/lib/supabase/client";

export async function getUserProfile(userId: string) {
  // Auth-specific database operations
  return supabaseClient.from('profiles').select('*').eq('id', userId).single();
}
```

### 8. Testing

After completing the refactoring, test:
1. Authentication flow (sign-in, sign-out)
2. Landing page display
3. Any functionality that depends on auth

## Migration Strategy

This refactoring should be done in a dedicated branch and can be implemented in these phases:

1. **Structure Creation**: Create the new directories without moving files
2. **Feature by Feature**: Migrate one feature at a time, starting with marketing
3. **Testing**: Test each feature after migration before moving to the next
4. **Cleanup**: Remove old files once everything is working

## Layout Structure Clarification

The refactored architecture maintains two types of layouts:

1. **Shared Layout Components** (`src/components/layout/`) 
   - Reusable across features
   - Basic shells, headers, navigation
   - Example: marketing-shell.tsx, dashboard-shell.tsx

2. **Feature-Specific Layouts** (`src/features/[feature]/layouts/`)
   - Specific to one feature
   - May use shared shells but add feature-specific elements 
   - Example: auth-layout.tsx with auth-specific headers/footers

This provides flexibility while maintaining separation of concerns.

## Future Considerations

As you continue building the application:

1. **Begin new features** directly in the feature-based structure
2. **Dashboard Implementation** should follow the same pattern
3. **Subscription Feature** will need to be built next
4. **Facebook Authentication** can be implemented as a feature or part of a larger connections feature

## Post-Refactoring Roadmap

After completing the initial refactoring, follow this roadmap for further development:

### 1. Payment Integration (3-4 hours)
- **Implementation Steps:**
  1. Set up Stripe account and create product/price configurations
  2. Create subscription feature directory structure with API, hooks, and components
  3. Implement Stripe client for server-side API calls
  4. Create subscription plan database tables and relationships
  5. Build checkout flow and subscription management portal
  6. Set up webhook handler for subscription events

- **Key Components:**
  - **Subscription API:** Functions for creating checkout sessions, managing subscriptions
  - **Webhook Handler:** Process Stripe events (subscription created, updated, etc.)
  - **Pricing Component:** Display available plans with features and pricing
  - **Subscription Hook:** React Query hook to fetch and manage subscription data
  - **PaymentForm:** Handle credit card input and checkout process
  - **SubscriptionStatus:** Display current plan and usage information

- **Technical Considerations:**
  - Store Stripe customer ID in organizations table
  - Use webhook events to update subscription status
  - Implement usage tracking for metered features
  - Use React Query for subscription data caching

### 2. Dashboard & Core Features (4-6 hours)
- **Implementation Steps:**
  1. Create shared dashboard layout with navigation and sidebar
  2. Implement channel feature with components, hooks, and API
  3. Build channel creation and management UI
  4. Create user settings pages for account management
  5. Implement basic dashboard homepage with overview stats

- **Key Components:**
  - **DashboardShell:** Main layout wrapper with navigation and sidebar
  - **ChannelList:** Display all channels with filtering options
  - **ChannelCard:** Show channel summary and quick actions
  - **CreateChannelForm:** Form for creating new channels
  - **ChannelDetail:** Display channel information and interactions
  - **UserSettings:** Manage profile, preferences, and organization

- **Technical Considerations:**
  - Use React Query for data fetching and caching
  - Implement proper loading and error states
  - Create responsive design for mobile and desktop
  - Set up authorization checks for channel access

### 3. Facebook Authentication (2-3 hours)
- **Implementation Steps:**
  1. Create connections feature for managing platform integrations
  2. Implement OAuth flow for Facebook login
  3. Build ad account selection UI
  4. Create database tables for storing connections and ad accounts
  5. Implement connection status monitoring

- **Key Components:**
  - **ConnectFacebookButton:** Initiate OAuth flow
  - **FacebookAccountsList:** Display and manage connected accounts
  - **AdAccountSelector:** Allow users to select which ad accounts to use
  - **ConnectionStatus:** Show status of Facebook connection
  - **ConnectionAPI:** Functions for managing connections

- **Technical Considerations:**
  - Securely store access tokens
  - Implement token refresh mechanism
  - Handle permission scopes properly
  - Create error handling for failed connections

### 4. Background Jobs (2-3 hours)
- **Implementation Steps:**
  1. Set up job scheduling infrastructure
  2. Create agent-specific data collection jobs
  3. Implement data processing pipeline
  4. Add monitoring and error reporting
  5. Create admin interface for job management

- **Key Components:**
  - **JobScheduler:** Schedule and manage recurring jobs
  - **DataCollector:** Fetch data from Facebook and other platforms
  - **ProcessingPipeline:** Analyze and transform collected data
  - **JobQueue:** Handle job processing with retries
  - **JobMonitor:** Track job status and performance

- **Technical Considerations:**
  - Use a reliable scheduling mechanism
  - Implement proper error handling and retries
  - Design for idempotent operations
  - Add logging for debugging and monitoring
  - Consider using serverless functions for processing

### 5. Agent Integration (4-6 hours)
- **Implementation Steps:**
  1. Create agent feature structure with UI components and hooks
  2. Implement server-side agent logic
  3. Build agent activation and configuration flow
  4. Create recommendation display components
  5. Implement insights visualization

- **Key Components:**
  - **AgentCard:** Display agent information and status
  - **AgentActivation:** Onboarding flow for activating agents
  - **RecommendationCard:** Show agent recommendations
  - **InsightsDashboard:** Visualize agent insights and analytics
  - **AgentSettings:** Configure agent behavior and preferences

- **Technical Considerations:**
  - Design for multiple agent types
  - Use React Query for real-time data updates
  - Create clear separation between UI and logic
  - Implement proper loading and error states
  - Consider optimistic updates for better UX
