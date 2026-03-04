import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Comment } from "@/types";

export function useComments(postId: string | undefined) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => api.get<Comment[]>(`comments?postId=${postId}`),
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newComment: Partial<Comment>) =>
      api.post<Comment>("comments", newComment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.post_id],
      });
    },
  });
}
