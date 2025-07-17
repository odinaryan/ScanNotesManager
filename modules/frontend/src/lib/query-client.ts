import { QueryClient } from '@tanstack/react-query';

// Create and configure the QueryClient with optimal defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Retry delay increases with each attempt
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect by default (can be overridden per query)
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

// Query keys factory for consistent query key management
export const queryKeys = {
  // Scans-related queries
  scans: ['scans'] as const,
  
  // Notes-related queries  
  notes: ['notes'] as const,
  notesByScan: (scanId: number) => ['notes', 'scan', scanId] as const,
} as const; 