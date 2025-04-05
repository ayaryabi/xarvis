'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react'; // Using lucide for icons
import { useChannels } from '../hooks/use-channels'; 

// Define the expected shape of a channel object from the API
interface Channel {
  id: string;
  name: string;
  // Add other fields if needed, e.g., topic, space_id
}

export function ChannelList() {
  const { data: channels, isLoading, isError, error } = useChannels();

  const handleAddChannelClick = () => {
    // TODO: Implement logic to open CreateChannelModal
    console.log('TODO: Open Create Channel Modal');
    alert('Add channel functionality not implemented yet.');
  };

  return (
    <div className="flex flex-col h-full p-3">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wide">
          Channels
        </h3>
        <button
          onClick={handleAddChannelClick}
          title="Add Channel"
          className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Channel List or Status */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {isLoading && (
          <div className="text-sm text-gray-400">Loading channels...</div>
        )}
        {isError && (
          <div className="text-sm text-red-500 dark:text-red-400">
            Error: {error?.message || 'Failed to load channels'}
          </div>
        )}
        {!isLoading && !isError && channels && channels.length > 0 && (
          channels.map((channel) => (
            <Link
              key={channel.id}
              href={`/dashboard/${channel.id}`}
              className="block px-2 py-1.5 text-sm rounded-md text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-white dark:hover:text-gray-100"
            >
              # {channel.name}
            </Link>
          ))
        )}
        {!isLoading && !isError && (!channels || channels.length === 0) && (
           <div className="text-sm text-gray-400 px-2 py-1.5">No channels found.</div>
        )}
      </div>
    </div>
  );
}
