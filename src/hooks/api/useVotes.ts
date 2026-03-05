import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "@/api/client";
import { useAuthStore } from "@/store/useStore";
import { toast } from "sonner";

/**
 * Vote on posts or comments
 */
export function useVotes() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (variables: {
      type: "post" | "comment";
      target_id: string;
      vote: number;
    }) => {
      if (!user) throw new Error("Must be logged in to vote");
      return api.post("votes", {
        ...variables,
        user_id: user.id,
      }, { timeout: 15000 });
    },
    onSuccess: (_, variables) => {
      if (variables.type === "post") {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      } else if (variables.type === "comment") {
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
      toast.success("Vote registered");
    },
    onError: (error: ApiError) => {
      console.error("Vote error:", error);
      toast.error(error.message || "Failed to process vote");
    },
  });
}
