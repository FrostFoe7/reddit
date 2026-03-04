-- Seed Data for project-reddit-v2
-- Populates the schema with initial mock data from src/db/db.ts

DO $$
DECLARE
    u_user123 UUID;
    u_frontend_wizard UUID;
    u_design_guy UUID;
    u_react_ninja UUID;
    u_state_guru UUID;
    
    s_webdev UUID;
    s_ui_design UUID;
    s_javascript UUID;
    
    p1 UUID;
    p2 UUID;
    p3 UUID;
    
    c1 UUID;
BEGIN
    -- Insert Users
    INSERT INTO users (username, karma, avatar_url) VALUES 
    ('User123', 1200, 'https://api.dicebear.com/7.x/avataaars/svg?seed=User123') RETURNING id INTO u_user123;
    INSERT INTO users (username, karma, avatar_url) VALUES 
    ('frontend_wizard', 15400, 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend') RETURNING id INTO u_frontend_wizard;
    INSERT INTO users (username, karma, avatar_url) VALUES 
    ('design_guy', 8900, 'https://api.dicebear.com/7.x/avataaars/svg?seed=design') RETURNING id INTO u_design_guy;
    INSERT INTO users (username, karma, avatar_url) VALUES 
    ('react_ninja', 4500, 'https://api.dicebear.com/7.x/avataaars/svg?seed=ninja') RETURNING id INTO u_react_ninja;
    INSERT INTO users (username, karma, avatar_url) VALUES 
    ('state_guru', 22100, 'https://api.dicebear.com/7.x/avataaars/svg?seed=guru') RETURNING id INTO u_state_guru;

    -- Insert Subreddits
    INSERT INTO subreddits (name, description, icon_url, owner_id) VALUES 
    ('webdev', 'A community dedicated to all things web development.', 'bg-[#007aff]', u_frontend_wizard) RETURNING id INTO s_webdev;
    INSERT INTO subreddits (name, description, icon_url, owner_id) VALUES 
    ('UI_Design', 'Design, principles, and practice.', 'bg-[#ff4500]', u_design_guy) RETURNING id INTO s_ui_design;
    INSERT INTO subreddits (name, description, icon_url, owner_id) VALUES 
    ('javascript', 'All about JS!', 'bg-[#f7df1e]', u_state_guru) RETURNING id INTO s_javascript;

    -- Insert Posts
    INSERT INTO posts (subreddit_id, author_id, title, content, post_type) VALUES 
    (s_webdev, u_frontend_wizard, 'What''s the best way to handle complex UI state in 2026?', 'I''ve been using a mix of context and local state, but things are getting messy in my new dashboard project. Should I switch entirely to signals?', 'text') RETURNING id INTO p1;
    
    INSERT INTO posts (subreddit_id, author_id, title, image_url, post_type) VALUES 
    (s_ui_design, u_design_guy, 'I redesigned the Reddit UI with an iOS-inspired aesthetic. Thoughts?', 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800', 'image') RETURNING id INTO p2;
    
    INSERT INTO posts (subreddit_id, author_id, title, content, post_type) VALUES 
    (s_webdev, u_user123, 'Just launched my first portfolio!', 'Check it out and let me know what you think.', 'text') RETURNING id INTO p3;

    -- Insert Votes (Initial seed votes)
    INSERT INTO post_votes (user_id, post_id, vote) VALUES (u_state_guru, p1, 1);
    INSERT INTO post_votes (user_id, post_id, vote) VALUES (u_react_ninja, p1, 1);
    INSERT INTO post_votes (user_id, post_id, vote) VALUES (u_design_guy, p2, 1);

    -- Insert Comments
    INSERT INTO comments (post_id, author_id, content) VALUES 
    (p1, u_react_ninja, 'Signals are absolutely the way to go for this.') RETURNING id INTO c1;
    
    INSERT INTO comments (post_id, author_id, parent_id, content) VALUES 
    (p1, u_frontend_wizard, c1, 'Thanks! I was leaning towards that.');
    
    INSERT INTO comments (post_id, author_id, content) VALUES 
    (p1, u_user123, 'I still prefer Redux Toolkit for large apps.');

    -- Insert Notifications
    INSERT INTO notifications (recipient_id, actor_id, type, post_id, is_read) VALUES 
    (u_frontend_wizard, u_state_guru, 'reply', p1, false);

END $$;
