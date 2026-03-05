import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "@/api/client";
import type { Comment } from "@/types";
import { normalizeComment } from "@/types/normalize";
import { useAuthStore } from "@/store/useStore";
import { toast } from "sonner";

/**
 * Fetch comments for a specific post
 */
export function useComments(postId: string | undefined) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["comments", postId, userId],
    queryFn: async () => {
      if (!postId) throw new Error("Post ID required");
      const params = new URLSearchParams({ postId });
      if (userId) params.append("user_id", userId);
      const data = await api.get<Record<string, unknown>[]>(`comments?${params.toString()}`);
      return data.map(normalizeComment);
    },
    enabled: !!postId,
    retry: 2,
    staleTime: 30000,
  });
}

/**
 * Create new comment on a post
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment: Partial<Comment>) => {
      const data = await api.post<Record<string, unknown>>("comments", newComment);
      return normalizeComment(data);
    },
    onSuccess: (_, variables) => {
      if (variables.post_id) {
        queryClient.invalidateQueries({
          queryKey: ["comments", variables.post_id],
        });
      }
      toast.success("Comment posted");
    },
    onError: (error: ApiError) => {
      console.error("Comment error:", error);
      toast.error(error.message || "Failed to post comment");
    },
  });
}
