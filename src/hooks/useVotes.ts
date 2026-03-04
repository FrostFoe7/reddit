import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useStore";
import { toast } from "sonner";

export function useVotes() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (variables: {
      type: "post" | "comment";
      target_id: string;
      vote: number;
    }) => {
      if (!user) throw new Error("Must be logged in to vote");
      return api.post("votes", {
        ...variables,
        user_id: user.id,
      });
    },
    onSuccess: (_, variables) => {
      if (variables.type === "post") {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to process vote");
    },
  });
}
