import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "@/api/client";
import type { Post } from "@/types";
import { normalizePost } from "@/types/normalize";
import { useAuthStore } from "@/store/useStore";

/**
 * Fetch all posts with optional sorting and user context
 */
export function usePosts(sort: string = 'new') {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["posts", userId, sort],
    queryFn: async () => {
      const params = new URLSearchParams({ sort });
      if (userId) params.append("user_id", userId);
      const endpoint = `posts?${params.toString()}`;
      const data = await api.get<Record<string, unknown>[]>(endpoint);
      return data.map(normalizePost);
    },
    retry: 2,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Search posts by query
 */
export function useSearchPosts(query: string) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["posts", "search", query, userId],
    queryFn: async () => {
      const params = new URLSearchParams({ q: query });
      if (userId) params.append("user_id", userId);
      const endpoint = `posts?${params.toString()}`;
      const data = await api.get<Record<string, unknown>[]>(endpoint);
      return data.map(normalizePost);
    },
    enabled: !!query && query.length > 0,
    retry: 2,
    staleTime: 20000, // 20 seconds
  });
}

/**
 * Fetch single post by ID
 */
export function usePost(id: string | undefined) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["posts", id, userId],
    queryFn: async () => {
      if (!id) throw new Error("Post ID is required");
      const params = userId ? `?user_id=${userId}` : "";
      const data = await api.get<Record<string, unknown>>(`posts/${id}${params}`);
      return normalizePost(data);
    },
    enabled: !!id,
    retry: 2,
    staleTime: 45000, // 45 seconds
  });
}

/**
 * Create new post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: Partial<Post>) => {
      const data = await api.post<Record<string, unknown>>("posts", newPost);
      return normalizePost(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: ApiError) => {
      console.error("Failed to create post:", error.message);
    },
  });
}
