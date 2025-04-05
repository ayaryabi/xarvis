# Dashboard Layout Implementation Plan Summary

This document outlines the high-level plan for implementing the main dashboard layout, based on a 4-area structure inspired by interfaces like Supabase or Slack.

## Core Structure (4 Areas)

The dashboard will consist of four main visual areas:

1.  **Fixed Header:** A horizontal bar at the top for branding, global actions (Feedback), user/org context.
2.  **Primary Sidebar:** A fixed-width vertical bar on the far left for top-level application section navigation (Home, Channels, Agents, Settings).
3.  **Contextual Navigation Panel:** A fixed-width vertical bar adjacent to the Primary Sidebar. Its content dynamically changes based on the section selected in the Primary Sidebar (e.g., showing Channel List, Settings Sub-Nav, Agent Filters).
4.  **Main Content Area:** The largest area, filling the remaining space. Its content is determined by the specific route/page the user is on (e.g., displaying channel messages, settings forms, agent marketplace).

## Component Breakdown & Responsibilities

1.  **`DashboardShell.tsx` (`src/components/layout/shells/`)**
    *   **Role:** The main structural skeleton/frame.
    *   **Implementation:** Defines the 4 areas using CSS (Tailwind) for positioning and sizing. Accepts the other layout components via props (slots: `header`, `primaryNav`, `contextualNav`, `children`). Contains no specific content or application logic itself.

2.  **`DashboardHeader.tsx` (`src/components/layout/`)**
    *   **Role:** Implements Area 1 (Header).
    *   **Implementation:** Contains header UI elements, fetches/displays necessary global data (user/org info).

3.  **`PrimarySidebar.tsx` (`src/components/layout/`)**
    *   **Role:** Implements Area 2 (Primary Navigation).
    *   **Implementation:** Contains links/buttons for top-level sections. On click, it updates the shared application state (via Zustand) to indicate the newly active high-level section. May also trigger navigation to a default route for that section.

4.  **`ContextualNavPanel.tsx` (`src/components/layout/`)**
    *   **Role:** Implements Area 3 (Contextual Navigation).
    *   **Implementation:** Reads the active high-level section state from Zustand. Conditionally renders the appropriate sub-navigation or list component (e.g., `<ChannelList/>`, `<SettingsSubNav/>`) by importing them from relevant `features/*` directories. Renders `null` for sections that don't require this panel (e.g., "Home").

5.  **Feature Components** (`src/features/*/components/`)
    *   **Role:** Encapsulate domain-specific UI and logic (e.g., `ChannelList`, `MessageView`, `BillingForm`).
    *   **Implementation:** Focus on their specific task, independent of the overall layout. Imported by `ContextualNavPanel` or `page.tsx` files.

## State Management

*   **Zustand Store (`src/stores/dashboard-layout-store.ts`)**:
    *   Holds the `activeHighLevelSection` state (e.g., 'channels', 'settings').
    *   Provides an action (`setActiveSection`) used by `PrimarySidebar` to update the state.

## Assembly & Routing

1.  **`(dashboard)/layout.tsx` (`src/app/(dashboard)/layout.tsx`)**:
    *   **Role:** The main orchestrator for the dashboard section. Applies the consistent layout frame to all nested routes.
    *   **Implementation:** Reads `activeSection` from the Zustand store. Renders `<DashboardShell>`, passing in `<DashboardHeader/>`, `<PrimarySidebar/>`, and `<ContextualNavPanel activeSection={activeSection} />` to the appropriate props/slots. Renders `{children}` in the main content slot.

2.  **Page Components (`page.tsx`)** (`src/app/(dashboard)/**/*.page.tsx`):
    *   **Role:** Defines the unique content for Area 4 (Main Content Area) for a specific route.
    *   **Implementation:** Imports and arranges components from `src/features/*` needed for that specific view (e.g., `<MessageView/>` for a channel page, `<BillingForm/>` for the billing page). This assembled content becomes the `{children}` rendered by the layout.

