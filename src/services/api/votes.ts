/**
 * Votes API Service
 * All voting-related API calls
 */

import { api } from '@/api/client';

export interface VoteRequest {
  type: 'post' | 'comment';
  target_id: string;
  vote: number; // 1, -1, or 0
  user_id?: string;
}

export const votesApi = {
  /**
   * Vote on a post or comment
   */
  async vote(voteData: VoteRequest): Promise<void> {
    await api.post('votes', voteData);
  },

  /**
   * Remove vote
   */
  async removeVote(type: 'post' | 'comment', targetId: string): Promise<void> {
    await api.post('votes', {
      type,
      target_id: targetId,
      vote: 0,
    });
  },
};
