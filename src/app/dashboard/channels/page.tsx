'use client'; // Make this a Client Component

import React, { useEffect, useState } from 'react'; // Import useEffect, useState
import { useRouter } from 'next/navigation'; // Import useRouter

// Define the same key used for saving
const LOCALSTORAGE_KEY_CHANNELS = 'lastVisitedUrl_channels';

// This page component renders when the path is exactly /dashboard/channels
export default function ChannelsRootPage() {
  const router = useRouter();
  // Add state to prevent rendering placeholder during redirect check
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);

  useEffect(() => {
    const lastVisitedUrl = localStorage.getItem(LOCALSTORAGE_KEY_CHANNELS);
    
    if (lastVisitedUrl) {
      // Redirect to the last visited channel URL if it exists
      // Use replace to avoid adding /dashboard/channels to history
      router.replace(lastVisitedUrl);
      // No need to setIsCheckingStorage(false) here as we are navigating away
    } else {
      // No stored URL found, okay to show the placeholder content
      setIsCheckingStorage(false);
    }
    // Run only once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means run once

  // Optionally, show nothing or a loader while checking storage
  if (isCheckingStorage) {
    return null; // Or return a loading spinner
  }

  // If no redirect happened, show the placeholder
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Channels
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Please select a channel from the list on the left to view its messages.
      </p>
      {/* You could potentially add an overview or "Create Channel" button here later */}
    </div>
  );
} 