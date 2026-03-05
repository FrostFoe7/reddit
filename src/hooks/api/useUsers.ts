import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/services/api/users';
import { queryKeys } from '@/services/query/keys';
import type { User } from '@/types';

/**
 * Fetch user by username
 */
export function useUser(username: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(username ?? ''),
    queryFn: () => usersApi.getUser(username!),
    enabled: !!username,
    staleTime: 60000, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

/**
 * Fetch all users (for search/autocomplete)
 */
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async (): Promise<User[]> => {
      // This would call an API endpoint to fetch users
      // For now, return empty array as fallback
      return [];
    },
    staleTime: 60000, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}
