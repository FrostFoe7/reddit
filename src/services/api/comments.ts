/**
 * Comments API Service
 * All comment-related API calls
 */

import { api } from '@/api/client';
import type { Comment } from '@/types';
import { normalizeComment } from '@/types/normalize';

export const commentsApi = {
  /**
   * Fetch comments for a post
   */
  async getComments(postId?: string, userId?: string): Promise<Comment[]> {
    const params = new URLSearchParams();
    if (postId) params.append('postId', postId);
    if (userId) params.append('user_id', userId);
    const endpoint = params.toString() ? `comments?${params.toString()}` : 'comments';
    const data = await api.get<Record<string, unknown>[]>(endpoint);
    return data.map(normalizeComment);
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
    const payload: Record<string, unknown> = {
      ...comment,
    };

    if (!('user_id' in payload) && typeof payload.author_id === 'string') {
      payload.user_id = payload.author_id;
    }

    const data = await api.post<Record<string, unknown>>('comments', payload);

    if ('content' in data) {
      return normalizeComment(data);
    }

    // The backend may return only { success, id } for create operations.
    return normalizeComment({
      ...comment,
      id: (data.id as string) || comment.id || '',
      created_at: new Date().toISOString(),
      upvotes: 0,
      user_vote: 0,
    });
  },

  /**
   * Update comment
   */
  async updateComment(id: string, updates: Partial<Comment> & { user_id?: string }): Promise<Comment> {
    const data = await api.put<Record<string, unknown>>(`comments/${id}`, updates);
    return normalizeComment(data);
  },

  /**
   * Delete comment
   */
  async deleteComment(id: string, userId: string): Promise<void> {
    await api.delete(`comments/${id}?user_id=${encodeURIComponent(userId)}`);
  },
};
