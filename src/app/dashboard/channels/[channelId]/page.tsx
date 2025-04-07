import React from 'react';

// This page component receives route parameters via the 'params' prop
interface ChannelPageProps {
  params: {
    channelId: string; // The dynamic segment name from the folder structure
  };
}

// This is a Server Component by default in the App Router
export default function ChannelPage({ params }: ChannelPageProps) {
  const { channelId } = params;

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