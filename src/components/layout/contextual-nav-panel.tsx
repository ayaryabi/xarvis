import React from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
// Ensure correct casing in import
import { ChannelList } from '@/features/channels/components/channelList';
// TODO: Import other components like SettingsSubNav, AgentFilterNav later

// Remove activeSection from props
interface ContextualNavPanelProps {
  // Prop to receive active section from layout (via Zustand)
  // activeSection: string; // Removed
}

export function ContextualNavPanel(/* { activeSection } */) { // Remove prop usage
  const pathname = usePathname(); // Get current pathname

  // --- Conditional Rendering based on pathname ---
  // Show ChannelList if path starts with /dashboard/channels
  if (pathname.startsWith('/dashboard/channels')) {
    return <ChannelList />;
  }

  // Show SettingsNav if path starts with /dashboard/settings (placeholder)
  if (pathname.startsWith('/dashboard/settings')) {
    return (
      <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
        Contextual Nav for: Settings
        <br/>(Settings SubNav TBD)
      </div>
    );
  }

  // Show AgentsNav if path starts with /dashboard/agents (placeholder)
  if (pathname.startsWith('/dashboard/agents')) {
    return (
      <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
        Contextual Nav for: Agents
        <br/>(Agent Filters/Nav TBD)
      </div>
    );
  }

  // Show ConnectionsNav if path starts with /dashboard/connections (placeholder)
  if (pathname.startsWith('/dashboard/connections')) {
    return (
      <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
        Contextual Nav for: Connections
        <br/>(Connection List/Status TBD)
      </div>
    );
  }

  // For other paths (like /dashboard root), render nothing or a default
  // Or handle specific cases like /dashboard (Home) explicitly if needed
  // if (pathname === '/dashboard') return null; // Example for home

  // Default: Render nothing if no specific content is defined for the path
  return null;
} 