-- Initial MySQL Schema for project-reddit-v2
-- Optimized for production and cPanel hosting environments (MySQL 5.7+ / 8.0+)
-- Using custom ID format: xxx-xxx-xxx (11 characters total)

-- npfo2xokhne8@sg2plzcpnl508569 [~/public_html/news.breachtimes.com]$ mysql --version
-- mysql  Ver 15.1 Distrib 10.6.24-MariaDB, for Linux (x86_64) using readline 5.1
-- npfo2xokhne8@sg2plzcpnl508569 [~/public_html/news.breachtimes.com]$

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversation_participants;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS post_drafts;
DROP TABLE IF EXISTS saved_posts;
DROP TABLE IF EXISTS user_blocks;
DROP TABLE IF EXISTS user_follows;
DROP TABLE IF EXISTS comment_votes;
DROP TABLE IF EXISTS post_votes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS post_media;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS subreddit_bans;
DROP TABLE IF EXISTS subreddit_members;
DROP TABLE IF EXISTS subreddit_rules;
DROP TABLE IF EXISTS subreddits;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- Users Table
CREATE TABLE users (
    id VARCHAR(11) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    banner_url TEXT,
    bio TEXT,
    karma INT DEFAULT 0,
    cake_day TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_premium BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    settings JSON,
    last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_username ON users (username);

-- Subreddits (Communities) Table
CREATE TABLE subreddits (
    id VARCHAR(11) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    banner_url TEXT,
    creator_id VARCHAR(11),
    owner_id VARCHAR(11),
    is_verified BOOLEAN DEFAULT FALSE,
    wiki TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_subreddits_name ON subreddits (name);
CREATE INDEX idx_subreddits_creator_id ON subreddits (creator_id);

-- Subreddit Rules
CREATE TABLE subreddit_rules (
    id VARCHAR(11) PRIMARY KEY,
    subreddit_id VARCHAR(11) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subreddit_id) REFERENCES subreddits(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subreddit Memberships & Moderation
CREATE TABLE subreddit_members (
    user_id VARCHAR(11) NOT NULL,
    subreddit_id VARCHAR(11) NOT NULL,
    role ENUM('member', 'moderator', 'admin') NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, subreddit_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subreddit_id) REFERENCES subreddits(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subreddit Bans
CREATE TABLE subreddit_bans (
    user_id VARCHAR(11) NOT NULL,
    subreddit_id VARCHAR(11) NOT NULL,
    banned_by VARCHAR(11),
    reason TEXT,
    banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, subreddit_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subreddit_id) REFERENCES subreddits(id) ON DELETE CASCADE,
    FOREIGN KEY (banned_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Posts Table
CREATE TABLE posts (
    id VARCHAR(11) PRIMARY KEY,
    subreddit_id VARCHAR(11) NOT NULL,
    author_id VARCHAR(11) NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    image_url TEXT,
    link_url TEXT,
    post_type ENUM('text', 'image', 'link', 'poll') NOT NULL DEFAULT 'text',
    is_oc BOOLEAN DEFAULT FALSE,
    is_spoiler BOOLEAN DEFAULT FALSE,
    is_nsfw BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subreddit_id) REFERENCES subreddits(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FULLTEXT INDEX idx_posts_search (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_posts_subreddit_id ON posts (subreddit_id);
CREATE INDEX idx_posts_author_id ON posts (author_id);
CREATE INDEX idx_posts_created_at ON posts (created_at DESC);

-- Post Media
CREATE TABLE post_media (
    id VARCHAR(11) PRIMARY KEY,
    post_id VARCHAR(11) NOT NULL,
    media_url TEXT NOT NULL,
    media_type VARCHAR(50) DEFAULT 'image',
    priority INT DEFAULT 0,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments Table
CREATE TABLE comments (
    id VARCHAR(11) PRIMARY KEY,
    post_id VARCHAR(11) NOT NULL,
    author_id VARCHAR(11) NOT NULL,
    parent_id VARCHAR(11),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_comments_post_id ON comments (post_id);
CREATE INDEX idx_comments_author_id ON comments (author_id);
CREATE INDEX idx_comments_parent_id ON comments (parent_id);

-- Post Votes
CREATE TABLE post_votes (
    user_id VARCHAR(11) NOT NULL,
    post_id VARCHAR(11) NOT NULL,
    vote TINYINT NOT NULL CHECK (vote IN (1, -1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comment Votes
CREATE TABLE comment_votes (
    user_id VARCHAR(11) NOT NULL,
    comment_id VARCHAR(11) NOT NULL,
    vote TINYINT NOT NULL CHECK (vote IN (1, -1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, comment_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Social: Follows & Blocks
CREATE TABLE user_follows (
    follower_id VARCHAR(11) NOT NULL,
    followed_id VARCHAR(11) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, followed_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_blocks (
    blocker_id VARCHAR(11) NOT NULL,
    blocked_id VARCHAR(11) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blocker_id, blocked_id),
    FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Saved Posts
CREATE TABLE saved_posts (
    user_id VARCHAR(11) NOT NULL,
    post_id VARCHAR(11) NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Post Drafts
CREATE TABLE post_drafts (
    id VARCHAR(11) PRIMARY KEY,
    user_id VARCHAR(11) NOT NULL,
    subreddit_id VARCHAR(11),
    title VARCHAR(500),
    content TEXT,
    post_type VARCHAR(50) DEFAULT 'text',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subreddit_id) REFERENCES subreddits(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications Table
CREATE TABLE notifications (
    id VARCHAR(11) PRIMARY KEY,
    recipient_id VARCHAR(11) NOT NULL,
    actor_id VARCHAR(11),
    type VARCHAR(50) NOT NULL,
    post_id VARCHAR(11),
    comment_id VARCHAR(11),
    text TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_notifications_recipient_id ON notifications (recipient_id);

-- Conversations & Messaging
CREATE TABLE conversations (
    id VARCHAR(11) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE conversation_participants (
    conversation_id VARCHAR(11) NOT NULL,
    user_id VARCHAR(11) NOT NULL,
    last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE messages (
    id VARCHAR(11) PRIMARY KEY,
    conversation_id VARCHAR(11) NOT NULL,
    sender_id VARCHAR(11) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reporting System
CREATE TABLE reports (
    id VARCHAR(11) PRIMARY KEY,
    reporter_id VARCHAR(11),
    target_type ENUM('user', 'post', 'comment', 'subreddit') NOT NULL,
    target_id VARCHAR(11) NOT NULL,
    reason TEXT,
    status ENUM('pending', 'reviewed', 'dismissed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Useful Views
DROP VIEW IF EXISTS post_details;
CREATE VIEW post_details AS
SELECT 
    p.*,
    u.username as author_username,
    u.avatar_url as author_avatar,
    u.is_verified as author_is_verified,
    s.name as subreddit_name,
    s.icon_url as subreddit_icon,
    s.is_verified as subreddit_is_verified,
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

DROP VIEW IF EXISTS comment_details;
CREATE VIEW comment_details AS
SELECT 
    c.*,
    u.username as author_username,
    u.avatar_url as author_avatar,
    u.is_verified as author_is_verified,
    COALESCE(v.upvotes, 0) as upvotes
FROM comments c
JOIN users u ON c.author_id = u.id
LEFT JOIN (
    SELECT comment_id, SUM(vote) as upvotes 
    FROM comment_votes GROUP BY comment_id
) v ON c.id = v.comment_id;
