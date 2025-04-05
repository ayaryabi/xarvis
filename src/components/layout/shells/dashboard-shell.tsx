import React from 'react';

// Define the slots via props
interface DashboardShellProps {
  header: React.ReactNode;
  primaryNav: React.ReactNode;
  contextualNav: React.ReactNode;
  children: React.ReactNode; // Main page content
}

export function DashboardShell({
  header,
  primaryNav,
  contextualNav,
  children,
}: DashboardShellProps) {

  return (
    // Overall container: Full height, flexbox layout
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">

      {/* Slot 1: Header (Fixed Height) */}
      <header className="h-16 flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {header} {/* Render the component passed to the 'header' prop */}
      </header>

      {/* Container for the rest (sidebars + main content) */}
      {/* Takes remaining height, uses horizontal flex, prevents inner content overflow */}
      <div className="flex flex-1 overflow-hidden">

        {/* Slot 2: Primary Navigation Sidebar (Fixed Width) */}
        <aside className="w-20 flex-shrink-0 overflow-y-auto bg-gray-900 dark:bg-black text-gray-300">
           {primaryNav} {/* Render the component passed to the 'primaryNav' prop */}
        </aside>

        {/* Slot 3: Contextual Navigation Panel (Fixed Width) */}
        {/* Note: We always render the slot. The component passed in decides if it shows anything */}
        <aside className="w-64 flex-shrink-0 overflow-y-auto border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
           {contextualNav} {/* Render the component passed to the 'contextualNav' prop */}
        </aside>

        {/* Slot 4: Main Content Area (Takes Remaining Width) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
           {children} {/* Render the component passed to the 'children' prop (page content) */}
        </main>

      </div>
    </div>
  );
} 