/**
 * Messages API Service
 * All messaging-related API calls
 */

import { api } from '@/api/client';
import type { Message, Conversation } from '@/types';

export const messagesApi = {
  /**
   * Get all conversations for user
   */
  async getConversations(): Promise<Conversation[]> {
    return api.get<Conversation[]>('conversations');
  },

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    return api.get<Message[]>(`conversations/${conversationId}/messages`);
  },

  /**
   * Send message
   */
  async sendMessage(conversationId: string, content: string): Promise<Message> {
    return api.post<Message>(`conversations/${conversationId}/messages`, { content });
  },

  /**
   * Create conversation
   */
  async createConversation(userId: string): Promise<Conversation> {
    return api.post<Conversation>('conversations', { user_id: userId });
  },
};