3.  **Channel Tabs / Nested Layouts:**
    *   For sections requiring internal tabs (like within a channel view), a nested layout (e.g., `src/app/(dashboard)/[channelId]/layout.tsx`) can be used.
    *   This nested layout renders the tab bar component and its own `{children}` (the content of the selected tab's `page.tsx`). It still inherits the main 4-area frame from `(dashboard)/layout.tsx`.

This approach provides a scalable structure by separating layout concerns from feature logic, using a central store for coordination, and leveraging the Next.js App Router for routing and layout composition.

## MVP UI Feature Summary & Implementation

This section maps the core MVP features to the planned architecture.

**1. Core Dashboard Structure (Already covered above)**
    *   Build `DashboardShell`, `DashboardHeader`, `PrimarySidebar`, `ContextualNavPanel`.
    *   Set up Zustand store `useDashboardLayoutStore` for `activeHighLevelSection`.
    *   Assemble in `(dashboard)/layout.tsx`.

**2. Channel & Messaging Feature:**
    *   **`features/channels`:**
        *   `components/ChannelList.tsx`: Fetches/displays channels. Used in `ContextualNavPanel`.
        *   `components/CreateChannelModal.tsx`: UI for creating new channels.
        *   API/Hooks for channel management.
    *   **`features/messages`:**
        *   `components/MessageView.tsx`: Displays message stream.
        *   `components/SendMessageInput.tsx`: Input box for sending messages.
        *   API/Hooks for fetching/sending messages.
    *   **Channel View Routing/Layout:**
        *   `app/(dashboard)/[channelId]/layout.tsx`: Renders `<ChannelTabBar />` and `{children}`.
        *   `components/layout/ChannelTabBar.tsx` (or `features/channels/components`): Contains `<Link>`s for tabs (Messages, Agents, Source).
    *   **Tab Pages:**
        *   `app/(dashboard)/[channelId]/page.tsx` (Messages): Uses `<MessageView />`, `<SendMessageInput />`.
        *   `app/(dashboard)/[channelId]/agents/page.tsx` (Agents): Uses components from `features/agents` to manage agents for this channel.
        *   `app/(dashboard)/[channelId]/connections/page.tsx` (Source): Uses components from `features/connections` to link globally connected accounts to this channel.

**3. Datasource (Connections) Feature:**
    *   **`features/connections`:**
        *   Components for connecting accounts (initially FB Ads), displaying connected accounts.
        *   Components for linking/unlinking accounts *within the channel context* (used in the Source tab page).
        *   API/Hooks for connection management and channel linking.
    *   **Routing:**
        *   `app/(dashboard)/connections/page.tsx`: Main page to initiate connections and view globally connected accounts. Rendered in Main Content Area when 'datasources' section is active.
        *   Relies on `ContextualNavPanel` showing relevant connection info/actions when 'datasources' is active.

## Implementation Steps (Post-Layout Skeleton)

Following the initial setup of the layout skeleton and basic state connection:

**Phase 1: Core Channel Management & Listing**

1.  **Backend - Channels API/Actions:**
    *   Define `channels` table schema in Supabase.
    *   Implement `GET /api/channels/route.ts` to fetch user's channels.
    *   Implement Server Action `createChannel` (e.g., in `src/features/channels/actions.ts`) to handle channel creation.

2.  **Frontend - Feature Components (`features/channels`):**
    *   Build `ChannelList.tsx`:
        *   Use `useQuery` (React Query) to call `GET /api/channels`.
        *   Render fetched channels as Next.js `<Link>` components (`/dashboard/[channelId]`).
        *   Include an "Add Channel" button.

3.  **Frontend - Layout Integration & State:**
    *   Implement Zustand store (`src/stores/dashboard-layout-store.ts`) with `activeSection` state and `setActiveSection` action.
    *   Connect `PrimarySidebar.tsx` to call `setActiveSection` on button clicks.
    *   Connect `(dashboard)/layout.tsx` to read `activeSection` from the store and pass it to `ContextualNavPanel`.
    *   Update `ContextualNavPanel.tsx`: Import and render `<ChannelList />` when `activeSection` is `'channels'`. Add logic to return `null` for other sections for now.
    *   Connect the "Add Channel" button in `<ChannelList />` to open the `<CreateChannelModal />`.

4.  **Frontend - Basic Channel Page:**
    *   Create dynamic route folder `src/app/dashboard/[channelId]/`.
    *   Create `src/app/dashboard/[channelId]/page.tsx`:
        *   Get `channelId` from `params`.
        *   Display basic placeholder content like "Content for Channel: {channelId}".

**Subsequent Phases (To be detailed later):**

*   Implement Message Viewing & Sending.
*   Implement Channel Tabs.
*   Implement Datasource Connection.
*   Implement Agent/Source Linking within Channel Tabs.
*   Integrate Realtime functionality.
*   UI Refinement and Error Handling.
