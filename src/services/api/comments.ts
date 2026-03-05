/**
 * Comments API Service
 * All comment-related API calls
 */

import { api } from '@/api/client';
import type { Comment } from '@/types';

export const commentsApi = {
  /**
   * Fetch comments for a post
   */
  async getComments(postId?: string, userId?: string): Promise<Comment[]> {
    const params = new URLSearchParams();
    if (postId) params.append('post_id', postId);
    if (userId) params.append('user_id', userId);
    const endpoint = `comments?${params.toString()}`;
    return api.get<Comment[]>(endpoint);
  },

  /**
   * Get single comment by ID
   */
  async getComment(id: string): Promise<Comment> {
    return api.get<Comment>(`comments/${id}`);
  },

  /**
   * Create new comment
   */
  async createComment(comment: Partial<Comment>): Promise<Comment> {
    return api.post<Comment>('comments', comment);
  },

  /**
   * Update comment
   */
  async updateComment(id: string, updates: Partial<Comment>): Promise<Comment> {
    return api.put<Comment>(`comments/${id}`, updates);
  },

  /**
   * Delete comment
   */
  async deleteComment(id: string): Promise<void> {
    await api.delete(`comments/${id}`);
  },
};
