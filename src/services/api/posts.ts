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
  async getPosts(sort: string = 'new', userId?: string): Promise<Post[]> {
    const params = new URLSearchParams({ sort });
    if (userId) params.append('user_id', userId);
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
  async createPost(newPost: Partial<Post>): Promise<Post> {
    const data = await api.post<Record<string, unknown>>('posts', newPost);
    return normalizePost(data);
  },

  /**
   * Update post
   */
  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    const data = await api.put<Record<string, unknown>>(`posts/${id}`, updates);
    return normalizePost(data);
  },

  /**
   * Delete post
   */
  async deletePost(id: string): Promise<void> {
    await api.delete(`posts/${id}`);
  },
};
