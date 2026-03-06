/**
 * Type normalization utilities
 * Convert between different field naming conventions in API responses
 */

import type { User, Post, Comment, Conversation, Community, Notification } from './index';

/**
 * Normalize User data from API
 * Handles both snake_case and camelCase field names
 */
export function normalizeUser(data: Record<string, unknown>): User {
  return {
    id: data.id as string,
    username: data.username as string,
    email: (data.email as string | undefined) || undefined,
    avatar_url: (data.avatar_url || data.avatar) as string | undefined,
    banner_url: (data.banner_url as string | undefined) || undefined,
    bio: (data.bio as string | undefined) || undefined,
    karma: (data.karma as number) || 0,
    cake_day: (data.cake_day as string) || (data.created_at as string) || '',
    is_premium: Boolean(data.is_premium),
    is_verified: Boolean(data.is_verified),
    settings: (data.settings as Record<string, unknown> | string | undefined) || undefined,
    last_seen_at: (data.last_seen_at as string | undefined) || undefined,
    created_at: (data.created_at as string) || new Date().toISOString(),
  };
}

/**
 * Normalize Post data from API
 */
export function normalizePost(data: Record<string, unknown>): Post {
  return {
    id: data.id as string,
    subreddit_id: (data.subreddit_id || data.sub_id) as string,
    author_id: data.author_id as string,
    title: data.title as string,
    content: (data.content as string | undefined) || undefined,
    image_url: (data.image_url || data.image) as string | undefined,
    link_url: (data.link_url as string | undefined) || undefined,
    post_type: ((data.post_type || data.type) as 'text' | 'image' | 'link' | 'poll') || 'text',
    is_oc: Boolean(data.is_oc),
    is_spoiler: Boolean(data.is_spoiler),
    is_nsfw: Boolean(data.is_nsfw),
    created_at: (data.created_at as string) || new Date().toISOString(),
    author_username: (data.author_username || data.author) as string | undefined,
    author_avatar: (data.author_avatar as string | undefined) || undefined,
    subreddit_name: (data.subreddit_name || data.sub) as string | undefined,
    subreddit_icon: (data.subreddit_icon || data.subIcon) as string | undefined,
    upvotes: (data.upvotes as number) || 0,
    comment_count: ((data.comment_count || data.comments) as number) || 0,
    user_vote: (data.user_vote as number) || 0,
  };
}

/**
 * Normalize Comment data from API
 */
export function normalizeComment(data: Record<string, unknown>): Comment {
  return {
    id: data.id as string,
    post_id: data.post_id as string,
    author_id: data.author_id as string,
    parent_id: (data.parent_id || data.parentId) as string | undefined,
    content: data.content as string,
    created_at: (data.created_at as string) || new Date().toISOString(),
    author_username: (data.author_username || data.author) as string | undefined,
    author_avatar: (data.author_avatar || data.avatar) as string | undefined,
    upvotes: (data.upvotes as number) || 0,
    user_vote: (data.user_vote as number) || 0,
  };
}

/**
 * Normalize Conversation data from API
 */
export function normalizeConversation(data: Record<string, unknown>): Conversation {
  return {
    id: data.id as string,
    user1_id: (data.user1_id as string | undefined) || undefined,
    user2_id: (data.user2_id as string | undefined) || undefined,
    contact_id: (data.contact_id as string | undefined) || undefined,
    last_message_at: (data.last_message_at || data.time) as string,
    other_user_name:
      ((data.other_user_name || data.contact_name) as string | undefined) || undefined,
    other_user_avatar:
      ((data.other_user_avatar || data.contact_avatar) as string | undefined) || undefined,
    contact_name: (data.contact_name as string | undefined) || undefined,
    contact_avatar: (data.contact_avatar as string | undefined) || undefined,
    last_msg: (data.last_msg as string | undefined) || undefined,
    time: (data.time as string | undefined) || undefined,
  };
}

/**
 * Normalize Community data from API
 */
export function normalizeCommunity(data: Record<string, unknown>): Community {
  return {
    id: data.id as string,
    name: data.name as string,
    description: (data.description || data.desc) as string | undefined,
    icon_url: (data.icon_url || data.icon) as string | undefined,
    banner_url: (data.banner_url as string | undefined) || undefined,
    creator_id: (data.creator_id as string | undefined) || undefined,
    owner_id: (data.owner_id as string | undefined) || undefined,
    current_user_role:
      ((data.current_user_role as 'member' | 'moderator' | 'admin' | null | undefined) ??
        null),
    can_manage: Boolean(data.can_manage),
    is_joined: Boolean(data.is_joined),
    is_verified: Boolean(data.is_verified),
    members: (data.members as number | string | undefined) || 0,
    post_count: (data.post_count as number | undefined) || 0,
    created_at: (data.created_at as string) || new Date().toISOString(),
    rules:
      (data.rules as Array<{ title: string; content?: string; description?: string }> | undefined)
        ?.map(rule => ({ title: rule.title, content: rule.content || rule.description })) ||
      undefined,
    moderators:
      (data.moderators as
        | Array<{ id: string; username: string; avatar_url?: string }>
        | undefined) || undefined,
    members_list:
      (data.members_list as
        | Array<{ id: string; username: string; avatar_url?: string; role?: string }>
        | undefined) || undefined,
  };
}

/**
 * Normalize Notification data from API
 */
export function normalizeNotification(data: Record<string, unknown>): Notification {
  return {
    id: data.id as string,
    recipient_id: data.recipient_id as string,
    actor_id: (data.actor_id as string | undefined) || undefined,
    type: data.type as string,
    post_id: (data.post_id as string | undefined) || undefined,
    comment_id: (data.comment_id as string | undefined) || undefined,
    text: data.text as string,
    is_read: Boolean(data.is_read || data.isRead),
    created_at: (data.created_at as string) || new Date().toISOString(),
    user:
      ((data.user || data.actor_name || data.type) as string | undefined) ||
      undefined,
    sub: (data.sub as string | undefined) || undefined,
    actor_name: (data.actor_name as string | undefined) || undefined,
    actor_avatar: (data.actor_avatar as string | undefined) || undefined,
    time:
      (data.time as string | undefined) ||
      ((data.created_at as string | undefined) ?? undefined),
  };
}
