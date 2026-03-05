/**
 * Users API Service
 * All user-related API calls
 */

import { api } from '@/api/client';
import type { User } from '@/types';

export const usersApi = {
  /**
   * Get user by username
   */
  async getUser(username: string): Promise<User> {
    return api.get<User>(`users/${username}`);
  },

  /**
   * Update user profile
   */
  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    return api.put<User>(`users/${userId}`, updates);
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
