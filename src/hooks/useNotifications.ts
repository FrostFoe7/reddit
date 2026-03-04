import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Notification } from "@/types";
import { useAuthStore } from "@/store/useStore";

export function useNotifications() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => api.get<Notification[]>(userId ? `notifications?user_id=${userId}` : "notifications"),
    enabled: !!userId,
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  return useMutation({
    mutationFn: () => api.post("notifications/mark-read", { user_id: userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });
}
