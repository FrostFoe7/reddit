export interface User {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  avatar?: string; // Fallback
  banner_url?: string;
  bio?: string;
  karma: number;
  cake_day: string;
  is_premium: boolean;
  is_verified: boolean;
  last_seen_at?: string;
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  description?: string;
  desc?: string; // Fallback
  icon_url?: string;
  icon?: string; // Fallback
  banner_url?: string;
  owner_id?: string;
  is_verified: boolean;
  members?: number | string;
  created_at: string;
  rules?: { title: string; content?: string }[];
  moderators?: { id: string; username: string; avatar_url?: string }[];
  wiki?: string;
}

export interface Post {
  id: string;
  subreddit_id: string;
  sub_id?: string; // Fallback
  sub?: string; // Fallback
  author_id: string;
  author?: string; // Fallback
  title: string;
  content?: string;
  image_url?: string;
  image?: string; // Fallback
  link_url?: string;
  post_type: "text" | "image" | "link" | "poll";
  type?: "text" | "image"; // Fallback
  is_oc: boolean;
  is_spoiler: boolean;
  is_nsfw: boolean;
  created_at: string;
  time?: string; // Fallback
  // View fields
  author_username?: string;
  author_avatar?: string;
  subreddit_name?: string;
  subreddit_icon?: string;
  subIcon?: string; // Fallback
  upvotes: number;
  comment_count: number;
  comments?: number; // Fallback
  user_vote?: number; // 1, -1, or 0
}

export interface Comment {
  id: string;
  post_id: string;
  postId?: string; // Fallback
  author_id: string;
  author?: string; // Fallback
  parent_id?: string;
  parentId?: string; // Fallback
  content: string;
  created_at: string;
  time?: string; // Fallback
  isOp?: boolean;
  avatar?: string; // Fallback
  // View fields
  author_username?: string;
  author_avatar?: string;
  upvotes: number;
  user_vote?: number; // 1, -1, or 0
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message_at: string;
  last_msg?: string;
  time?: string;
  other_user_name?: string;
  other_user_avatar?: string;
  contact_name?: string;
  contact_avatar?: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  actor_id?: string;
  type: string;
  post_id?: string;
  comment_id?: string;
  text: string;
  is_read: boolean;
  isRead?: boolean; // Fallback
  created_at: string;
  time?: string; // Fallback
  color?: string; // For mock trends
  icon?: string; // For mock trends
  // Helper for UI
  user?: string;
  sub?: string;
}
