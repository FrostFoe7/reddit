/**
 * React Query Configuration
 * Global settings for TanStack Query
 */

import { QueryClient, type DefaultError } from '@tanstack/react-query';

export const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Refetch strategy
        staleTime: 30 * 1000, // 30 seconds - data is fresh for 30s
        gcTime: 5 * 60 * 1000, // 5 minutes - memory cache time
        retry: 1, // Retry once on failure
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
      mutations: {
        retry: 1,
      },
    },
  });
};

/**
 * Global error handler for queries and mutations
 * This can be used to show error toasts without repeating in every hook
 */
export const handleQueryError = (error: DefaultError | null): void => {
  if (!error) return;
  const message = error instanceof Error ? error.message : 'An error occurred';
  // Only show toast for user-friendly errors
  if (message && !message.includes('401')) {
    // Don't toast auth errors, they'll be handled elsewhere
    console.error('Query error:', error);
  }
};
