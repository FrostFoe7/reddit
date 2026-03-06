import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '@/services/api/posts';
import { queryKeys } from '@/services/query/keys';
import type { Post } from '@/types';
import { useAuthStore } from '@/store/useStore';
import { toast } from 'sonner';

/**
 * Fetch all posts with optional sorting and user context
 */
export function usePosts(sort: string = 'new', subredditId?: string) {
  const user = useAuthStore(state => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: queryKeys.posts.list(sort, userId, subredditId),
    queryFn: () => postsApi.getPosts(sort, userId, subredditId),
    staleTime: 30000, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes (renamed from cacheTime)
    retry: 1,
  });
}

/**
 * Search posts by query
 */
export function useSearchPosts(query: string) {
  const user = useAuthStore(state => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: queryKeys.posts.search(query, userId),
    queryFn: () => postsApi.searchPosts(query, userId),
    enabled: !!query && query.length > 0,
    staleTime: 20000, // 20 seconds
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });
}

/**
 * Fetch single post by ID
 */
export function usePost(id: string | undefined) {
  const user = useAuthStore(state => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: queryKeys.posts.detail(id ?? '', userId),
    queryFn: () => postsApi.getPost(id!, userId),
    enabled: !!id,
    staleTime: 45000, // 45 seconds
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });
}

/**
 * Create new post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPost: Partial<Post>) => postsApi.createPost(newPost),
    onSuccess: () => {
      // Invalidate all post queries to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success('Post created successfully!');
    },
    onError: (error: Error) => {
      console.error('Create post error:', error);
      toast.error(error.message || 'Failed to create post');
    },
  });
}

/**
 * Update post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Post> & { user_id?: string };
    }) =>
      postsApi.updatePost(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success('Post updated successfully!');
    },
    onError: (error: Error) => {
      console.error('Update post error:', error);
      toast.error(error.message || 'Failed to update post');
    },
  });
}

/**
 * Delete post
 */
export function useDeletePost() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: (id: string) => {
      if (!user) throw new Error('Must be logged in to delete posts');
      return postsApi.deletePost(id, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      toast.success('Post deleted successfully');
    },
    onError: (error: Error) => {
      console.error('Delete post error:', error);
      toast.error(error.message || 'Failed to delete post');
    },
  });
}
