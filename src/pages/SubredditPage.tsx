import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCommunity, usePosts } from '@/hooks';
import { PostCard } from '@/components/post/PostCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Wrench, ShieldCheck } from 'lucide-react';
import { CommunityHeader } from '@/components/layout/CommunityHeader';

export const SubredditPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  
  const { data: sub, isLoading: subLoading } = useCommunity(name);
  const { data: allPosts = [] } = usePosts();
  
  const subPosts = allPosts.filter((p: Post) => (p.subreddit_name || p.sub) === name);

  if (subLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-muted-foreground">
             <circle cx="12" cy="12" r="10" />
             <line x1="12" y1="8" x2="12" y2="12" />
             <line x1="12" y1="16" x2="12.01" y2="16" />
           </svg>
        </div>
        <h1 className="text-[28px] font-bold text-foreground tracking-tight mb-3">Community not found</h1>
        <p className="text-[16px] text-muted-foreground font-medium mb-10 max-w-[280px]">This community may have been banned or the name is incorrect.</p>
        <Link to="/" className="bg-primary text-primary-foreground h-12 px-10 rounded-full font-bold text-[15px] flex items-center shadow-md hover:opacity-90 transition-all active:scale-95">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div id="view-subreddit" className="view-section active animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CommunityHeader sub={sub} />
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList variant="line" className="px-4 sm:px-0 gap-6 sm:gap-10 mb-6 overflow-x-auto no-scrollbar justify-start">
          {['posts', 'rules', 'wiki'].map((tab) => (
            <TabsTrigger 
              key={tab}
              value={tab} 
              className="font-bold text-[15px] sm:text-[16px] capitalize"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="posts" className="mt-0 space-y-2 sm:space-y-6">
          {subPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {subPosts.length === 0 && (
            <div className="p-16 text-center text-muted-foreground font-medium bg-card rounded-[24px] border border-border shadow-sm">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <Wrench size={32} className="opacity-40" />
              </div>
              <h3 className="text-[18px] font-bold text-foreground mb-1">No posts yet</h3>
              <p className="text-[14px]">Be the first to post in r/{sub.name}!</p>
              <Button className="mt-6 rounded-full px-8 font-bold bg-primary text-primary-foreground shadow-sm">
                Create Post
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rules" className="mt-0 px-0">
          <div className="bg-card border-y sm:border border-border sm:rounded-[24px] p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck size={28} className="text-primary" />
              <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight">Community Rules</h2>
            </div>
            <div className="space-y-1">
              {[
                { title: "Be respectful to others", desc: "No harassment, hate speech, or personal attacks. We aim to keep this community a safe space for everyone." },
                { title: "No spam or self-promotion", desc: "Do not post repetitive content or links to your own products without significant context or value." },
                { title: "Use the correct tags", desc: "Always flair your posts correctly to help users filter content effectively." },
                { title: "Have fun and share knowledge!", desc: "The primary goal is to learn from each other and have a great time!" }
              ].map((rule, i) => (
                <div key={i} className="py-5 border-b border-border/50 last:border-0 flex gap-4 sm:gap-6 group transition-colors hover:bg-muted/30 -mx-6 px-6">
                   <span className="text-[18px] font-black text-muted-foreground/30 mt-0.5 group-hover:text-primary/30 transition-colors">{i + 1}</span>
                   <div className="flex flex-col gap-1">
                     <h3 className="font-bold text-[17px] text-foreground">{rule.title}</h3>
                     <p className="text-muted-foreground text-[15px] leading-relaxed font-medium">{rule.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="wiki" className="mt-0 px-0">
          <div className="bg-card border-y sm:border border-border sm:rounded-[24px] p-8 sm:p-12 shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 text-muted-foreground shadow-inner">
               <Wrench size={40} className="animate-pulse" />
            </div>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight mb-3">Wiki under construction</h2>
            <p className="text-muted-foreground leading-relaxed text-[16px] max-w-md font-medium">Welcome to the community wiki. Our moderators are currently working on compiling the best resources and FAQs for you.</p>
            <div className="p-4 bg-primary/5 rounded-[16px] text-[14px] font-bold text-primary mt-8 border border-primary/10 flex items-center gap-2">
               Check back soon for updates!
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
