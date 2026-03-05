import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ApiError } from "@/api/client";
import { normalizeNotification } from "@/types/normalize";
import { useAuthStore } from "@/store/useStore";
import { toast } from "sonner";

/**
 * Fetch user notifications
 */
export function useNotifications() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");
      const data = await api.get<Record<string, unknown>[]>(`notifications?user_id=${userId}`);
      return data.map(normalizeNotification);
    },
    enabled: !!userId,
    retry: 2,
    staleTime: 20000,
    refetchInterval: 30000, // Poll every 30 seconds
  });
}

/**
 * Mark all notifications as read
 */
export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User ID required");
      return api.post("notifications/mark-read", { user_id: userId }, { timeout: 15000 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      toast.success("Notifications marked as read");
    },
    onError: (error: ApiError) => {
      console.error("Mark read error:", error);
      toast.error(error.message || "Failed to mark notifications as read");
    },
  });
}
