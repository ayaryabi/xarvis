# XARVIS Architecture Documentation

## Table of Contents
- [Overview](#overview)
- [Folder Structure](#folder-structure)
  - [Root Structure](#root-structure)
  - [Source Code Structure](#source-code-structure)
- [State Management](#state-management)
- [API Structure](#api-structure)
- [Implementation Phases](#implementation-phases)
- [Key Architecture Decisions](#key-architecture-decisions)
- [Future Considerations](#future-considerations)

## Overview

XARVIS is a multi-tenant SaaS application for AI-powered ad campaign management with a modern Next.js architecture.

## Folder Structure

### Root Structure

```
/
├── src/                        # Source code
├── public/                     # Static assets
├── brain/                      # Documentation & architecture
├── .next/                      # Next.js build output
├── node_modules/               # Dependencies
├── .gitignore
├── middleware.ts               # Global middleware for all routes
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.mjs
├── next.config.js
└── README.md
```

### Source Code Structure

```
src/
├── app/                        # Next.js 13+ App Router
│   ├── layout.tsx              # Root layout (minimal, shared across all pages)
│   ├── globals.css             # Global styles
│   │
│   ├── (auth)/                 # Authentication routes (grouped)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx          # Auth-specific layout
│   │
│   ├── (dashboard)/            # Main application routes (grouped)
│   │   ├── layout.tsx          # Dashboard layout with navigation
│   │   ├── page.tsx            # Home with channels list
│   │   │
│   │   ├── [channelId]/        # Channel specific pages
│   │   │   ├── layout.tsx      # Channel layout with tabs
│   │   │   ├── page.tsx        # Messages view (default)
│   │   │   ├── agents/
│   │   │   │   └── page.tsx    # Agent management
│   │   │   ├── connections/
│   │   │   │   └── page.tsx    # Ad account connections
│   │   │   └── settings/
│   │   │       └── page.tsx    # Channel settings
│   │   │
│   │   ├── settings/           # Organization settings
│   │   │   ├── layout.tsx      # Settings layout with tabs
│   │   │   ├── page.tsx        # General settings
│   │   │   ├── team/
│   │   │   │   └── page.tsx    # Team management
│   │   │   ├── billing/
│   │   │   │   └── page.tsx    # Subscription management
│   │   │   └── accounts/
│   │   │       └── page.tsx    # Ad account management
│   │   │
│   │   └── marketplace/        # Agent marketplace
│   │       └── page.tsx
│   │
│   ├── (marketing)/            # Marketing and legal pages (grouped)
│   │   ├── layout.tsx          # Marketing layout with shared elements
│   │   ├── page.tsx            # Landing page (home)
│   │   ├── pricing/            # Pricing page
│   │   │   └── page.tsx
│   │   ├── about/              # About us page
│   │   │   └── page.tsx
│   │   ├── contact/            # Contact page
│   │   │   └── page.tsx
│   │   │
│   │   └── legal/              # Legal pages
│   │       ├── privacy/
│   │       │   └── page.tsx    # Privacy policy
│   │       ├── terms/
│   │       │   └── page.tsx    # Terms of service
│   │       └── data-deletion/
│   │           └── page.tsx    # Data deletion policy
│   │
│   ├── api/                    # API routes (enhanced for agents)
│   │   ├── auth/               # Auth related endpoints
│   │   │   └── [...clerk]/     # Clerk authentication handlers
│   │   │
│   │   ├── webhooks/           # Webhooks
│   │   │   ├── stripe/         # Stripe payment webhooks
│   │   │   └── platforms/      # Ad platform webhooks
│   │   │
│   │   ├── channels/           # Channel management
│   │   │   ├── route.ts        # CRUD operations
│   │   │   └── [id]/
│   │   │       └── route.ts    # Specific channel operations
│   │   │
│   │   ├── messages/           # Message handling
│   │   │   └── route.ts        # Message operations
│   │   │
│   │   ├── agents/             # Agent operations
│   │   │   ├── orion/          # Orion-specific endpoints
│   │   │   │   ├── analyze/    # Analysis endpoints
│   │   │   │   │   └── route.ts
│   │   │   │   └── report/     # Reporting endpoints
│   │   │   │       └── route.ts
│   │   │   │
│   │   │   └── campaign-creator/ # Campaign creation endpoints
│   │   │       ├── assets/     # Asset handling
│   │   │       │   └── route.ts
│   │   │       ├── targeting/  # Targeting options
│   │   │       │   └── route.ts
│   │   │       └── preview/    # Campaign preview
│   │   │           └── route.ts
│   │   │
│   │   └── platforms/          # Platform integrations
│   │       ├── facebook/       # Facebook-specific endpoints
│   │       │   ├── auth/       # Auth flow
│   │       │   │   └── route.ts
│   │       │   ├── accounts/   # Account management
│   │       │   │   └── route.ts
│   │       │   └── campaigns/  # Campaign management
│   │       │       └── route.ts
│   │       └── tiktok/         # TikTok endpoints (similar structure)
│   │
│   ├── error.tsx               # Global error page for app router
│   ├── not-found.tsx           # 404 page
│   │
│   └── legal/                  # Legal pages
│       ├── privacy/
│       ├── terms/
│       └── data-deletion/
│
├── stores/                     # Zustand stores for complex state
│   ├── index.ts                # Export all stores
│   ├── campaign-creator.ts     # Campaign creator store
│   ├── auth.ts                 # Authentication state
│   ├── subscription.ts         # Subscription features/status
│   └── preferences.ts          # User preferences
│
├── queries/                    # React Query configurations
│   ├── index.ts                # Query client setup
│   ├── channels.ts             # Channel-related queries
│   ├── messages.ts             # Message-related queries
│   └── agents.ts               # Agent-related queries
│
├── components/                 # Reusable React components (improved structure)
│   ├── ui/                     # Primitive UI components (atomic)
│   │   ├── button/
│   │   │   ├── index.tsx       # Main button component
│   │   │   └── variants.ts     # Button variant definitions
│   │   ├── input/
│   │   │   ├── index.tsx       # Text input component
│   │   │   └── textarea.tsx    # Textarea component
│   │   ├── select/
│   │   │   ├── index.tsx       # Select component
│   │   │   └── combobox.tsx    # Autocomplete select
│   │   ├── avatar.tsx          # Avatar/profile picture
│   │   ├── card.tsx            # Card container
│   │   ├── dialog.tsx          # Modal dialog
│   │   ├── dropdown.tsx        # Dropdown menu
│   │   ├── tabs.tsx            # Tab navigation
│   │   ├── toast.tsx           # Toast notifications
│   │   └── tooltip.tsx         # Tooltips
│   │
│   ├── layout/                 # Layout components
│   │   ├── navigation/         # Navigation elements
│   │   │   ├── main-nav.tsx    # Main left navigation
│   │   │   ├── channel-list.tsx # Channel sidebar
│   │   │   ├── channel-tabs.tsx # Channel top navigation
│   │   │   └── mobile-nav.tsx  # Mobile navigation
│   │   │
│   │   ├── shells/            # Layout shells
│   │   │   ├── dashboard-shell.tsx # Dashboard layout shell
│   │   │   ├── auth-shell.tsx  # Authentication page shell
│   │   │   └── marketing-shell.tsx # Marketing page shell
│   │   │
│   │   ├── header.tsx         # App header
│   │   └── footer.tsx         # App footer
│   │
│   ├── common/                # Composite components used across features
│   │   ├── data-display/      # Data presentation components
│   │   │   ├── data-table/    # Complex data tables
│   │   │   │   ├── index.tsx  # Main component
│   │   │   │   ├── column.tsx # Column definition
│   │   │   │   └── pagination.tsx # Table pagination
│   │   │   │
│   │   │   ├── charts/        # Data visualization
│   │   │   │   ├── bar-chart.tsx
│   │   │   │   ├── line-chart.tsx
│   │   │   │   └── area-chart.tsx
│   │   │   │
│   │   │   └── metrics/       # Metrics display
│   │   │       ├── kpi-card.tsx # KPI display component
│   │   │       └── stat-comparison.tsx # Comparison stats
│   │   │
│   │   ├── forms/             # Form-related components
│   │   │   ├── form.tsx       # Form wrapper with validation
│   │   │   ├── form-field.tsx # Individual form field
│   │   │   └── submit-button.tsx # Form submission button
│   │   │
│   │   └── feedback/          # User feedback components
│   │       ├── loading-spinner.tsx
│   │       ├── error-message.tsx
│   │       └── empty-state.tsx
│   │
│   ├── features/              # Feature-specific components
│   │   ├── channels/          # Channel-related components
│   │   │   ├── channel-card.tsx
│   │   │   ├── channel-grid.tsx
│   │   │   ├── create-channel-form.tsx
│   │   │   └── channel-settings-form.tsx
│   │   │
│   │   ├── messages/          # Message related components
│   │   │   ├── message-list.tsx # Messages container
│   │   │   ├── message-item.tsx # Individual message
│   │   │   ├── message-thread.tsx # Thread component
│   │   │   └── message-input.tsx # Message input box
│   │   │
│   │   ├── agents/            # Agent related components
│   │   │   ├── common/        # Shared agent components
│   │   │   │   ├── agent-card.tsx # Agent display card
│   │   │   │   ├── agent-settings.tsx # Agent configuration
│   │   │   │   └── action-block.tsx # Action buttons component
│   │   │   │
│   │   │   ├── orion/         # Orion-specific components
│   │   │   │   ├── performance-card.tsx # Performance visualization
│   │   │   │   ├── recommendation-block.tsx # Recommendation display
│   │   │   │   ├── trend-chart.tsx # Trend visualization
│   │   │   │   ├── orion-report.tsx # Full report component
│   │   │   │   └── orion-alert.tsx # Alert component
│   │   │   │
│   │   │   └── campaign-creator/ # Campaign creation components
│   │   │       ├── asset-uploader.tsx # Asset management UI
│   │   │       ├── campaign-builder.tsx # Main builder interface
│   │   │       ├── targeting-selector.tsx # Targeting options UI
│   │   │       └── budget-controls.tsx # Budget configuration UI
│   │   │
│   │   ├── connections/       # Ad account connection components
│   │   │   ├── account-connect.tsx # Account connection flow
│   │   │   ├── account-list.tsx # Connected accounts list
│   │   │   └── platform-buttons/ # Platform-specific buttons
│   │   │       ├── facebook-connect.tsx
│   │   │       └── tiktok-connect.tsx
│   │   │
│   │   └── subscription/      # Subscription related components
│   │       ├── plan-card.tsx  # Subscription plan display
│   │       ├── usage-display.tsx # Usage metrics
│   │       └── checkout-form.tsx # Payment form
│   │
│   ├── pages/                # Page-specific assemblies
│   │   ├── marketing/        # Landing page components
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   └── pricing.tsx
│   │   │
│   │   ├── dashboard/        # Dashboard page components
│   │   │   └── summary-section.tsx
│   │   │
│   │   ├── onboarding/       # Onboarding flow components
│   │   │   ├── step-one.tsx
│   │   │   ├── step-two.tsx
│   │   │   └── progress-bar.tsx
│   │   │
│   │   └── settings/         # Settings page components
│   │       ├── team-section.tsx
│   │       └── billing-section.tsx
│   │
│   └── error/                # Error handling components
│       ├── error-boundary.tsx # React error boundary component
│       ├── error-display.tsx  # Error visualization
│       └── fallback-ui.tsx    # Fallback UI when errors occur
│
├── server/                     # Dedicated server-side code (separate from lib)
│   ├── core/                   # Foundational utilities and shared services
│   │   ├── config.ts           # Configuration management
│   │   ├── database.ts         # Database connection and utilities
│   │   └── types.ts            # Core type definitions
│   │
│   ├── platforms/              # Third-party platform integrations
│   │   ├── facebook/
│   │   │   ├── client.ts       # FB API client
│   │   │   ├── auth.ts         # Authentication
│   │   │   ├── insights.ts     # Performance data fetching
│   │   │   └── publishing.ts   # Campaign publishing
│   │   └── tiktok/             # Similar structure for TikTok
│   │
│   ├── agents/                 # Agent implementations
│   │   ├── base/
│   │   │   ├── agent.ts        # Base agent class
│   │   │   └── types.ts        # Shared agent types
│   │   │
│   │   ├── orion/              # Orion agent implementation
│   │   │   ├── index.ts        # Main entry point
│   │   │   ├── collector.ts    # FB data collection
│   │   │   ├── analyzer.ts     # Performance analysis
│   │   │   ├── categorizer.ts  # Ad categorization logic
│   │   │   ├── prompts.ts      # AI prompt templates
│   │   │   └── formatter.ts    # Response formatting
│   │   │
│   │   └── campaign-creator/   # Campaign creation agent
│   │       ├── index.ts        # Main entry point
│   │       ├── validator.ts    # Campaign validation
│   │       ├── generator.ts    # Campaign structure generator
│   │       ├── asset-processor.ts # Image/video processing
│   │       └── publisher.ts    # Campaign publishing
│   │
│   ├── ai/                     # AI service integrations
│   │   ├── openai.ts           # OpenAI client
│   │   ├── claude.ts           # Claude client
│   │   └── prompt-builder.ts   # Common prompt construction
│   │
│   └── jobs/                   # Background jobs
│       ├── scheduler.ts        # Job scheduling
│       ├── data-sync.ts        # Regular data collection
│       └── report-generator.ts # Automated reporting
│
├── lib/                        # Client-side libraries and utilities
│   ├── supabase/               # Supabase client & helpers
│   │   ├── client.ts           # Supabase client initialization
│   │   ├── auth.ts             # Authentication helpers
│   │   ├── db.ts               # Database helpers
│   │   └── types.ts            # Database types
│   │
│   ├── clerk/                  # Clerk authentication helpers
│   │   ├── client.ts
│   │   └── server.ts
│   │
│   ├── stripe/                 # Stripe integration
│   │   ├── client.ts
│   │   ├── subscriptions.ts
│   │   └── webhooks.ts
│   │
│   ├── api/                    # Client-side API interfaces
│   │   ├── agents.ts           # Agent API client
│   │   └── platforms.ts        # Platform API client
│   │
│   ├── errors/                 # Error handling utilities
│   │   ├── api-error.ts        # API error handling and formatting
│   │   ├── error-logger.ts     # Error logging service
│   │   └── error-types.ts      # Error type definitions
│   │
│   └── utils/                  # Shared utilities
│       ├── format.ts           # Formatting helpers
│       ├── date.ts             # Date manipulation
│       ├── validation.ts       # Input validation
│       └── metrics.ts          # Analytics helpers
│
├── hooks/                      # Custom React hooks
│   ├── use-channel.ts          # Uses React Query
│   ├── use-messages.ts         # Uses React Query
│   ├── use-auth.ts             # Uses Zustand
│   ├── use-subscription.ts     # Uses Zustand
│   ├── use-campaign-creator.ts # Uses Zustand
│   ├── use-agent.ts            # Uses React Query
│   ├── use-error-handler.ts    # Stays as React hook
│   └── use-media-query.ts      # Stays as React hook
│
├── contexts/                   # Reduced dependency on contexts
│   └── error-context.tsx       # Keep for error handling
│
└── types/                      # TypeScript definitions
    ├── supabase.ts             # Generated Supabase types
    ├── agent.ts                # Agent type definitions
    ├── message.ts              # Message type definitions
    ├── platform.ts             # Ad platform type definitions
    ├── subscription.ts         # Subscription type definitions
    ├── error.ts                # Error type definitions
    └── api.ts                  # API response/request types
```

## State Management

XARVIS uses a hybrid approach to state management:

1. **Zustand** for complex UI state
   - Campaign creator workflows
   - User preferences
   - Authentication state
   - Subscription status

2. **React Query** for server data
   - Channel and message data
   - Agent data and operations
   - Platform integration data

3. **React's Built-in Hooks** for simple component state
   - UI toggles and form inputs
   - Component-specific state
   - Media queries and user interactions

## API Structure

The API follows a domain-driven design with these key characteristics:

1. **Resource-Based Organization**
   - Each domain has its own directory (`/api/channels`, `/api/agents`, etc.)
   - Domain-specific operations are grouped together

2. **Agent-Specific Endpoints**
   - Each agent has dedicated endpoints
   - Specialized operations per agent type

3. **Platform Integrations**
   - Each platform has its own endpoints
   - Common patterns across platforms

4. **Server Actions Optimization**
   - Simple CRUD operations can bypass API routes using Server Actions
   - Forms and basic data mutations can connect directly to server functions
   - Reduces boilerplate while maintaining the same business logic

## Implementation Phases

This structure can be implemented in phases:

1. **Phase 1 (Authentication & Basic Structure)**
   - Set up main app layout
   - Implement auth pages and Clerk integration
   - Create basic dashboard layout
   - Implement basic error handling

2. **Phase 2 (Core Functionality)**
   - Channel creation and management
   - Basic messaging system
   - User and organization settings

3. **Phase 3 (Ad Platform Integration)**
   - Facebook/ad platform OAuth
   - Account connection flow
   - Ad data collection and storage

4. **Phase 4 (Agent Implementation)**
   - Basic agent framework
   - First agent implementation (Orion)
   - Performance tracking and reporting

5. **Phase 5 (Campaign Creation Agent)**
   - Asset management
   - Campaign building interface
   - Publishing workflow

6. **Phase 6 (Subscription & Marketplace)**
   - Stripe integration
   - Subscription plans and management
   - Agent marketplace

## Key Architecture Decisions

1. **Separation of Client and Server Code**
   - `server/` directory contains all backend agent logic
   - `components/` contains frontend presentation
   - Clean separation of concerns for complex agent implementations

2. **Component Organization Strategy**
   - **Atomic Design Hierarchy**
     - UI components: Smallest building blocks (buttons, inputs)
     - Common components: Reusable across features (tables, charts)
     - Feature components: Specific to a feature area
     - Page components: Assemblies specific to certain pages

   - **Co-location Strategy**
     - Related components are kept together
     - Components that change together are near each other
     - More specialized components are nested deeper

3. **Agent-Specific Organization**
   - Each agent has dedicated directories
   - Specialized components for each agent's unique UI needs
   - Modular implementation with shared base components

4. **Error Handling Strategy**
   - Centralized error types and utilities in `lib/errors`
   - React error boundaries at key UI levels in `components/error`
   - Global error handling via error context
   - Consistent API error handling patterns
   - App Router error pages for route-level errors

5. **Extensible Platform Integration**
   - Structured approach to multiple ad platforms
   - Common patterns for authentication and API access
   - Platform-specific implementation details isolated

6. **Background Processing Support**
   - Job scheduling for Orion's daily data collection
   - Asynchronous processing for intensive operations
   - Clear separation from web request handling

7. **Server Actions Integration**
   - Server functions can be defined directly in or near components using the `"use server"` directive
   - Simple data mutations like form submissions can bypass API routes entirely
   - The server-side business logic in `server/` remains the source of truth
   - API routes still used for:
     - Complex operations (agent processing, analytics)
     - Endpoints used by multiple components
     - Public APIs and webhooks
   - Implementation pattern:
     ```
     // For simple operations
     Component with form → Server Action → server/[domain]/service → Database
     
     // For complex operations (unchanged)
     Component → Client API call → API Route → server/[domain]/service → Database
     ```
   - No changes to folder structure required, but reduces the need for simple API routes

   8.  - **Development Utilities**
     - Add a `scripts/` folder at the root level for development tooling:
     ```
     scripts/
     ├── seed-data.ts        # Database seeding for development
     ├── mock-agents.ts      # Simulate agent behavior for testing
     ├── generate-types.ts   # Generate TypeScript types from database schema
     └── reset-dev-env.ts    # Reset development environment
     ```
     - These utilities simplify common development tasks and ensure consistency
   
   - **Centralized Analytics**
     - Create `lib/analytics.ts` as a single entry point for all analytics tracking:
     ```typescript
     // Example analytics abstraction
     export const analytics = {
       pageView: (path: string) => { /* implementation */ },
       trackEvent: (name: string, properties?: Record<string, any>) => { /* implementation */ },
       identifyUser: (userId: string, traits?: Record<string, any>) => { /* implementation */ }
     };
     ```
     - Benefits include easier provider switching, consistent tracking patterns, and simplified debugging

9. **Middleware Implementation**
   - Single `middleware.ts` file at the project root processes all requests before they reach pages/API routes
   - Used for cross-cutting concerns that should apply consistently across the application
   - Implementation responsibilities:
     - Authentication validation and route protection
     - Adding security headers to all responses
     - Logging and analytics tracking
     - Rate limiting for API endpoints
     - A/B testing and feature flag evaluation
   - Runs completely outside of React component lifecycle (server-side only)
   - Benefits include reduced code duplication, consistent behavior enforcement, and simplified authentication flows

## Future Considerations

As the application scales, the following areas should be addressed:

1. **Advanced State Management**
   - Evaluate Zustand or similar for more efficient global state
   - Implement React Query/SWR for server state management
   - Consider Redux for more complex state requirements

2. **Testing Strategy**
   - Add `__tests__` directories alongside components
   - Implement Jest/React Testing Library for component testing
   - Add Playwright for E2E testing
   - Create API testing patterns

3. **API Structure Improvements**
   - Consider flatter, resource-oriented API structure
   - Implement API versioning
   - Add comprehensive API documentation

4. **Internationalization**
   - Integrate next-intl or similar library
   - Create translation file structure
   - Implement language switching mechanism

5. **Performance Optimizations**
   - Implement advanced code splitting strategies
   - Add performance monitoring
   - Implement server-side caching
   - Optimize Core Web Vitals

6. **Enhanced Mobile Experience**
   - Develop comprehensive mobile strategy
   - Create mobile-specific navigation patterns
   - Optimize for touch interactions
   - Consider PWA capabilities

7. **Security Enhancements**
   - Implement CSRF protection
   - Add XSS prevention measures
   - Create sensitive data handling procedures
   - Integrate security scanning

8. **Advanced Next.js Features**
   - **Intercepting Routes**: For modal-like experiences when viewing details or previews
   - **Parallel Routes**: For side-by-side comparison of campaigns or agent views
   - **Edge Runtime**: For globally distributed low-latency API endpoints
   - **Streaming with Suspense**: For progressively loading complex agent reports
   - **View Transitions API**: For smooth navigation between related views

