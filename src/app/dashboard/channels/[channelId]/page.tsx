'use client'; // Make this a Client Component

import React, { useEffect } from 'react'; // Import useEffect
import { usePathname } from 'next/navigation'; // Import usePathname

// Define a key for localStorage
const LOCALSTORAGE_KEY_CHANNELS = 'lastVisitedUrl_channels';

// This page component receives route parameters via the 'params' prop
interface ChannelPageProps {
  params: {
    channelId: string; // The dynamic segment name from the folder structure
  };
}

// This is now a Client Component
export default function ChannelPage({ params }: ChannelPageProps) {
  const { channelId } = params;
  const pathname = usePathname(); // Get the current full path

  // Save the current path to localStorage whenever it changes (or component mounts)
  useEffect(() => {
    if (pathname) {
      localStorage.setItem(LOCALSTORAGE_KEY_CHANNELS, pathname);
    }
  }, [pathname]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Channel Content Area
      </h1>
      <p>Displaying content for Channel ID:</p>
      <p className="font-mono text-lg mt-2 bg-gray-200 dark:bg-gray-700 p-2 rounded inline-block">
        {channelId}
      </p>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        (TODO: Replace this with actual MessageView and SendMessageInput components later)
      </p>
    </div>
  );
} 