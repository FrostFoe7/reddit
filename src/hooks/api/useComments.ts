import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/services/api/comments';
import { queryKeys } from '@/services/query/keys';
import type { Comment } from '@/types';
import { useAuthStore } from '@/store/useStore';
import { toast } from 'sonner';

/**
 * Fetch comments for a post
 */
export function useComments(postId: string | undefined) {
  const user = useAuthStore(state => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: queryKeys.comments.list(postId, userId),
    queryFn: () => commentsApi.getComments(postId, userId),
    enabled: true,
    staleTime: 30000,
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });
}

/**
 * Create new comment
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: Partial<Comment>) => commentsApi.createComment(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
      toast.success('Comment posted!');
    },
    onError: (error: Error) => {
      console.error('Create comment error:', error);
      toast.error(error.message || 'Failed to post comment');
    },
  });
}

/**
 * Update comment
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Comment> }) =>
      commentsApi.updateComment(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
      toast.success('Comment updated!');
    },
    onError: (error: Error) => {
      console.error('Update comment error:', error);
      toast.error(error.message || 'Failed to update comment');
    },
  });
}

/**
 * Delete comment
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => commentsApi.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.all });
      toast.success('Comment deleted');
    },
    onError: (error: Error) => {
      console.error('Delete comment error:', error);
      toast.error(error.message || 'Failed to delete comment');
    },
  });
}
