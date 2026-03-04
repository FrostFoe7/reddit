import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Community } from "@/types";
import { useAuthStore } from "@/store/useStore";
import { toast } from "sonner";

export function useCommunities() {
  return useQuery({
    queryKey: ["communities"],
    queryFn: () => api.get<Community[]>("communities"),
  });
}

export function useTopCommunities(limit: number = 5) {
  return useQuery({
    queryKey: ["communities", "top", limit],
    queryFn: () => api.get<Community[]>(`communities?top=${limit}`),
  });
}

export function useCommunity(name: string | undefined) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["communities", name, userId],
    queryFn: () => api.get<Community>(userId ? `communities?name=${name}&user_id=${userId}` : `communities?name=${name}`),
    enabled: !!name,
  });
}

export function useJoinCommunity() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (subreddit_id: string) => {
      if (!user) throw new Error("Must be logged in to join");
      return api.post("communities/join", {
        user_id: user.id,
        subreddit_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["memberships", user?.id] });
      toast.success("Joined community!");
    },
  });
}

export function useLeaveCommunity() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (subreddit_id: string) => {
      if (!user) throw new Error("Must be logged in to leave");
      return api.post("communities/leave", {
        user_id: user.id,
        subreddit_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["memberships", user?.id] });
      toast.success("Left community");
    },
  });
}

export function useUserMemberships() {
    const user = useAuthStore((state) => state.user);
    return useQuery({
        queryKey: ["memberships", user?.id],
        queryFn: () => api.get<string[]>(`users/memberships?user_id=${user?.id}`),
        enabled: !!user?.id
    });
}
