import React from 'react';
// Ensure correct casing in import
import { ChannelList } from '@/features/channels/components/channelList';

// Placeholder component - conditional logic will be added later

interface ContextualNavPanelProps {
  // Prop to receive active section from layout (via Zustand)
  activeSection?: string; // Make optional for initial placeholder
}

export function ContextualNavPanel({ activeSection }: ContextualNavPanelProps) {

  // TODO: Add conditional rendering based on activeSection later
  // e.g., if (activeSection === 'channels') return <ChannelList />;
  //       else if (activeSection === 'settings') return <SettingsSubNav />;
  //       else return null;

  // --- TEMPORARY: Always render ChannelList for visualization --- 
  console.log(`ContextualNavPanel rendering (Temp: Forcing ChannelList). Active section prop is: ${activeSection}`);
  return <ChannelList />;
  // --- END TEMPORARY --- 

  // Original placeholder code:
  /*
  return (
    <div className="p-4 text-sm text-gray-700 dark:text-gray-300">
      <h3 className="font-semibold mb-2">Contextual Panel</h3>
      <p>Content for section: <span className="font-medium text-indigo-600 dark:text-indigo-400">{activeSection || 'none'}</span></p>
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">(Placeholder - will show relevant lists/nav later)</p>
    </div>
  );
  */
} 