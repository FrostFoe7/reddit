import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "@/api/client";
import { normalizeCommunity } from "@/types/normalize";
import { useAuthStore } from "@/store/useStore";
import { toast } from "sonner";

/**
 * Fetch all communities
 */
export function useCommunities() {
  return useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const data = await api.get<Record<string, unknown>[]>("communities");
      return data.map(normalizeCommunity);
    },
    retry: 2,
    staleTime: 60000,
  });
}

/**
 * Fetch top communities
 */
export function useTopCommunities(limit: number = 5) {
  return useQuery({
    queryKey: ["communities", "top", limit],
    queryFn: async () => {
      const data = await api.get<Record<string, unknown>[]>(`communities?top=${limit}`);
      return data.map(normalizeCommunity);
    },
    retry: 2,
    staleTime: 80000,
  });
}

/**
 * Fetch single community by name
 */
export function useCommunity(name: string | undefined) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["communities", name, userId],
    queryFn: async () => {
      if (!name) throw new Error("Community name required");
      const params = new URLSearchParams({ name });
      if (userId) params.append("user_id", userId);
      const data = await api.get<Record<string, unknown>>(`communities?${params.toString()}`);
      return normalizeCommunity(data);
    },
    enabled: !!name,
    retry: 2,
    staleTime: 45000,
  });
}

/**
 * Join a community
 */
export function useJoinCommunity() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (subreddit_id: string) => {
      if (!user) throw new Error("Must be logged in to join");
      return api.post("communities/join", {
        user_id: user.id,
        subreddit_id,
      }, { timeout: 15000 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["memberships", user?.id] });
      toast.success("Joined community!");
    },
    onError: (error: ApiError) => {
      console.error("Join error:", error);
      toast.error(error.message || "Failed to join community");
    },
  });
}

/**
 * Leave a community
 */
export function useLeaveCommunity() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (subreddit_id: string) => {
      if (!user) throw new Error("Must be logged in to leave");
      return api.post("communities/leave", {
        user_id: user.id,
        subreddit_id,
      }, { timeout: 15000 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["memberships", user?.id] });
      toast.success("Left community");
    },
    onError: (error: ApiError) => {
      console.error("Leave error:", error);
      toast.error(error.message || "Failed to leave community");
    },
  });
}

/**
 * Get user's community memberships
 */
export function useUserMemberships() {
  const user = useAuthStore((state) => state.user);
  
  return useQuery({
    queryKey: ["memberships", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User ID required");
      const data = await api.get<string[]>(`users/memberships?user_id=${user.id}`);
      return data;
    },
    enabled: !!user?.id,
    retry: 2,
    staleTime: 45000,
  });
}
