import React from 'react';
// Import the Zustand store hook and action
import { useDashboardLayoutStore } from '@/stores/dashboard-layout-store';

// Placeholder component - will connect to Zustand action later

// Remove prop interface if not needed
// interface PrimarySidebarProps {
//   onSectionSelect?: (sectionName: string) => void;
// }

export function PrimarySidebar(/* { props } */) {

  // Get the action function from the Zustand store
  const setActiveSection = useDashboardLayoutStore((state) => state.setActiveSection);

  // No need for local handleSelect anymore if just calling the store action
  /*
  const handleSelect = (sectionName: string) => {
    console.log('Selected section:', sectionName);
    // setActiveSection(sectionName); // Call the store action here
  };
  */

  // Example sections
  const sections = [
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'channels', name: 'Channels', icon: '#' },
    { id: 'agents', name: 'Agents', icon: '🤖' },
    { id: 'connections', name: 'Datasources', icon: '🔗' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="flex flex-col items-center space-y-4 py-4">
      {sections.map((section) => (
        <button
          key={section.id}
          // Call the store action directly onClick
          onClick={() => setActiveSection(section.id)}
          title={section.name}
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700 text-xl text-gray-300 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <span role="img" aria-label={section.name}>{section.icon}</span>
        </button>
      ))}
    </nav>
  );
} 