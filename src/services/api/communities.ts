/**
 * Communities API Service
 * All community-related API calls
 */

import { api } from '@/api/client';
import type { Community } from '@/types';

export const communitiesApi = {
  /**
   * Fetch all communities
   */
  async getCommunities(): Promise<Community[]> {
    return api.get<Community[]>('communities');
  },

  /**
   * Search communities
   */
  async searchCommunities(query: string): Promise<Community[]> {
    const params = new URLSearchParams({ q: query });
    return api.get<Community[]>(`communities?${params.toString()}`);
  },

  /**
   * Get community by ID or name
   */
  async getCommunity(idOrName: string): Promise<Community> {
    return api.get<Community>(`communities/${idOrName}`);
  },

  /**
   * Create new community
   */
  async createCommunity(community: Partial<Community>): Promise<Community> {
    return api.post<Community>('communities', community);
  },

  /**
   * Update community
   */
  async updateCommunity(id: string, updates: Partial<Community>): Promise<Community> {
    return api.put<Community>(`communities/${id}`, updates);
  },

  /**
   * Join community
   */
  async joinCommunity(communityId: string): Promise<void> {
    await api.post(`communities/${communityId}/join`, {});
  },

  /**
   * Leave community
   */
  async leaveCommunity(communityId: string): Promise<void> {
    await api.post(`communities/${communityId}/leave`, {});
  },
};
