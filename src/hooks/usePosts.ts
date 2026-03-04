import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Post } from "@/types";
import { useAuthStore } from "@/store/useStore";

export function usePosts() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["posts", userId],
    queryFn: () => api.get<Post[]>(userId ? `posts?user_id=${userId}` : "posts"),
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
