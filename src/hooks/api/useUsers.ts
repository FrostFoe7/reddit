import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/services/api/users';
import { queryKeys } from '@/services/query/keys';
import type { User } from '@/types';
import { useAuthStore } from '@/store/useStore';
import { toast } from 'sonner';

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
    queryFn: async (): Promise<User[]> => usersApi.getUsers(),
    staleTime: 60000, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

/**
 * Update current user settings/profile
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  const updateUserStore = useAuthStore(state => state.updateUser);

  return useMutation({
    mutationFn: async (updates: Partial<User>) => {
      if (!user) throw new Error('Must be logged in');
      return usersApi.updateUser(user.id, updates);
    },
    onSuccess: updated => {
      updateUserStore(updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(updated.username) });
      toast.success('Settings saved');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save settings');
    },
  });
}
