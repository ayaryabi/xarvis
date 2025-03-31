# XARVIS Architecture Documentation 2.0

## Table of Contents
- [Overview](#overview)
- [Architecture Principles](#architecture-principles)
- [Folder Structure](#folder-structure)
  - [Root Structure](#root-structure)
  - [Source Code Structure](#source-code-structure)
- [State Management](#state-management)
- [Data Flow](#data-flow)
- [API Structure](#api-structure)
- [Implementation Phases](#implementation-phases)
- [Key Architecture Decisions](#key-architecture-decisions)
- [Development Guidelines](#development-guidelines)
- [Future Considerations](#future-considerations)

## Overview

XARVIS is a multi-tenant SaaS application for AI-powered ad campaign management with a modern Next.js architecture. This architecture uses a feature-based organization approach while maintaining shared component libraries. The application is designed to be scalable, maintainable, and performant, with clear separation of concerns and domain-driven design principles.

## Architecture Principles

1. **Feature-First Organization**
   - Each feature is self-contained with its own components, hooks, and API
   - Features can be developed and tested independently
   - Clear boundaries between features reduce coupling

2. **Shared Resources**
   - UI components are centralized for consistency
   - Common utilities and types are shared across features
   - Server-side code is isolated from client features

3. **Data Management**
   - Server state: React Query for data fetching and caching
   - Client state: Zustand for UI state management
   - Clear separation between server and client state

4. **Type Safety**
   - TypeScript throughout the application
   - Shared type definitions between client and server
   - Generated types for database and API responses

5. **Performance Optimization**
   - Code splitting by feature
   - Optimized data fetching with React Query
   - Server components where possible

## Important Notes

### Feature Organization
- Each feature (auth, marketing, channels, etc.) has its own directory with:
  - Components: Feature-specific UI components
  - Hooks: Feature-specific custom hooks
  - API: Feature-specific API functions
  - Types: Feature-specific type definitions
  - Stores: Feature-specific state management (when needed)
  - Layouts: Feature-specific layouts (when needed)
  - Pages: Feature-specific page components

### Key Guidelines
1. **Component Organization**
   - Shared UI components go in `components/`
   - Feature-specific components go in `features/[feature-name]/components/`
     Example: `features/auth/components/`, `features/channels/components/`
   - Keep components focused and reusable

2. **State Management**
   - Use React Query for server data
   - Use Zustand for global UI state
   - Use React state for component state
   - Avoid prop drilling

3. **API Structure**
   - Feature-specific API calls in `features/[feature]/api/`
   - Shared API utilities in `lib/api/`
   - Server-side API routes in `app/api/`

4. **Type Definitions**
   - Feature-specific types in `features/[feature]/types/`
   - Shared types in `types/`
   - Generated types (e.g., Supabase) in `types/`

5. **File Naming**
   - Use kebab-case for file names
   - Use PascalCase for component names
   - Use camelCase for hooks and utilities
   - Use index.ts for clean exports

6. **Code Organization**
   - Keep related code together
   - Use index.ts files for clean exports
   - Follow the established directory structure
   - Keep features self-contained

### Best Practices
1. **Feature Development**
   - Start with types and API
   - Build components from primitives
   - Add hooks for data management
   - Implement pages last

2. **Component Creation**
   - Start with primitive UI components
   - Build composite components from primitives
   - Keep components focused and reusable
   - Use TypeScript for all components

3. **State Management**
   - Use React Query for server data
   - Use Zustand for global UI state
   - Use React state for component state
   - Avoid prop drilling

4. **API Development**
   - Create feature-specific API modules
   - Use TypeScript for API types
   - Implement proper error handling
   - Follow REST/GraphQL conventions

5. **Testing**
   - Unit tests for utilities
   - Component tests for UI
   - Integration tests for features
   - E2E tests for critical flows

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
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   │
│   ├── (auth)/                 # Authentication routes
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx          # Auth-specific layout
│   │
│   ├── (dashboard)/            # Main application routes
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
│   ├── (marketing)/            # Marketing and legal pages
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
│   ├── api/                    # API routes
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
│   │   │   └── campaign-creator/ # Campaign creation endpoints
│   │   │
│   │   └── platforms/          # Platform integrations
│   │       ├── facebook/       # Facebook-specific endpoints
│   │       └── tiktok/         # TikTok endpoints
│   │
│   ├── error.tsx               # Global error page for app router
│   └── not-found.tsx           # 404 page
│
├── components/                 # Shared UI components only
│   ├── ui/                     # Primitive UI components (atomic)
│   │   ├── button/             # Button components
│   │   ├── input/              # Input components
│   │   ├── select/             # Select components
│   │   └── [other UI atoms]    # Other primitive components
│   │
│   ├── layout/                 # Layout components
│   │   ├── shells/             # App shells (dashboard, marketing)
│   │   └── header.tsx          # App header
│   │
│   └── common/                 # Shared composite components
│       ├── data-display/       # Tables, charts, etc.
│       ├── forms/              # Form components
│       └── feedback/           # Loading, errors, etc.
│
├── features/                   # Feature domains - NEW STRUCTURE
│   ├── auth/                   # Authentication feature
│   │   ├── components/         # Auth-specific components
│   │   ├── hooks/              # Auth-specific hooks (use-auth.ts)
│   │   ├── stores/             # Auth state management
│   │   ├── layouts/            # NEW: Auth layouts
│   │   │   └── auth-layout.tsx # Used by app/(auth)/layout.tsx
│   │   └── pages/              # NEW: Page components 
│   │       ├── login-page.tsx  # Used by app/(auth)/login/page.tsx
│   │       └── register-page.tsx # Used by app/(auth)/register/page.tsx
│   │
│   ├── channels/               # Channels feature
│   │   ├── components/         # Channel-specific components
│   │   ├── hooks/              # Channel-specific hooks
│   │   ├── api/                # Channel data fetching
│   │   └── types/              # Channel type definitions
│   │
│   ├── messages/               # Messages feature
│   │   ├── components/         # Message components
│   │   ├── hooks/              # Message hooks
│   │   ├── api/                # Message data fetching
│   │   └── types/              # Message types
│   │
│   ├── agents/                 # Agents feature
│   │   ├── components/         # Shared agent components
│   │   ├── hooks/              # Agent hooks
│   │   ├── api/                # Agent API
│   │   ├── types/              # Agent types
│   │   │
│   │   ├── orion/              # Orion agent
│   │   │   ├── components/     # Orion-specific components
│   │   │   └── hooks/          # Orion-specific hooks
│   │   │
│   │   └── campaign-creator/   # Campaign creation agent
│   │       ├── components/     # Campaign builder components
│   │       ├── hooks/          # Campaign hooks
│   │       └── stores/         # Campaign state
│   │
│   ├── connections/            # Ad account connections
│   │   ├── components/         # Connection components
│   │   └── hooks/              # Connection hooks
│   │
│   ├── subscription/           # Subscription management
│   │   ├── components/         # Subscription components
│   │   ├── hooks/              # Subscription hooks
│   │   └── stores/             # Subscription state
│   │
│   └── marketing/              # Marketing pages
│       ├── components/         # Marketing components
│       └── hooks/              # Marketing hooks
│
├── lib/                        # Shared libraries and utilities
│   ├── supabase/               # Supabase client & helpers
│   │   ├── client.ts           # Supabase client initialization
│   │   ├── auth.ts             # Authentication helpers
│   │   ├── db.ts               # Database helpers
│   │   └── types.ts            # Database types
│   │
│   ├── stripe/                 # Stripe integration
│   │   ├── client.ts
│   │   ├── subscriptions.ts
│   │   └── webhooks.ts
│   │
│   ├── react-query/            # React Query setup
│   │   └── client.ts           # Query client configuration
│   │
│   ├── contexts/               # React contexts
│   │   └── error-context.tsx   # Error handling context
│   │
│   ├── errors/                 # Error handling utilities
│   │   ├── api-error.ts        # API error handling
│   │   ├── error-logger.ts     # Error logging service
│   │   └── error-types.ts      # Error type definitions
│   │
│   └── utils/                  # Shared utilities
│       ├── format.ts           # Formatting helpers
│       ├── date.ts             # Date manipulation
│       ├── validation.ts       # Input validation
│       └── metrics.ts          # Analytics helpers
│
├── server/                     # Dedicated server-side code
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
├── hooks/                      # Only shared utility hooks
│   ├── use-media-query.ts      # Screen size detection
│   ├── use-intersection.ts     # Element visibility
│   └── use-error-handler.ts    # Error handling
│
└── types/                      # Shared TypeScript definitions
    ├── supabase.ts             # Generated Supabase types
    └── api.ts                  # API response/request types
```

## State Management

XARVIS uses a hybrid approach to state management:

1. **Server State (React Query)**
   ```typescript
   // Example of a feature-specific query
   const { data: channels } = useQuery({
     queryKey: ['channels'],
     queryFn: () => channelsApi.getChannels()
   });
   ```
   - Handles all server data fetching
   - Automatic caching and revalidation
   - Optimistic updates
   - Background data synchronization

2. **Client State (Zustand)**
   ```typescript
   // Example of a feature-specific store
   interface UIState {
     isSidebarOpen: boolean;
     selectedTab: string;
     setSidebarOpen: (open: boolean) => void;
   }
   
   export const useUIStore = create<UIState>((set) => ({
     isSidebarOpen: true,
     selectedTab: 'overview',
     setSidebarOpen: (open) => set({ isSidebarOpen: open })
   }));
   ```
   - UI-only state (modals, forms, etc.)
   - No server synchronization needed
   - Simple and lightweight

3. **Component State (React Hooks)**
   ```typescript
   // Example of component-specific state
   function FormComponent() {
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [formData, setFormData] = useState({});
   }
   ```
   - Temporary UI state
   - Form inputs
   - Component-specific toggles

## Data Flow

1. **Data Fetching**
   ```typescript
   // Feature-specific API module
   export const channelsApi = {
     getChannels: async () => {
       const response = await fetch('/api/channels');
       return response.json();
     }
   };
   
   // Feature-specific hook
   export function useChannels() {
     return useQuery({
       queryKey: ['channels'],
       queryFn: channelsApi.getChannels
     });
   }
   ```

2. **Data Mutations**
   ```typescript
   // Example of a mutation
   const mutation = useMutation({
     mutationFn: (newChannel) => channelsApi.createChannel(newChannel),
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['channels'] });
     }
   });
   ```

3. **Real-time Updates**
   - Supabase subscriptions for real-time data
   - WebSocket connections for live features
   - Background polling where appropriate

## Development Guidelines

1. **Feature Development**
   - Create new features in the `features/` directory
   - Follow the established directory structure
   - Keep feature-specific code isolated
   - Use shared components when possible

2. **Component Creation**
   - Start with primitive UI components
   - Build composite components from primitives
   - Keep components focused and reusable
   - Use TypeScript for all components

3. **State Management**
   - Use React Query for server data
   - Use Zustand for global UI state
   - Use React state for component state
   - Avoid prop drilling

4. **API Development**
   - Create feature-specific API modules
   - Use TypeScript for API types
   - Implement proper error handling
   - Follow REST/GraphQL conventions

5. **Testing**
   - Unit tests for utilities
   - Component tests for UI
   - Integration tests for features
   - E2E tests for critical flows

## API Structure

The API follows a domain-driven design:

1. **Resource-Based Organization**
   - Each domain has its own directory in `/api/`
   - API routes are organized by resource (channels, messages, agents)

2. **Client-Side API Modules**
   - Each feature has its own API module in `features/[feature]/api/`
   - These modules use React Query for data fetching

3. **Server-Side Implementation**
   - Server-side logic is kept in the `/server` directory
   - Clean separation between client API and server implementation

## Implementation Phases

This structure can be implemented in phases:

1. **Phase 1 (Base Structure & Authentication)**
   - Set up the new feature-based folder structure
   - Create shared UI components
   - Implement authentication feature

2. **Phase 2 (Core Features)**
   - Implement channels feature
   - Implement messages feature
   - Implement user settings

3. **Phase 3 (Agents Foundation)**
   - Create base agent structure
   - Implement first agent (Orion)

4. **Phase 4 (Platform Connections)**
   - Implement ad platform connections
   - Add analytics features

5. **Phase 5 (Advanced Features)**
   - Add campaign creator agent
   - Implement subscription management

## Key Architecture Decisions

1. **Feature-Based Organization**
   - Code is organized by domain/feature
   - Each feature contains its components, hooks, API, and types

2. **Shared UI Component Library**
   - UI primitives are maintained separately from features
   - Ensures consistent design across the application

3. **Server-Side Isolation**
   - Server-side code is separate from client features
   - Core business logic stays in the server directory

4. **Clean API Boundaries**
   - Features communicate through well-defined APIs
   - Reduces coupling between features

5. **Scalable Agent Architecture**
   - Each new agent gets its own directory
   - Agents share common capabilities through base classes

6. **Thin App Router Pages**
   - App Router pages simply import from feature-specific page components
   - Keeps routing logic separate from page component implementation
   - Example: `export { default } from "@/features/auth/pages/login-page";`

## Future Considerations

As the application grows, consider these enhancements:

1. **Micro-Frontends**
   - Features could evolve into separate deployable packages
   - Agent-specific code could be dynamically loaded

2. **Feature Flags**
   - Add feature flag system for gradual rollouts
   - Control feature access based on subscription tier

3. **Performance Optimizations**
   - Code splitting based on feature boundaries
   - Lazy loading for rarely used features

4. **Team Organization**
   - Teams can own specific features
   - Clear boundaries for code ownership

This architecture provides a scalable foundation for XARVIS as it grows to support multiple agents and a large user base.

## Data Fetching

XARVIS uses React Query for all server data:

1. **Central Configuration**
   - Query client setup in `src/lib/react-query/client.ts`
   - Global defaults and configuration

2. **Feature-Specific Queries**
   - Each feature defines its query configurations
   - Located in `features/[feature]/api/queries.ts`
   - Defines query keys, prefetching, and invalidation
