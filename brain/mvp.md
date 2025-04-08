# XARVIS MVP Plan: UI-First for Agent Recommendations

**Goal:** Implement the user interface for displaying agent summary messages in channels and viewing detailed recommendations in an intercepting route panel, using mock data. Establish the necessary frontend components and basic backend infrastructure (DB tables, mock APIs).

**Starting Point:** Basic dashboard layout, primary navigation, channel list, and channel navigation structure are in place.

---

## Phase 1: Foundational Setup (DB Structure & Common Panel)

**Goal:** Create the **core** database tables needed to represent the full MVP data structure and build the reusable UI component for the intercepting panel.

**Tasks:**

1.  **Define & Create Core DB Tables:**
    *   Create/Modify the 7 core relational tables: `messages`, `agents`, `agent_instances`, `platform_connections`, `channel_platform_connections`, `channel_agent_assignments`, `agent_recommendations` (details below).
    *   *(Defer specific FB data tables like `fb_campaigns`, etc., until Phase 4/5)*.
2.  **Implement Schemas:** Create these tables and relationships in Supabase.
3.  **Create Common Intercepting Panel Component:**
    *   Build `src/components/common/panels/InterceptingDetailsPanel.tsx`.
    *   This component provides the visual shell, accepts `title` and `children` props, and includes a close ('X') button triggering `router.back()`.

---

## Phase 1 Database Schema: Tables & Fields to Create/Modify

**Objective:** Establish the core database structure required to support the full Agent Messaging MVP.

**1. `messages` Table (Create or Modify)**
*Purpose: Store all messages (user, agent, system).*
*   `id` (UUID, Primary Key)
*   `channel_id` (UUID, Foreign Key -> `channels.id`, Not Null)
*   `created_at` (TIMESTAMPTZ, Default: `now()`)
*   `sender_type` (TEXT, Not Null, Check constraint: `sender_type IN ('user', 'agent', 'system')`)
*   `sender_user_id` (UUID, Nullable, Foreign Key -> `users.id`) - *Link to user if sender_type='user'*
*   `agent_instance_id` (UUID, Nullable, Foreign Key -> `agent_instances.id`) - *Link to agent instance if sender_type='agent'*
*   `agent_recommendation_id` (UUID, Nullable, Foreign Key -> `agent_recommendations.id`) - *Link to raw recommendation data if applicable*
*   `content_type` (TEXT, Not Null) - *e.g., 'text', 'orion_summary'*
*   `content` (JSONB, Not Null) - *Structured data for rendering*

**2. `agents` Table (Create New)**
*Purpose: Define the types of agents available.*
*   `id` (UUID, Primary Key)
*   `type` (TEXT, Unique, Not Null) - *e.g., 'orion'*
*   `name` (TEXT, Not Null)
*   `description` (TEXT)

**3. `agent_instances` Table (Create New)**
*Purpose: Represent agents available/"installed" for an organization.*
*   `id` (UUID, Primary Key)
*   `org_id` (UUID, Foreign Key -> `organizations.id`, Not Null)
*   `agent_id` (UUID, Foreign Key -> `agents.id`, Not Null)
*   `status` (TEXT, Not Null, Default: 'active')
*   `global_config` (JSONB)

**4. `platform_connections` Table (Create New)**
*Purpose: Store globally connected external platform accounts.*
*   `id` (UUID, Primary Key)
*   `org_id` (UUID, Foreign Key -> `organizations.id`, Not Null)
*   `platform_type` (TEXT, Not Null, e.g., 'facebook')
*   `platform_account_id` (TEXT, Not Null) - *e.g., Facebook Ad Account ID*
*   `account_name` (TEXT)
*   `encrypted_access_token` (TEXT or BYTEA, Not Null)
*   `token_expires_at` (TIMESTAMPTZ, Nullable)
*   `encrypted_refresh_token` (TEXT or BYTEA, Nullable)
*   `scopes` (TEXT[], Nullable) - *Permissions granted*
*   `status` (TEXT, Not Null, Default: 'active')
*   `created_at` (TIMESTAMPTZ, Default: `now()`)
*   `updated_at` (TIMESTAMPTZ, Default: `now()`)

**5. `channel_platform_connections` Table (Create New)**
*Purpose: Link a channel to a specific global platform connection (Many-to-Many).*
*   `id` (UUID, Primary Key)
*   `channel_id` (UUID, Foreign Key -> `channels.id`, Not Null)
*   `platform_connection_id` (UUID, Foreign Key -> `platform_connections.id`, Not Null)
*   *(Add Unique constraint on (channel_id, platform_connection_id))* 

