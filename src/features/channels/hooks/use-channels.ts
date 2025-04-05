import { useQuery } from '@tanstack/react-query';

// Define the expected shape of a channel object from the API
// (Can be moved to a types/ file later if shared)
interface Channel {
  id: string;
  name: string;
  // Add other fields if needed, e.g., topic, space_id
}

// Async function to fetch channels from our API endpoint
const fetchChannels = async (): Promise<Channel[]> => {
  console.log('[API Call] Fetching /api/channels'); // Add log for debugging
  const response = await fetch('/api/channels');
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[API Error] Failed to fetch channels:', response.status, errorData);
    throw new Error(errorData?.error || `Network response was not ok: ${response.statusText}`);
  }
  const data = await response.json();
  console.log('[API Success] Fetched channels:', data);
  return data;
};

// Custom hook to encapsulate the channel fetching logic
export function useChannels() {
  return useQuery<Channel[], Error>({ 
    queryKey: ['channels'], // Unique key for this query
    queryFn: fetchChannels,  // The function that fetches the data
    // Add any specific React Query options here if needed
    // e.g., staleTime, refetchInterval
  });
} 