import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Notification } from '@/types';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get<Notification[]>('notifications'),
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => api.post('notifications/mark-read', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
