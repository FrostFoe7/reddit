-- Seed Data for project-reddit-v2
-- Populates the enhanced MySQL schema with a rich set of data
-- All IDs strictly follow the xxx-xxx-xxx (11 char) format

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE reports;
TRUNCATE messages;
TRUNCATE conversation_participants;
TRUNCATE conversations;
TRUNCATE notifications;
TRUNCATE post_drafts;
TRUNCATE saved_posts;
TRUNCATE user_blocks;
TRUNCATE user_follows;
TRUNCATE comment_votes;
TRUNCATE post_votes;
TRUNCATE comments;
TRUNCATE post_media;
TRUNCATE posts;
TRUNCATE subreddit_bans;
TRUNCATE subreddit_members;
TRUNCATE subreddit_rules;
TRUNCATE subreddits;
TRUNCATE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users (15 users)
INSERT INTO users (id, username, password_hash, karma, avatar_url, is_verified, bio, is_premium) VALUES 
('u01-usr-123', 'User123', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1200, 'https://api.dicebear.com/7.x/avataaars/svg?seed=User123', FALSE, 'Just a casual redditor', FALSE),
('u02-fro-wiz', 'frontend_wizard', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 15400, 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend', TRUE, 'Building the future of the web', TRUE),
('u03-des-guy', 'design_guy', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 8900, 'https://api.dicebear.com/7.x/avataaars/svg?seed=design', TRUE, 'Pixel perfectionist', FALSE),
('u04-rea-nin', 'react_ninja', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 4500, 'https://api.dicebear.com/7.x/avataaars/svg?seed=ninja', FALSE, 'I write code and eat pizza', FALSE),
('u05-sta-gur', 'state_guru', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 22100, 'https://api.dicebear.com/7.x/avataaars/svg?seed=guru', TRUE, 'Everything is a stream', TRUE),
('u06-cod-mon', 'code_monkey', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3200, 'https://api.dicebear.com/7.x/avataaars/svg?seed=monkey', FALSE, 'Will code for bananas', FALSE),
('u07-sys-adm', 'sysadmin_god', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 45000, 'https://api.dicebear.com/7.x/avataaars/svg?seed=sys', TRUE, 'Have you tried turning it off and on again?', TRUE),
('u08-dev-ops', 'devops_queen', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 12000, 'https://api.dicebear.com/7.x/avataaars/svg?seed=queen', TRUE, 'CI/CD is my love language', FALSE),
('u09-ios-fan', 'ios_fanatic', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 5600, 'https://api.dicebear.com/7.x/avataaars/svg?seed=ios', FALSE, 'Sent from my iPhone', FALSE),
('u10-and-roi', 'android_fan', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 4300, 'https://api.dicebear.com/7.x/avataaars/svg?seed=android', FALSE, 'Custom ROMs for life', FALSE),
('u11-js-lord', 'js_lord', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 88000, 'https://api.dicebear.com/7.x/avataaars/svg?seed=js', TRUE, 'Typescript is just JS with extra steps', TRUE),
('u12-rus-ace', 'rust_ace', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1500, 'https://api.dicebear.com/7.x/avataaars/svg?seed=rust', FALSE, 'Memory safety is important', FALSE),
('u13-vve-dev', 'vue_dev', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2900, 'https://api.dicebear.com/7.x/avataaars/svg?seed=vue', FALSE, 'Simplicity is beauty', FALSE),
('u14-nxt-gen', 'nextjs_pro', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 7700, 'https://api.dicebear.com/7.x/avataaars/svg?seed=next', TRUE, 'App router is the future', FALSE),
('u15-ai-hyp', 'ai_overlord', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 99000, 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai', TRUE, 'Prompt engineering is a real job', TRUE);

-- 2. Subreddits (10 communities)
INSERT INTO subreddits (id, name, description, icon_url, creator_id, owner_id, is_verified, wiki) VALUES 
('s01-web-dev', 'webdev', 'A community dedicated to all things web development.', 'bg-[#007aff]', 'u02-fro-wiz', 'u02-fro-wiz', TRUE, 'Welcome to the webdev wiki!'),
('s02-ui-des', 'UI_Design', 'Design, principles, and practice.', 'bg-[#ff4500]', 'u03-des-guy', 'u03-des-guy', TRUE, 'Principles of Good Design...'),
('s03-jav-scr', 'javascript', 'All about JS!', 'bg-[#f7df1e]', 'u05-sta-gur', 'u05-sta-gur', FALSE, NULL),
('s04-rea-ctj', 'reactjs', 'The React library for building user interfaces.', 'bg-[#61dafb]', 'u04-rea-nin', 'u04-rea-nin', TRUE, 'React Docs and Best Practices'),
('s05-pro-gra', 'programming', 'Computer Programming.', 'bg-[#333333]', 'u07-sys-adm', 'u07-sys-adm', TRUE, NULL),
('s06-tec-h01', 'technology', 'Everything tech related.', 'bg-[#000000]', 'u15-ai-hyp', 'u15-ai-hyp', TRUE, NULL),
('s07-fun-ny1', 'funny', 'The funniest sub on Reddit.', 'bg-[#ffcc00]', 'u01-usr-123', 'u01-usr-123', FALSE, NULL),
('s08-app-le1', 'apple', 'All things Apple.', 'bg-[#555555]', 'u09-ios-fan', 'u09-ios-fan', TRUE, NULL),
('s09-and-roi', 'android', 'Android News and Discussion.', 'bg-[#3ddc84]', 'u10-and-roi', 'u10-and-roi', TRUE, NULL),
('s10-rus-t01', 'rust', 'A safe, concurrent, practical language.', 'bg-[#dea584]', 'u12-rus-ace', 'u12-rus-ace', FALSE, NULL);

-- 3. Subreddit Rules
INSERT INTO subreddit_rules (id, subreddit_id, title, description, priority) VALUES 
('r01-w-01-01', 's01-web-dev', 'Be respectful', 'No harassment or personal attacks.', 1),
('r02-w-02-01', 's01-web-dev', 'No low-effort posts', 'Include code snippets or clear descriptions.', 2),
('r03-u-01-01', 's02-ui-des', 'Constructive criticism only', 'Explain why you like or dislike something.', 1),
('r04-r-01-01', 's04-rea-ctj', 'React related only', 'Posts must be about React or its ecosystem.', 1),
('r05-p-01-01', 's05-pro-gra', 'No memes', 'Keep it technical.', 1);

-- 4. Subreddit Memberships
INSERT INTO subreddit_members (user_id, subreddit_id, role) VALUES 
('u02-fro-wiz', 's01-web-dev', 'admin'),
('u04-rea-nin', 's01-web-dev', 'moderator'),
('u01-usr-123', 's01-web-dev', 'member'),
('u06-cod-mon', 's01-web-dev', 'member'),
('u03-des-guy', 's02-ui-des', 'admin'),
('u09-ios-fan', 's02-ui-des', 'member'),
('u05-sta-gur', 's03-jav-scr', 'admin'),
('u11-js-lord', 's03-jav-scr', 'moderator'),
('u04-rea-nin', 's04-rea-ctj', 'admin'),
('u02-fro-wiz', 's04-rea-ctj', 'moderator'),
('u07-sys-adm', 's05-pro-gra', 'admin'),
('u15-ai-hyp', 's06-tec-h01', 'admin'),
('u08-dev-ops', 's06-tec-h01', 'moderator');

-- 5. Social (Follows)
INSERT INTO user_follows (follower_id, followed_id) VALUES 
('u01-usr-123', 'u02-fro-wiz'),
('u04-rea-nin', 'u02-fro-wiz'),
('u06-cod-mon', 'u02-fro-wiz'),
('u02-fro-wiz', 'u05-sta-gur'),
('u03-des-guy', 'u09-ios-fan');

-- 6. Posts (15 posts)
INSERT INTO posts (id, subreddit_id, author_id, title, content, post_type, is_oc, is_nsfw) VALUES 
('p01-web-001', 's01-web-dev', 'u02-fro-wiz', 'What\'s the best way to handle complex UI state in 2026?', 'I\'ve been using a mix of context and local state, but things are getting messy. Should I switch to signals?', 'text', TRUE, FALSE),
('p02-ui-001', 's02-ui-des', 'u03-des-guy', 'I redesigned the Reddit UI with an iOS aesthetic. Thoughts?', NULL, 'image', TRUE, FALSE),
('p03-js-001', 's03-jav-scr', 'u11-js-lord', 'Proxy objects are underrated for state management.', 'Think about it: zero boilerplate, reactive by default.', 'text', FALSE, FALSE),
('p04-rea-001', 's04-rea-ctj', 'u04-rea-nin', 'React 20 is finally here! Summary of changes.', 'The compiler is now the default, and dependency arrays are gone.', 'text', FALSE, FALSE),
('p05-pro-001', 's05-pro-gra', 'u07-sys-adm', 'Why your server is slow and how to fix it.', 'Check your indexes and database connections first.', 'text', TRUE, FALSE),
('p06-tec-001', 's06-tec-h01', 'u15-ai-hyp', 'AI can now write full-stack apps in seconds.', 'It\'s over for us, or is it?', 'text', FALSE, FALSE),
('p07-app-001', 's08-app-le1', 'u09-ios-fan', 'iPhone 18 Pro Leaks: No more physical buttons?', 'The entire frame is touch-sensitive now.', 'link', FALSE, FALSE),
('p08-and-001', 's09-and-roi', 'u10-and-roi', 'Android 17: Return of the headphone jack?', 'Just kidding, but wouldn\'t it be nice?', 'text', FALSE, FALSE),
('p09-web-002', 's01-web-dev', 'u01-usr-123', 'My first portfolio built with React!', 'Please be kind, I\'ve been learning for 3 months.', 'text', TRUE, FALSE),
('p10-fun-001', 's07-fun-ny1', 'u06-cod-mon', 'When the production server goes down on a Friday.', NULL, 'image', FALSE, FALSE),
('p11-rus-001', 's10-rus-t01', 'u12-rus-ace', 'Rewriting my CSS parser in Rust.', 'It\'s 100x faster now.', 'text', TRUE, FALSE),
('p12-tec-002', 's06-tec-h01', 'u08-dev-ops', 'The state of Cloud Computing in 2026.', 'Serverless is everywhere.', 'text', FALSE, FALSE),
('p13-ui-002', 's02-ui-des', 'u03-des-guy', 'Color theory for developers.', 'Stop using pure black #000.', 'text', TRUE, FALSE),
('p14-js-002', 's03-jav-scr', 'u05-sta-gur', 'ES2026 features you should know.', 'Pattern matching is a game changer.', 'text', FALSE, FALSE),
('p15-rea-002', 's04-rea-ctj', 'u14-nxt-gen', 'Next.js vs Remix: The final showdown.', 'Which one wins for SEO?', 'text', FALSE, FALSE);

-- Update post images
UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800' WHERE id = 'p02-ui-001';
UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800' WHERE id = 'p10-fun-001';

-- 7. Comments (Lots of replies)
INSERT INTO comments (id, post_id, author_id, parent_id, content) VALUES 
('c01-p01-001', 'p01-web-001', 'u04-rea-nin', NULL, 'Signals are definitely easier to reason about for large states.'),
('c02-p01-001', 'p01-web-001', 'u02-fro-wiz', 'c01-p01-001', 'True, but the transition from hooks can be painful.'),
('c03-p01-001', 'p01-web-001', 'u05-sta-gur', 'c02-p01-001', 'There are migration tools now that make it 90% automatic.'),
('c04-p01-001', 'p01-web-001', 'u11-js-lord', NULL, 'I still prefer Redux Toolkit. It\'s predictable.'),
('c05-p02-001', 'p02-ui-001', 'u09-ios-fan', NULL, 'The blur effect on the navbar is perfect!'),
('c06-p02-001', 'p02-ui-001', 'u10-and-roi', NULL, 'A bit too much padding for my taste, but very clean.'),
('c07-p03-001', 'p03-js-001', 'u06-cod-mon', NULL, 'Wait, how do Proxies handle deeply nested objects?'),
('c08-p03-001', 'p03-js-001', 'u11-js-lord', 'c07-p03-001', 'You have to recursively wrap them, or use a library like Valtio.'),
('c09-p04-001', 'p04-rea-001', 'u14-nxt-gen', NULL, 'No more dependency arrays? Finally!'),
('c10-p06-001', 'p06-tec-001', 'u01-usr-123', NULL, 'I tried it, it hallucinated a whole database schema.');

-- 8. Votes
INSERT INTO post_votes (user_id, post_id, vote) VALUES 
('u01-usr-123', 'p01-web-001', 1),
('u04-rea-nin', 'p01-web-001', 1),
('u05-sta-gur', 'p01-web-001', 1),
('u06-cod-mon', 'p01-web-001', 1),
('u09-ios-fan', 'p02-ui-001', 1),
('u10-and-roi', 'p02-ui-001', -1),
('u11-js-lord', 'p03-js-001', 1),
('u15-ai-hyp', 'p06-tec-001', 1),
('u07-sys-adm', 'p05-pro-001', 1);

-- 9. Notifications
INSERT INTO notifications (id, recipient_id, actor_id, type, post_id, text, is_read) VALUES 
('n01-u02-wiz', 'u02-fro-wiz', 'u04-rea-nin', 'reply', 'p01-web-001', 'replied to your post', FALSE),
('n02-u02-wiz', 'u02-fro-wiz', 'u05-sta-gur', 'reply', 'p01-web-001', 'replied to your post', FALSE),
('n03-u03-des', 'u03-des-guy', 'u09-ios-fan', 'reply', 'p02-ui-001', 'loved your design!', TRUE),
('n04-u04-rea', 'u04-rea-nin', 'u14-nxt-gen', 'mention', 'p04-rea-001', 'mentioned you in a comment', FALSE);

-- 10. Conversations
INSERT INTO conversations (id, last_message_at) VALUES ('cnv-001-abc', NOW());
INSERT INTO conversation_participants (conversation_id, user_id) VALUES ('cnv-001-abc', 'u01-usr-123'), ('cnv-001-abc', 'u02-fro-wiz');
INSERT INTO messages (id, conversation_id, sender_id, content) VALUES 
('msg-001-001', 'cnv-001-abc', 'u01-usr-123', 'Hey, can you take a look at my portfolio?'),
('msg-002-001', 'cnv-001-abc', 'u02-fro-wiz', 'Sure! Just sent you a DM.');
