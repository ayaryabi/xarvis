'use client' // Provider components often need client-side hooks like useState

import React from 'react'
import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
  // Use React.useState to ensure the client is only created once per component instance
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Default options for all queries
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false, // Optional: disable refetch on focus
          },
        },
      })
  )

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
      {/* Optional: Add React Query DevTools for development environment */} 
      <ReactQueryDevtools initialIsOpen={false} />
    </TanstackQueryClientProvider>
  )
} 