import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Comment } from "@/types";
import { useAuthStore } from "@/store/useStore";

export function useComments(postId: string | undefined) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["comments", postId, userId],
    queryFn: () => {
        let url = `comments?postId=${postId}`;
        if (userId) url += `&user_id=${userId}`;
        return api.get<Comment[]>(url);
    },
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
