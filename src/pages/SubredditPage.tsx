import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostCard } from '@/components/post/PostCard';
import { mockPosts, mockCommunities } from '@/db/db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wrench } from 'lucide-react';
import { CommunityHeader } from '@/components/layout/CommunityHeader';

export const SubredditPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const sub = mockCommunities.find(c => c.id === name);
  const subPosts = mockPosts.filter(p => p.sub === name);

  if (!sub) {
    return (
      <div className="text-center py-24 px-4">
        <h1 className="text-[32px] sm:text-[40px] font-bold text-foreground tracking-tight mb-4">Community not found</h1>
        <Link to="/" className="inline-block bg-primary text-primary-foreground h-14 px-8 rounded-full font-bold text-[16px] leading-[56px] hover:opacity-80 transition-opacity shadow-sm">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div id="view-subreddit" className="view-section active">
      <CommunityHeader sub={sub} />
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 flex gap-8 mb-6 px-4 sm:px-0 overflow-x-auto no-scrollbar">
          <TabsTrigger value="posts" className="pb-3.5 pt-2 text-[16px] font-semibold data-[state=active]:text-foreground data-[state=active]:border-b-[3px] data-[state=active]:border-foreground rounded-none shadow-none bg-transparent border-b-[3px] border-transparent px-1 whitespace-nowrap">
            Posts
          </TabsTrigger>
          <TabsTrigger value="rules" className="pb-3.5 pt-2 text-[16px] font-semibold data-[state=active]:text-foreground data-[state=active]:border-b-[3px] data-[state=active]:border-foreground rounded-none shadow-none bg-transparent border-b-[3px] border-transparent px-1 whitespace-nowrap">
            Rules
          </TabsTrigger>
          <TabsTrigger value="wiki" className="pb-3.5 pt-2 text-[16px] font-semibold data-[state=active]:text-foreground data-[state=active]:border-b-[3px] data-[state=active]:border-foreground rounded-none shadow-none bg-transparent border-b-[3px] border-transparent px-1 whitespace-nowrap">
            Wiki
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0 space-y-2 sm:space-y-6">
          {subPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {subPosts.length === 0 && (
            <div className="text-center py-20 text-muted-foreground font-medium bg-card border border-border rounded-[24px]">
              No posts in this community yet.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rules" className="mt-0 px-4 sm:px-0">
          <div className="bg-card border sm:border border-border rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-2xl font-bold tracking-tight">Community Rules</h2>
            <ol className="list-decimal list-inside space-y-4 text-muted-foreground font-medium text-[16px]">
              <li className="pb-4 border-b border-border leading-relaxed">Be respectful to others. No harassment.</li>
              <li className="pb-4 border-b border-border leading-relaxed">No spam or self-promotion.</li>
              <li className="pb-4 border-b border-border leading-relaxed">Use the correct tags for posts.</li>
              <li className="leading-relaxed">Have fun and share knowledge!</li>
            </ol>
          </div>
        </TabsContent>
        
        <TabsContent value="wiki" className="mt-0 px-4 sm:px-0">
          <div className="bg-card border sm:border border-border rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-2xl font-bold tracking-tight">Wiki & Resources</h2>
            <p className="text-muted-foreground leading-relaxed text-[16px]">Welcome to the community wiki. Here you will find frequently asked questions, beginner guides, and helpful external links.</p>
            <div className="p-5 bg-muted rounded-[16px] text-[15px] font-medium mt-4 border border-border flex items-center gap-3">
              <Wrench size={24} className="text-muted-foreground" /> Currently under construction. Check back soon!
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
