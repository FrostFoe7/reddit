/**
 * Communities API Service
 * All community-related API calls
 */

import { api } from '@/api/client';
import type { Community } from '@/types';
import { normalizeCommunity } from '@/types/normalize';

export const communitiesApi = {
  /**
   * Fetch all communities
   */
  async getCommunities(): Promise<Community[]> {
    const data = await api.get<Record<string, unknown>[]>('communities');
    return data.map(normalizeCommunity);
  },

  /**
   * Search communities
   */
  async searchCommunities(query: string): Promise<Community[]> {
    const all = await this.getCommunities();
    const q = query.toLowerCase();
    return all.filter(
      community =>
        community.name.toLowerCase().includes(q) ||
        (community.description || '').toLowerCase().includes(q),
    );
  },

  /**
   * Get community by ID or name
   */
  async getCommunity(idOrName: string, userId?: string): Promise<Community> {
    const params = new URLSearchParams({ name: idOrName });
    if (userId) params.append('user_id', userId);
    const data = await api.get<Record<string, unknown>>(`communities?${params.toString()}`);
    return normalizeCommunity(data);
  },

  /**
   * Create new community
   */
  async createCommunity(
    community: Partial<Community> & { user_id: string },
  ): Promise<Community> {
    const data = await api.post<Record<string, unknown>>('communities/create', community);
    return normalizeCommunity(data);
  },

  /**
   * Update community
   */
  async updateCommunity(id: string, updates: Partial<Community>): Promise<Community> {
    const data = await api.put<Record<string, unknown>>(`communities/${id}`, updates);
    return normalizeCommunity(data);
  },

  /**
   * Delete community
   */
  async deleteCommunity(id: string, userId: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(`communities/${id}?user_id=${encodeURIComponent(userId)}`);
  },

  /**
   * Join community
   */
  async joinCommunity(communityId: string, userId: string): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>('communities/join', {
      subreddit_id: communityId,
      user_id: userId,
    });
  },

  /**
   * Leave community
   */
  async leaveCommunity(communityId: string, userId: string): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>('communities/leave', {
      subreddit_id: communityId,
      user_id: userId,
    });
  },

  /**
   * Get user's community memberships
   */
  async getUserMemberships(userId: string): Promise<string[]> {
    return api.get<string[]>(`users/memberships?user_id=${encodeURIComponent(userId)}`);
  },
};
