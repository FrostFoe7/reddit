-- Initial PostgreSQL Schema for project-reddit-v2
-- Optimized for production and cPanel hosting environments

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    avatar_url TEXT,
    karma INTEGER DEFAULT 0,
    cake_day TIMESTAMPTZ DEFAULT now(),
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_username_lower ON users (LOWER(username));

-- Subreddits (Communities) Table
CREATE TABLE subreddits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    banner_url TEXT,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subreddits_name_lower ON subreddits (LOWER(name));

-- Subreddit Memberships (Subscriptions)
CREATE TABLE subreddit_members (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subreddit_id UUID REFERENCES subreddits(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, subreddit_id)
);

-- Posts Table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subreddit_id UUID NOT NULL REFERENCES subreddits(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    link_url TEXT,
    post_type TEXT NOT NULL DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'link')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_posts_subreddit_id ON posts (subreddit_id);
CREATE INDEX idx_posts_author_id ON posts (author_id);
CREATE INDEX idx_posts_created_at ON posts (created_at DESC);

-- Comments Table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_comments_post_id ON comments (post_id);
CREATE INDEX idx_comments_author_id ON comments (author_id);
CREATE INDEX idx_comments_parent_id ON comments (parent_id);

-- Post Votes
CREATE TABLE post_votes (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    vote SMALLINT NOT NULL CHECK (vote IN (1, -1)),
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, post_id)
);

-- Comment Votes
CREATE TABLE comment_votes (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    vote SMALLINT NOT NULL CHECK (vote IN (1, -1)),
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, comment_id)
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type TEXT NOT NULL, -- e.g., 'reply', 'upvote', 'mention'
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_recipient_id ON notifications (recipient_id);
CREATE INDEX idx_notifications_created_at ON notifications (created_at DESC);

-- Direct Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_sender_id ON messages (sender_id);
CREATE INDEX idx_messages_receiver_id ON messages (receiver_id);
CREATE INDEX idx_messages_created_at ON messages (created_at DESC);

-- Useful Views for counts (denormalization alternative)

CREATE VIEW post_details AS
SELECT 
    p.*,
    u.username as author_username,
    u.avatar_url as author_avatar,
    s.name as subreddit_name,
    s.icon_url as subreddit_icon,
    COALESCE(v.upvotes, 0) as upvotes,
    COALESCE(c.comment_count, 0) as comment_count
FROM posts p
JOIN users u ON p.author_id = u.id
JOIN subreddits s ON p.subreddit_id = s.id
LEFT JOIN (
    SELECT post_id, SUM(vote) as upvotes 
    FROM post_votes GROUP BY post_id
) v ON p.id = v.post_id
LEFT JOIN (
    SELECT post_id, COUNT(*) as comment_count 
    FROM comments GROUP BY post_id
) c ON p.id = c.post_id;

CREATE VIEW comment_details AS
SELECT 
    c.*,
    u.username as author_username,
    u.avatar_url as author_avatar,
    COALESCE(v.upvotes, 0) as upvotes
FROM comments c
JOIN users u ON c.author_id = u.id
LEFT JOIN (
    SELECT comment_id, SUM(vote) as upvotes 
    FROM comment_votes GROUP BY comment_id
) v ON c.id = v.comment_id;
