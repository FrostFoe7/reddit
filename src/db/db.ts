export interface Community {
  id: string;
  name: string;
  icon: string;
  members: string;
  desc: string;
}

export interface Post {
  id: string;
  sub: string;
  subIcon: string;
  author: string;
  title: string;
  content?: string;
  image?: string;
  upvotes: number;
  comments: number;
  time: string;
  type: 'text' | 'image';
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  avatar: string;
  content: string;
  upvotes: number;
  time: string;
  isOp: boolean;
  parentId?: string;
}

export interface Notification {
  id: string;
  type: 'reply' | 'trend';
  user?: string;
  sub: string;
  text: string;
  time: string;
  icon: string;
  color: string;
  isRead: boolean;
}

export interface Profile {
  id: string;
  name: string;
  karma: string;
  avatar: string;
}

export const mockCommunities: Community[] = [
  { id: 'webdev', name: 'webdev', icon: 'bg-[#007aff]', members: '1.8M', desc: 'A community dedicated to all things web development.' },
  { id: 'UI_Design', name: 'UI_Design', icon: 'bg-[#ff4500]', members: '350k', desc: 'Design, principles, and practice.' },
  { id: 'javascript', name: 'javascript', icon: 'bg-[#f7df1e]', members: '2.1M', desc: 'All about JS!' }
];

export const mockProfiles: Profile[] = [
  { id: 'User123', name: 'User123', karma: '1.2k', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User123' },
  { id: 'frontend_wizard', name: 'frontend_wizard', karma: '15.4k', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend' },
  { id: 'design_guy', name: 'design_guy', karma: '8.9k', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design' },
  { id: 'react_ninja', name: 'react_ninja', karma: '4.5k', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ninja' },
  { id: 'state_guru', name: 'state_guru', karma: '22.1k', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guru' }
];

export const mockPosts: Post[] = [
  { id: '1', sub: 'webdev', subIcon: 'bg-[#007aff]', author: 'frontend_wizard', title: "What's the best way to handle complex UI state in 2026?", content: "I've been using a mix of context and local state, but things are getting messy in my new dashboard project. Should I switch entirely to signals?", upvotes: 24500, comments: 1200, time: '4h ago', type: 'text' },
  { id: '2', sub: 'UI_Design', subIcon: 'bg-[#ff4500]', author: 'design_guy', title: "I redesigned the Reddit UI with an iOS-inspired aesthetic. Thoughts?", image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=800", upvotes: 8900, comments: 452, time: '6h ago', type: 'image' },
  { id: '3', sub: 'webdev', subIcon: 'bg-[#007aff]', author: 'User123', title: "Just launched my first portfolio!", content: "Check it out and let me know what you think.", upvotes: 450, comments: 23, time: '1d ago', type: 'text' }
];

export const mockComments: Comment[] = [
  { id: 'c1', postId: '1', author: 'react_ninja', avatar: 'John', content: 'Signals are absolutely the way to go for this.', upvotes: 3400, time: '3h ago', isOp: false },
  { id: 'c2', postId: '1', author: 'frontend_wizard', avatar: 'Alex', content: 'Thanks! I was leaning towards that.', upvotes: 412, time: '1h ago', isOp: true, parentId: 'c1' },
  { id: 'c3', postId: '1', author: 'User123', avatar: 'Felix', content: 'I still prefer Redux Toolkit for large apps.', upvotes: 120, time: '2h ago', isOp: false }
];

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'reply', user: 'state_guru', sub: 'webdev', text: 'Did you build your own signals implementation?', time: '2h ago', icon: 'ph-chat-teardrop', color: 'bg-[#34c759]', isRead: false },
  { id: 'n2', type: 'trend', sub: 'UI_Design', text: 'I redesigned the Reddit UI with an iOS-inspired aesthetic.', time: '5h ago', icon: 'ph-trend-up', color: 'bg-[#ff4500]', isRead: true }
];
