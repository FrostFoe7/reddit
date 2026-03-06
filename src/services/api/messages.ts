/**
 * Messages API Service
 * All messaging-related API calls
 */

import { api } from '@/api/client';
import type { Message, Conversation } from '@/types';
import { normalizeConversation } from '@/types/normalize';

export const messagesApi = {
  /**
   * Get all conversations for user
   */
  async getConversations(userId: string): Promise<Conversation[]> {
    const data = await api.get<Record<string, unknown>[]>(
      `messages?user_id=${encodeURIComponent(userId)}`,
    );
    return data.map(normalizeConversation);
  },

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string, userId: string): Promise<Message[]> {
    return api.get<Message[]>(
      `messages?user_id=${encodeURIComponent(userId)}&conversation_id=${encodeURIComponent(conversationId)}`,
    );
  },

  /**
   * Send message
   */
  async sendMessage(
    conversationId: string,
    content: string,
    senderId: string,
  ): Promise<{ success: boolean; id: string }> {
    return api.post<{ success: boolean; id: string }>('messages', {
      conversation_id: conversationId,
      content,
      sender_id: senderId,
    });
  },

  /**
   * Create conversation
   */
  async createConversation(otherUserId: string): Promise<Conversation> {
    return api.post<Conversation>('conversations', { other_user_id: otherUserId });
  },

  /**
   * Mark conversation as read
   */
  async markAsRead(conversationId: string): Promise<{ message: string }> {
    return api.post<{ message: string }>('messages/mark-read', { conversation_id: conversationId });
  },
};
