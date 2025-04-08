'use client'; // Needed for useState, useEffect, or client-side interactions if added later

import React from 'react'; // useState might be needed later for callback method
import { DashboardShell } from '@/components/layout/shells/dashboard-shell';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { PrimarySidebar } from '@/components/layout/primary-sidebar';
import { ContextualNavPanel } from '@/components/layout/contextual-nav-panel';

// TODO: Import Zustand store and state if using Zustand
// import { useDashboardLayoutStore } from '@/stores/dashboard-layout-store';

export default function DashboardAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- State Management (Choose ONE method) ---

  // Option 2: Zustand State (Recommended, more scalable)
  // TODO: Get state and actions from Zustand store
  // const activeSection = useDashboardLayoutStore((state) => state.activeSection);
  // const setActiveSectionAction = useDashboardLayoutStore((state) => state.setActiveSection);

  // Get the activeSection state from the Zustand store
  // const activeSection = useDashboardLayoutStore((state) => state.activeSection);
  // No need to get the action here unless the layout itself needs to change the section

  return (
    <DashboardShell
      header={<DashboardHeader />}
      // PrimarySidebar now calls store directly, no props needed here
      primaryNav={<PrimarySidebar />}
      contextualNav={<ContextualNavPanel />}
    >
      {children} {/* The content from page.tsx goes here */}
    </DashboardShell>
  );
} 