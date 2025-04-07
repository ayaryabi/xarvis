import React from 'react';
// Ensure correct casing in import
import { ChannelList } from '@/features/channels/components/channelList';
// TODO: Import other components like SettingsSubNav, AgentFilterNav later

// Placeholder component - conditional logic will be added later

interface ContextualNavPanelProps {
  // Prop to receive active section from layout (via Zustand)
  activeSection: string; // Now required, passed down from layout
}

export function ContextualNavPanel({ activeSection }: ContextualNavPanelProps) {

  // --- Conditional Rendering based on activeSection --- 
  if (activeSection === 'channels') {
    return <ChannelList />;
  }
  
  // TODO: Add other conditions later
  // else if (activeSection === 'settings') {
  //   return <SettingsSubNav />;
  // }

  // For sections that don't use this panel (like 'home') or are unknown,
  // render nothing.
  if (activeSection === 'home' || activeSection === 'agents' || activeSection === 'connections' || activeSection === 'settings') {
     // Placeholder for sections that WILL have content here later
     // In a real implementation, you might return specific nav/filter components
     return (
       <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
         Contextual Nav for: {activeSection}
         <br/>(Content TBD)
       </div>
     );
  }

  // Default: Render nothing if the section doesn't need this panel
  return null; 
} 