import React from 'react';

// Placeholder component - will connect to Zustand action later

interface PrimarySidebarProps {
  // TODO: Add prop for onSectionSelect callback OR remove if using Zustand directly
  // onSectionSelect?: (sectionName: string) => void;
}

export function PrimarySidebar({ /* props */ }: PrimarySidebarProps) {

  // TODO: Import and use setActiveSection from Zustand store

  const handleSelect = (sectionName: string) => {
    console.log('Selected section:', sectionName);
    // props.onSectionSelect?.(sectionName); // Use if using callback prop
    // setActiveSection(sectionName); // Use if using Zustand
  };

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
          onClick={() => handleSelect(section.id)}
          title={section.name}
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700 text-xl text-gray-300 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <span role="img" aria-label={section.name}>{section.icon}</span>
        </button>
      ))}
    </nav>
  );
} 