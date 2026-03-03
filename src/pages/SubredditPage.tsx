import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostCard } from '@/components/post/PostCard';
import { mockPosts, mockCommunities } from '@/db/db';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SubredditPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const sub = mockCommunities.find(c => c.id === name);
  const subPosts = mockPosts.filter(p => p.sub === name);

  if (!sub) {
    return (
      <div className="text-center py-24 px-4">
        <h1 className="text-[32px] sm:text-[40px] font-bold text-text-primary tracking-tight mb-4">Community not found</h1>
        <Link to="/" className="inline-block bg-text-primary text-bg-primary h-14 px-8 rounded-full font-bold text-[16px] leading-[56px] hover:opacity-80 transition-opacity shadow-sm">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div id="view-subreddit" className="view-section active">
      <div className="bg-card border-b sm:border border-border-subtle sm:rounded-[32px] overflow-hidden mb-6 -mt-2 sm:mt-0 shadow-sm relative">
        <div className={cn("h-28 sm:h-36 opacity-90 relative", sub.icon)}>
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full text-white backdrop-blur-xl transition-colors shadow-sm">
          <MoreHorizontal size={22} />
        </Button>
        <div className="px-5 sm:px-8 pb-8 relative">
          <div className="flex justify-between items-end mb-4">
            <div className={cn("w-[88px] h-[88px] sm:w-[104px] sm:h-[104px] rounded-full border-4 border-card flex items-center justify-center text-white text-[32px] font-bold -mt-[44px] sm:-mt-[52px] relative shadow-md tracking-tighter", sub.icon)}>
              r/
            </div>
            <Button className="bg-text-primary text-bg-primary h-11 px-6 rounded-full font-bold text-[15px] shadow-sm">
              Join
            </Button>
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-text-primary leading-tight tracking-tight mb-1">r/{sub.name}</h1>
          <p className="text-[15px] text-text-secondary font-medium mb-4">r/{sub.name} • {sub.members} Members</p>
          <p className="text-[16px] text-text-primary leading-relaxed max-w-2xl font-medium">{sub.desc}</p>
        </div>
      </div>
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="bg-transparent border-b border-border-subtle rounded-none h-auto p-0 flex gap-8 mb-6 px-4 sm:px-0 overflow-x-auto no-scrollbar">
          <TabsTrigger value="posts" className="pb-3.5 pt-2 text-[16px] font-semibold data-[state=active]:text-text-primary data-[state=active]:border-b-[3px] data-[state=active]:border-text-primary rounded-none shadow-none bg-transparent border-b-[3px] border-transparent px-1 whitespace-nowrap">
            Posts
          </TabsTrigger>
          <TabsTrigger value="rules" className="pb-3.5 pt-2 text-[16px] font-semibold data-[state=active]:text-text-primary data-[state=active]:border-b-[3px] data-[state=active]:border-text-primary rounded-none shadow-none bg-transparent border-b-[3px] border-transparent px-1 whitespace-nowrap">
            Rules
          </TabsTrigger>
          <TabsTrigger value="wiki" className="pb-3.5 pt-2 text-[16px] font-semibold data-[state=active]:text-text-primary data-[state=active]:border-b-[3px] data-[state=active]:border-text-primary rounded-none shadow-none bg-transparent border-b-[3px] border-transparent px-1 whitespace-nowrap">
            Wiki
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0 space-y-2 sm:space-y-6">
          {subPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {subPosts.length === 0 && (
            <div className="text-center py-20 text-text-secondary font-medium bg-card border border-border-subtle rounded-[24px]">
              No posts in this community yet.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rules" className="mt-0 px-4 sm:px-0">
          <div className="bg-card border sm:border border-border-subtle rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-2xl font-bold tracking-tight">Community Rules</h2>
            <ol className="list-decimal list-inside space-y-4 text-text-secondary font-medium text-[16px]">
              <li className="pb-4 border-b border-border-subtle leading-relaxed">Be respectful to others. No harassment.</li>
              <li className="pb-4 border-b border-border-subtle leading-relaxed">No spam or self-promotion.</li>
              <li className="pb-4 border-b border-border-subtle leading-relaxed">Use the correct tags for posts.</li>
              <li className="leading-relaxed">Have fun and share knowledge!</li>
            </ol>
          </div>
        </TabsContent>
        
        <TabsContent value="wiki" className="mt-0 px-4 sm:px-0">
          <div className="bg-card border sm:border border-border-subtle rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-2xl font-bold tracking-tight">Wiki & Resources</h2>
            <p className="text-text-secondary leading-relaxed text-[16px]">Welcome to the community wiki. Here you will find frequently asked questions, beginner guides, and helpful external links.</p>
            <div className="p-5 bg-hover rounded-[16px] text-[15px] font-medium mt-4 border border-border-subtle flex items-center gap-3">
              <Wrench size={24} className="text-text-secondary" /> Currently under construction. Check back soon!
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
