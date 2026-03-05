/**
 * Notifications API Service
 * All notification-related API calls
 */

import { api } from '@/api/client';

export interface Notification {
  id: string;
  type: 'comment' | 'upvote' | 'mention' | 'follow';
  content: string;
  actor_id: string;
  target_id: string;
  read: boolean;
  created_at: string;
}

export const notificationsApi = {
  /**
   * Get user notifications
   */
  async getNotifications(): Promise<Notification[]> {
    return api.get<Notification[]>('notifications');
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await api.put(`notifications/${notificationId}`, { read: true });
  },

  /**
   * Mark all as read
   */
  async markAllAsRead(): Promise<void> {
    await api.post('notifications/mark-all-read', {});
  },
};
