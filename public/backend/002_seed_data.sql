-- Seed Data for project-reddit-v2
-- Populates the enhanced MySQL schema with custom format IDs (xxx-xxx-xxx)

-- Insert Users
SET @u_user123 = '1bw-j2k-e39';
SET @u_frontend_wizard = 'a7f-p9q-m2l';
SET @u_design_guy = 'd3h-k5v-r8t';
SET @u_react_ninja = 'n4x-c2z-b6y';
SET @u_state_guru = 'g9m-w1n-s0k';

INSERT INTO users (id, username, karma, avatar_url, is_verified, bio) VALUES 
(@u_user123, 'User123', 1200, 'https://api.dicebear.com/7.x/avataaars/svg?seed=User123', FALSE, 'Just a casual redditor'),
(@u_frontend_wizard, 'frontend_wizard', 15400, 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend', TRUE, 'Building the future of the web'),
(@u_design_guy, 'design_guy', 8900, 'https://api.dicebear.com/7.x/avataaars/svg?seed=design', TRUE, 'Pixel perfectionist'),
(@u_react_ninja, 'react_ninja', 4500, 'https://api.dicebear.com/7.x/avataaars/svg?seed=ninja', FALSE, 'I write code and eat pizza'),
(@u_state_guru, 'state_guru', 22100, 'https://api.dicebear.com/7.x/avataaars/svg?seed=guru', TRUE, 'Everything is a stream');

-- Insert Subreddits
SET @s_webdev = 'w1b-d3v-f00';
SET @s_ui_design = 'u1i-d3s-g7n';
SET @s_javascript = 'j4v-s0c-r9p';

INSERT INTO subreddits (id, name, description, icon_url, owner_id, is_verified, wiki) VALUES 
(@s_webdev, 'webdev', 'A community dedicated to all things web development.', 'bg-[#007aff]', @u_frontend_wizard, TRUE, 'Welcome to the webdev wiki!'),
(@s_ui_design, 'UI_Design', 'Design, principles, and practice.', 'bg-[#ff4500]', @u_design_guy, TRUE, NULL),
(@s_javascript, 'javascript', 'All about JS!', 'bg-[#f7df1e]', @u_state_guru, FALSE, NULL);

-- Subreddit Rules (Generating unique IDs for rules)
INSERT INTO subreddit_rules (id, subreddit_id, title, description, priority) VALUES 
('r1a-b2c-d3e', @s_webdev, 'Be respectful', 'No harassment or personal attacks.', 1),
('r2f-g3h-i4j', @s_webdev, 'No spam', 'Do not promote your products without value.', 2),
('r3k-l4m-n5o', @s_ui_design, 'Constructive criticism only', 'Always explain why you like/dislike a design.', 1);

-- Subreddit Memberships
INSERT INTO subreddit_members (user_id, subreddit_id, role) VALUES 
(@u_frontend_wizard, @s_webdev, 'admin'),
(@u_design_guy, @s_ui_design, 'admin'),
(@u_state_guru, @s_javascript, 'admin'),
(@u_react_ninja, @s_webdev, 'moderator'),
(@u_user123, @s_webdev, 'member');

-- Social
INSERT INTO user_follows (follower_id, followed_id) VALUES 
(@u_user123, @u_frontend_wizard),
(@u_react_ninja, @u_frontend_wizard);

-- Insert Posts
SET @p1 = 'p01-s7t-a9u';
SET @p2 = 'p02-i8m-g3v';
SET @p3 = 'p03-u4l-t2w';

INSERT INTO posts (id, subreddit_id, author_id, title, content, post_type, is_oc) VALUES 
(@p1, @s_webdev, @u_frontend_wizard, 'What\'s the best way to handle complex UI state in 2026?', 'I\'ve been using a mix of context and local state, but things are getting messy. Signals?', 'text', TRUE),
(@p2, @s_ui_design, @u_design_guy, 'I redesigned the Reddit UI with an iOS aesthetic. Thoughts?', NULL, 'image', FALSE),
(@p3, @s_webdev, @u_user123, 'Just launched my first portfolio!', 'Check it out and let me know what you think.', 'text', FALSE);

-- Update post 2 with image
UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800' WHERE id = @p2;

-- Post Media for p2
INSERT INTO post_media (id, post_id, media_url, priority) VALUES 
('m01-i2m-g3a', @p2, 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800', 1);

-- Insert Votes
INSERT INTO post_votes (user_id, post_id, vote) VALUES 
(@u_state_guru, @p1, 1),
(@u_react_ninja, @p1, 1);

-- Insert Comments
SET @c1 = 'c01-m9m-n3t';
INSERT INTO comments (id, post_id, author_id, content) VALUES 
(@c1, @p1, @u_react_ninja, 'Signals are absolutely the way to go for this.');

INSERT INTO comments (id, post_id, author_id, parent_id, content) VALUES 
('c02-r4p-y7l', @p1, @u_frontend_wizard, @c1, 'Thanks! I was leaning towards that.');

-- Messaging
SET @conv1 = 'v01-c3o-n8v';
INSERT INTO conversations (id, last_message_at) VALUES (@conv1, NOW());
INSERT INTO conversation_participants (conversation_id, user_id) VALUES (@conv1, @u_user123), (@conv1, @u_frontend_wizard);
INSERT INTO messages (id, conversation_id, sender_id, content) VALUES ('msg-101-abc', @conv1, @u_user123, 'Hey, love the new post on signals!');

-- Notifications
INSERT INTO notifications (id, recipient_id, actor_id, type, post_id) VALUES 
('ntf-202-xyz', @u_frontend_wizard, @u_react_ninja, 'reply', @p1);
