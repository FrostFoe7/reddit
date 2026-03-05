import { useMutation, useQueryClient } from '@tanstack/react-query';
import { votesApi } from '@/services/api/votes';
import { queryKeys } from '@/services/query/keys';
import { useAuthStore } from '@/store/useStore';
import { toast } from 'sonner';

/**
 * Vote on posts or comments
 */
export function useVotes() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: async (variables: {
      type: 'post' | 'comment';
      target_id: string;
      vote: number;
    }) => {
      if (!user) throw new Error('Must be logged in to vote');
      return votesApi.vote({
        ...variables,
        user_id: user.id,
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      if (variables.type === 'post') {
        queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      } else if (variables.type === 'comment') {
        queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
      }
      toast.success('Vote registered');
    },
    onError: (error: Error) => {
      console.error('Vote error:', error);
      toast.error(error.message || 'Failed to process vote');
    },
  });
}
