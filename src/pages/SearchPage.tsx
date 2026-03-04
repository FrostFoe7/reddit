import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePosts, useCommunities } from '@/hooks';
import { PostCard } from '@/components/post/PostCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const qLower = query.toLowerCase();

  const { data: posts = [] } = usePosts();
  const { data: communities = [] } = useCommunities();

  const filteredPosts = posts.filter((p: Post) => 
    p.title.toLowerCase().includes(qLower) || 
    (p.subreddit_name || p.sub || '').toLowerCase().includes(qLower) ||
    (p.content || '').toLowerCase().includes(qLower)
  );

  const filteredCommunities = communities.filter((c: Community) => 
    c.name.toLowerCase().includes(qLower) || 
    (c.description || c.desc || '').toLowerCase().includes(qLower)
  );

  return (
    <div id="view-search" className="view-section active animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="px-4 sm:px-0 mb-6">
        <h1 className="text-[24px] sm:text-[32px] font-bold text-foreground tracking-tight mb-5">
          Results for <span className="text-primary">"{query}"</span>
        </h1>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          <Button variant="ghost" className="px-6 py-2 bg-foreground text-background rounded-full text-[14px] font-bold shadow-md">
            Posts
          </Button>
          <Button variant="ghost" className="px-6 py-2 bg-muted text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-[14px] font-bold whitespace-nowrap transition-all active:scale-95">
            Communities
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {filteredCommunities.length > 0 && (
          <div className="bg-card border-y sm:border border-border sm:rounded-[24px] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-muted/20">
              <h3 className="font-bold text-foreground text-[15px] uppercase tracking-widest opacity-70">Communities</h3>
            </div>
            <div className="divide-y divide-border/50">
              {filteredCommunities.map(community => (
                <Link 
                  key={community.id} 
                  to={`/r/${community.id}`}
                  className="flex items-center justify-between p-4 sm:p-5 hover:bg-muted/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[18px] shadow-sm tracking-tighter transition-transform group-hover:scale-110", community.icon_url || community.icon)}>r/</div>
                    <div className="flex flex-col">
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors text-[16px]">r/{community.name}</div>
                      <div className="text-[13px] text-muted-foreground font-medium">{community.members || 0} members</div>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-full h-9 px-6 font-bold border-primary text-primary hover:bg-primary/5 shadow-sm transition-all active:scale-95">Join</Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div id="search-results-container" className="flex flex-col gap-1 sm:gap-4">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {filteredPosts.length === 0 && filteredCommunities.length === 0 && (
            <div className="p-16 text-center text-muted-foreground font-medium bg-card rounded-[24px] border border-border shadow-sm flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 opacity-40">
                   <circle cx="11" cy="11" r="8" />
                   <line x1="21" y1="21" x2="16.65" y2="16.65" />
                 </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[18px] font-bold text-foreground">No results found for "{query}"</h3>
                <p className="text-[14px]">Try searching for something else or check your spelling.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
