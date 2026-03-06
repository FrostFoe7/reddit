import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/services/api/notifications';
import { queryKeys } from '@/services/query/keys';
import { useAuthStore } from '@/store/useStore';
import { toast } from 'sonner';

/**
 * Fetch user notifications
 */
export function useNotifications() {
  const user = useAuthStore(state => state.user);
  const userId = user?.id;

  return useQuery({
    queryKey: queryKeys.notifications.list(userId),
    queryFn: () => notificationsApi.getNotifications(userId!),
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
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: () => {
      if (!user) throw new Error('Must be logged in');
      return notificationsApi.markAllAsRead(user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success('Notifications marked as read');
    },
    onError: (error: Error) => {
      console.error('Mark read error:', error);
      toast.error(error.message || 'Failed to mark notifications as read');
    },
  });
}

/**
 * Mark one notification as read
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  return useMutation({
    mutationFn: (notificationId: string) => {
      if (!user) throw new Error('Must be logged in');
      return notificationsApi.markAsRead(notificationId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
    onError: (error: Error) => {
      console.error('Mark notification read error:', error);
      toast.error(error.message || 'Failed to update notification');
    },
  });
}
