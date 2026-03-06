import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communitiesApi } from '@/services/api/communities';
import { queryKeys } from '@/services/query/keys';
import { useAuthStore } from '@/store/useStore';
import { toast } from 'sonner';

/**
 * Fetch all communities
 */
export function useCommunities() {
  return useQuery({
    queryKey: queryKeys.communities.all,
    queryFn: () => communitiesApi.getCommunities(),
    retry: 2,
    staleTime: 60000,
  });
}

/**
 * Fetch top communities
 */
export function useTopCommunities(limit: number = 5) {
  return useQuery({
    queryKey: queryKeys.communities.top(limit),
    queryFn: () => communitiesApi.getCommunities(),
    retry: 2,
    staleTime: 80000,
  });
}

/**
 * Fetch single community by ID or name
 */
export function useCommunity(idOrName: string | undefined) {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: queryKeys.communities.detail(idOrName ? `${idOrName}:${user?.id || 'anon'}` : idOrName),
    queryFn: () => {
      if (!idOrName) throw new Error('Community ID or name required');
      return communitiesApi.getCommunity(idOrName, user?.id);
    },
    enabled: !!idOrName,
    retry: (failureCount, error) => {
      const statusCode = (error as { statusCode?: number } | null)?.statusCode;
      if (statusCode === 404) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 45000,
  });
}

/**
 * Search communities
 */
export function useSearchCommunities(query: string | undefined) {
  return useQuery({
    queryKey: queryKeys.communities.search(query || ''),
    queryFn: () => {
      if (!query) throw new Error('Search query required');
      return communitiesApi.searchCommunities(query);
    },
    enabled: !!query && query.length > 0,
    retry: 2,
    staleTime: 30000,
  });
}

/**
 * Join a community
 */
export function useJoinCommunity() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: (communityId: string) => {
      if (!user) throw new Error('Must be logged in to join');
      return communitiesApi.joinCommunity(communityId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all });
      toast.success('Joined community!');
    },
    onError: (error: Error) => {
      console.error('Join error:', error);
      toast.error(error.message || 'Failed to join community');
    },
  });
}

/**
 * Leave a community
 */
export function useLeaveCommunity() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: (communityId: string) => {
      if (!user) throw new Error('Must be logged in to leave');
      return communitiesApi.leaveCommunity(communityId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all });
      toast.success('Left community');
    },
    onError: (error: Error) => {
      console.error('Leave error:', error);
      toast.error(error.message || 'Failed to leave community');
    },
  });
}

/**
 * Create a community
 */
export function useCreateCommunity() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: (payload: {
      name: string;
      description?: string;
      icon_url?: string;
      banner_url?: string;
      iconFile?: File | null;
      bannerFile?: File | null;
    }) => {
      if (!user) throw new Error('Must be logged in to create community');
      return communitiesApi.createCommunity({ ...payload, user_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all });
      toast.success('Community created');
    },
    onError: (error: Error) => {
      console.error('Create community error:', error);
      toast.error(error.message || 'Failed to create community');
    },
  });
}

/**
 * Delete a community
 */
export function useDeleteCommunity() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: (communityId: string) => {
      if (!user) throw new Error('Must be logged in to delete community');
      return communitiesApi.deleteCommunity(communityId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.memberships.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success('Community deleted');
    },
    onError: (error: Error) => {
      console.error('Delete community error:', error);
      toast.error(error.message || 'Failed to delete community');
    },
  });
}

/**
 * Update a community
 */
export function useUpdateCommunity() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: {
        description?: string;
        icon_url?: string;
        banner_url?: string;
        iconFile?: File | null;
        bannerFile?: File | null;
      };
    }) => {
      if (!user) throw new Error('Must be logged in to update community');
      return communitiesApi.updateCommunity(id, { ...updates, user_id: user.id });
    },
    onSuccess: updated => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.communities.detail(updated.name) });
      toast.success('Community updated');
    },
    onError: (error: Error) => {
      console.error('Update community error:', error);
      toast.error(error.message || 'Failed to update community');
    },
  });
}

/**
 * Get user's community memberships
 */
export function useUserMemberships() {
  const user = useAuthStore(state => state.user);

  return useQuery({
    queryKey: queryKeys.memberships.list(user?.id),
    queryFn: () => communitiesApi.getUserMemberships(user!.id),
    enabled: !!user?.id,
    retry: 2,
    staleTime: 45000,
  });
}

/**
 * Remove a member from a community (moderator action)
 */
export function useRemoveCommunityMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subredditId, targetUserId }: { subredditId: string; targetUserId: string }) =>
      communitiesApi.removeMember(subredditId, targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communities.all });
      toast.success('Member removed');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove member');
    },
  });
}

/**
 * Ban a member from a community (moderator action)
 */
export function useBanCommunityMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subredditId,
      targetUserId,
      reason,
    }: {
      subredditId: string;
      targetUserId: string;
      reason?: string;
    }) => communitiesApi.banMember(subredditId, targetUserId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communities.all });
      toast.success('Member banned');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to ban member');
    },
  });
}