**6. `channel_agent_assignments` Table (Create New)**
*Purpose: Activate an agent instance for a channel and store channel-specific config.*
*   `id` (UUID, Primary Key)
*   `channel_id` (UUID, Foreign Key -> `channels.id`, Not Null)
*   `agent_instance_id` (UUID, Foreign Key -> `agent_instances.id`, Not Null)
*   `status` (TEXT, Not Null, Default: 'inactive') - *Agent runs for channel only if 'active'*
*   `channel_specific_config` (JSONB) - *e.g., { "notification_time": "09:00", "kpis_to_show": [...] }*
*   *(Add Unique constraint on (channel_id, agent_instance_id))*

**7. `agent_recommendations` Table (Create New)**
*Purpose: Store raw output/analysis from agent runs.*
*   `id` (UUID, Primary Key)
*   `agent_instance_id` (UUID, Foreign Key -> `agent_instances.id`, Not Null)
*   `channel_id` (UUID, Foreign Key -> `channels.id`, Not Null)
*   `created_at` (TIMESTAMPTZ, Default: `now()`)
*   `recommendation_type` (TEXT, Not Null) - *e.g., 'budget_opportunity'*
*   `context` (JSONB, Nullable) - *e.g., { "campaign_id": "..." }*
*   `data` (JSONB, Not Null) - *Raw analysis details*
*   `status` (TEXT, Not Null, Default: 'pending') - *e.g., 'pending', 'viewed', 'acted'*

**Notes:**

*   Implement Foreign Key constraints for all relationships.
*   Add appropriate Indexes (e.g., on FKs, `messages.channel_id`, `messages.created_at`).
*   Specific Facebook data tables (`fb_campaigns`, `fb_adsets`, `fb_ads`, `fb_insights`) are **deferred** until the data sync phase.

---

## Phase 2: Message List & Summary UI (Mock Data)

**Goal:** Display mock agent *summary* messages in the channel view.

**Tasks:**

1.  **Build Message List Container:**
    *   Create `src/features/messages/components/MessageList.tsx`. Basic scrollable container.
2.  **Build Agent Summary Component:**
    *   Create `src/features/agents/orion/components/OrionSummaryMessage.tsx`.
    *   Receives message `content` (e.g., `{ category: 'Opportunities', count: 5, detailsUrl: '/dashboard/channels/.../recommendations/...' }`) as props.
    *   Renders summary text and a `<Link>` styled as "[See More]" using `detailsUrl`.
3.  **Create Mock API (Summary Messages):**
    *   Implement `GET /api/channels/[channelId]/messages`.
    *   Return hardcoded array simulating agent summary messages with realistic fields (`agent_instance_id`, `content_type`='orion_summary', `content` JSONB with `category`, `count`, `detailsUrl`).
4.  **Implement Frontend Fetching (Summary):**
    *   Create `src/features/messages/hooks/useMessages.ts` (React Query) to fetch from the mock API (Task 2.3).
5.  **Integrate Message Display:**
    *   Update `src/app/dashboard/channels/[channelId]/page.tsx` to use `useMessages` and render `<MessageList messages={messages} />`.
    *   Update `MessageList.tsx` to conditionally render `<OrionSummaryMessage content={message.content} />` based on `content_type`.

---

## Phase 3: Intercepting Route & Detailed View UI (Mock Data)

**Goal:** Make the "[See More]" link open the intercepting panel, displaying mock detailed recommendation data.

**Tasks:**

1.  **Define Detailed View Route:** E.g., `/dashboard/channels/[channelId]/recommendations/[batchId]`.
2.  **Set up Intercepting Route Files:**
    *   Create folder structure: `src/app/dashboard/channels/[channelId]/(.)recommendations/[batchId]/`.
    *   Create `page.tsx` inside this folder.
3.  **Build Agent Details Component:**
    *   Create `src/features/agents/orion/components/OrionRecommendationDetails.tsx`.
    *   Receives an array of *mock* recommendation data as props.
    *   Renders the list of detailed campaign recommendations.
4.  **Create Mock API (Detailed Data):**
    *   Implement `GET /api/recommendations/[batchId]` (or similar).
    *   Return a hardcoded array of mock detailed campaign recommendation objects.
5.  **Implement Frontend Fetching (Details):**
    *   Create hook (e.g., `src/features/agents/orion/hooks/useRecommendationDetails.ts`) to fetch from the mock details API (Task 3.4).
6.  **Assemble Intercepting Route Page:**
    *   In the intercepting route's `page.tsx` (Task 3.2):
        *   Import common `InterceptingDetailsPanel` (Phase 1).
        *   Import specific `OrionRecommendationDetails` component (Task 3.3).
        *   Import and use details fetching hook (Task 3.5).
        *   Render: `<InterceptingDetailsPanel title="Orion Recommendations"><OrionRecommendationDetails data={fetchedDetails} /></InterceptingDetailsPanel>`.

---

**Outcome:** Clicking "[See More]" on a summary message opens the intercepting panel, displaying mock detailed recommendations. The core UI flow is testable.

**Next Steps (Post This Plan):** Implement Facebook connection, real background jobs, real agent logic, real message generation, replacing mock APIs/data with actual database queries.
