/**
 * Posts API Service
 * All post-related API calls
 */

import { api } from '@/api/client';
import type { Post } from '@/types';
import { normalizePost } from '@/types/normalize';

export const postsApi = {
  /**
   * Fetch all posts with filtering
   */
  async getPosts(sort: string = 'new', userId?: string, subredditId?: string): Promise<Post[]> {
    const params = new URLSearchParams({ sort });
    if (userId) params.append('user_id', userId);
    if (subredditId) params.append('subreddit_id', subredditId);
    const endpoint = `posts?${params.toString()}`;
    const data = await api.get<Record<string, unknown>[]>(endpoint);
    return data.map(normalizePost);
  },

  /**
   * Search posts
   */
  async searchPosts(query: string, userId?: string): Promise<Post[]> {
    const params = new URLSearchParams({ q: query });
    if (userId) params.append('user_id', userId);
    const endpoint = `posts?${params.toString()}`;
    const data = await api.get<Record<string, unknown>[]>(endpoint);
    return data.map(normalizePost);
  },

  /**
   * Get single post by ID
   */
  async getPost(id: string, userId?: string): Promise<Post> {
    const params = userId ? `?user_id=${userId}` : '';
    const data = await api.get<Record<string, unknown>>(`posts/${id}${params}`);
    return normalizePost(data);
  },

  /**
   * Create new post
   */
  async createPost(newPost: Partial<Post> & { user_id?: string }): Promise<Post> {
    const data = await api.post<Record<string, unknown>>('posts', newPost);

    if (!('title' in data)) {
      return normalizePost({
        ...newPost,
        id: (data.id as string) || newPost.id || '',
        upvotes: 0,
        comment_count: 0,
        user_vote: 0,
        created_at: new Date().toISOString(),
      });
    }

    return normalizePost(data);
  },

  /**
   * Update post
   */
  async updatePost(id: string, updates: Partial<Post> & { user_id?: string }): Promise<Post> {
    const data = await api.put<Record<string, unknown>>(`posts/${id}`, updates);
    return normalizePost(data);
  },

  /**
   * Delete post
   */
  async deletePost(id: string, userId: string): Promise<void> {
    await api.delete(`posts/${id}?user_id=${encodeURIComponent(userId)}`);
  },
};
