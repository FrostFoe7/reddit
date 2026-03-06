/**
 * Centralized React Query Key Factory
 * Ensures consistent query key patterns across the application
 */

export const queryKeys = {
  // Posts
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (sort: string, userId?: string, subredditId?: string) =>
      [...queryKeys.posts.lists(), { sort, userId, subredditId }] as const,
    search: (query: string, userId?: string) =>
      [...queryKeys.posts.all, 'search', query, userId] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string, userId?: string) => [...queryKeys.posts.details(), id, userId] as const,
  },

  // Comments
  comments: {
    all: ['comments'] as const,
    lists: () => [...queryKeys.comments.all, 'list'] as const,
    list: (postId?: string, userId?: string) =>
      [...queryKeys.comments.lists(), postId, userId] as const,
    details: () => [...queryKeys.comments.all, 'detail'] as const,
    detail: (id: string, userId?: string) => [...queryKeys.comments.details(), id, userId] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (username: string) => [...queryKeys.users.details(), username] as const,
  },

  // Communities
  communities: {
    all: ['communities'] as const,
    lists: () => [...queryKeys.communities.all, 'list'] as const,
    top: (limit: number) => [...queryKeys.communities.all, 'top', limit] as const,
    search: (query: string) => [...queryKeys.communities.all, 'search', query] as const,
    details: () => [...queryKeys.communities.all, 'detail'] as const,
    detail: (id: string | undefined) => [...queryKeys.communities.details(), id] as const,
    members: (id: string) => [...queryKeys.communities.detail(id), 'members'] as const,
  },

  // Messages
  messages: {
    all: ['messages'] as const,
    lists: () => [...queryKeys.messages.all, 'list'] as const,
    conversations: (userId?: string) => [...queryKeys.messages.all, 'conversations', userId] as const,
    conversation: (conversationId: string | null) =>
      [...queryKeys.messages.all, 'conversation', conversationId] as const,
  },

  // Notifications
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (userId?: string) => [...queryKeys.notifications.lists(), userId] as const,
  },

  // Votes
  votes: {
    all: ['votes'] as const,
  },

  // User memberships
  memberships: {
    all: ['memberships'] as const,
    list: (userId?: string) => [...queryKeys.memberships.all, userId] as const,
  },
};
