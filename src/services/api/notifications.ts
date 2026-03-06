/**
 * Notifications API Service
 * All notification-related API calls
 */

import { api } from '@/api/client';
import type { Notification } from '@/types';
import { normalizeNotification } from '@/types/normalize';

export const notificationsApi = {
  /**
   * Get user notifications
   */
  async getNotifications(userId: string): Promise<Notification[]> {
    const data = await api.get<Record<string, unknown>[]>(
      `notifications?user_id=${encodeURIComponent(userId)}`,
    );
    return data.map(normalizeNotification);
  },

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<{ unread_count: number }> {
    const notifications = await this.getNotifications(userId);
    return { unread_count: notifications.filter(notification => !notification.is_read).length };
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>('notifications/mark-read', {
      user_id: userId,
      notification_id: notificationId,
    });
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>('notifications/mark-read', { user_id: userId });
  },
};
