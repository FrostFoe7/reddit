import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Post } from "@/types";

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => api.get<Post[]>("posts"),
  });
}

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => api.get<Post>(`posts/${id}`),
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
