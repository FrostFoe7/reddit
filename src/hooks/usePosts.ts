import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Post } from "@/types";
import { useAuthStore } from "@/store/useStore";

export function usePosts(sort: string = 'new') {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["posts", userId, sort],
    queryFn: () => {
        let url = `posts?sort=${sort}`;
        if (userId) url += `&user_id=${userId}`;
        return api.get<Post[]>(url);
    },
  });
}

export function useSearchPosts(query: string) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["posts", "search", query, userId],
    queryFn: () => {
        let url = `posts?q=${encodeURIComponent(query)}`;
        if (userId) url += `&user_id=${userId}`;
        return api.get<Post[]>(url);
    },
    enabled: !!query,
  });
}

export function usePost(id: string | undefined) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["posts", id, userId],
    queryFn: () => api.get<Post>(userId ? `posts/${id}?user_id=${userId}` : `posts/${id}`),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPost: Partial<Post>) => api.post<Post>("posts", newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
