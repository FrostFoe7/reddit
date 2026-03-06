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
    community: {
      name: string;
      description?: string;
      iconFile?: File | null;
      bannerFile?: File | null;
      icon_url?: string;
      banner_url?: string;
      user_id?: string;
    },
  ): Promise<Community> {
    const formData = new FormData();
    formData.append('name', community.name);
    if (community.description) formData.append('description', community.description);
    if (community.icon_url) formData.append('icon_url', community.icon_url);
    if (community.banner_url) formData.append('banner_url', community.banner_url);
    if (community.user_id) formData.append('user_id', community.user_id);
    if (community.iconFile) formData.append('icon', community.iconFile);
    if (community.bannerFile) formData.append('banner', community.bannerFile);

    const data = await api.postForm<Record<string, unknown>>('communities/create', formData, {
      timeout: 60000,
    });
    return normalizeCommunity(data);
  },

  /**
   * Update community
   */
  async updateCommunity(
    id: string,
    updates: {
      description?: string;
      icon_url?: string;
      banner_url?: string;
      iconFile?: File | null;
      bannerFile?: File | null;
      user_id?: string;
    },
  ): Promise<Community> {
    const formData = new FormData();
    if (typeof updates.description !== 'undefined') formData.append('description', updates.description);
    if (typeof updates.icon_url !== 'undefined') formData.append('icon_url', updates.icon_url);
    if (typeof updates.banner_url !== 'undefined') formData.append('banner_url', updates.banner_url);
    if (updates.user_id) formData.append('user_id', updates.user_id);
    if (updates.iconFile) formData.append('icon', updates.iconFile);
    if (updates.bannerFile) formData.append('banner', updates.bannerFile);

    const data = await api.postForm<Record<string, unknown>>(`communities/${encodeURIComponent(id)}`, formData, {
      timeout: 60000,
      headers: {
        'X-HTTP-Method-Override': 'PUT',
      },
    });
    return normalizeCommunity(data);
  },

  /**
   * Delete community
   */
  async deleteCommunity(id: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(`communities/${encodeURIComponent(id)}`);
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

  async removeMember(subredditId: string, targetUserId: string): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>('communities/mod/remove-member', {
      subreddit_id: subredditId,
      target_user_id: targetUserId,
    });
  },

  async banMember(
    subredditId: string,
    targetUserId: string,
    reason?: string,
  ): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>('communities/mod/ban-member', {
      subreddit_id: subredditId,
      target_user_id: targetUserId,
      reason,
    });
  },
};
