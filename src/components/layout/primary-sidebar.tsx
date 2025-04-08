import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import clsx from 'clsx'; // For conditional classes

// Remove Zustand import
// import { useDashboardLayoutStore } from '@/stores/dashboard-layout-store';

// Placeholder component - will connect to Zustand action later

// Remove prop interface if not needed
// interface PrimarySidebarProps {
//   onSectionSelect?: (sectionName: string) => void;
// }

export function PrimarySidebar() {
  // Remove Zustand hook call
  // const setActiveSection = useDashboardLayoutStore((state) => state.setActiveSection);

  const pathname = usePathname(); // Get current path

  // Example sections
  const sections = [
    { id: 'home', name: 'Home', icon: '🏠', href: '/dashboard' },
    // Link channels section directly to /dashboard/channels
    { id: 'channels', name: 'Channels', icon: '#', href: '/dashboard/channels' }, 
    { id: 'agents', name: 'Agents', icon: '🤖', href: '/dashboard/agents' },
    { id: 'connections', name: 'Datasources', icon: '🔗', href: '/dashboard/connections' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/dashboard/settings' },
  ];

  return (
    <nav className="flex flex-col items-center space-y-4 py-4">
      {sections.map((section) => {
        // Check if the current path starts with the link's href
        // Special case for home ('/dashboard') to avoid matching everything
        const isActive = 
          section.href === '/dashboard' 
            ? pathname === '/dashboard' 
            : pathname.startsWith(section.href);

        return (
          <Link
            key={section.id}
            href={section.href}
            title={section.name}
            // Apply conditional styling based on isActive
            className={clsx(
              'flex h-12 w-12 items-center justify-center rounded-lg text-xl text-gray-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900',
              {
                'bg-indigo-600 text-white': isActive,
                'bg-gray-700 hover:bg-gray-600': !isActive,
              }
            )}
          >
            <span role="img" aria-label={section.name}>{section.icon}</span>
          </Link>
        );
      })}
    </nav>
  );
} 