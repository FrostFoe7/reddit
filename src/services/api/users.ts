/**
 * Users API Service
 * All user-related API calls
 */

import { api } from '@/api/client';
import type { User } from '@/types';
import { normalizeUser } from '@/types/normalize';

export const usersApi = {
  /**
   * List users
   */
  async getUsers(): Promise<User[]> {
    const data = await api.get<Record<string, unknown>[]>('users');
    return data.map(normalizeUser);
  },

  /**
   * Get user by username
   */
  async getUser(username: string): Promise<User> {
    const data = await api.get<Record<string, unknown>>(
      `users?username=${encodeURIComponent(username)}`,
    );
    return normalizeUser(data);
  },

  /**
   * Update user profile
   */
  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const data = await api.put<Record<string, unknown>>(`users/${encodeURIComponent(userId)}`, {
      user_id: userId,
      ...updates,
    });
    return normalizeUser(data);
  },

  /**
   * Get user's posts
   * Note: This should be done through posts API with filtering
   */
  async getUserPosts(): Promise<never[]> {
    return [];
  },

  /**
   * Get user's comments
   * Note: This should be done through comments API with filtering
   */
  async getUserComments(): Promise<never[]> {
    return [];
  },
};
