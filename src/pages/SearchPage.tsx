import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { PostCard } from '@/components/post/PostCard';
import { mockPosts, mockCommunities } from '@/db/db';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const qLower = query.toLowerCase();

  const filteredPosts = mockPosts.filter(p => 
    p.title.toLowerCase().includes(qLower) || 
    p.sub.toLowerCase().includes(qLower) ||
    p.content?.toLowerCase().includes(qLower)
  );

  const filteredCommunities = mockCommunities.filter(c => 
    c.name.toLowerCase().includes(qLower) || 
    c.desc.toLowerCase().includes(qLower)
  );

  return (
    <div id="view-search" className="view-section active">
      <div className="px-4 sm:px-0 mb-6">
        <h1 className="text-[28px] sm:text-[32px] font-bold text-foreground tracking-tight mb-5">
          Results for "{query}"
        </h1>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <Button variant="ghost" className="px-5 py-2.5 bg-foreground text-background rounded-full text-[15px] font-semibold">
            Posts
          </Button>
          <Button variant="ghost" className="px-5 py-2.5 bg-muted text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-[15px] font-semibold whitespace-nowrap transition-colors">
            Communities
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredCommunities.length > 0 && (
          <div className="bg-card border-y sm:border border-border sm:rounded-[24px] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground">Communities</h3>
            </div>
            <div className="divide-y divide-border">
              {filteredCommunities.map(community => (
                <Link 
                  key={community.id} 
                  to={`/r/${community.id}`}
                  className="flex items-center justify-between p-4 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${community.icon} flex items-center justify-center text-white font-bold`}>r/</div>
                    <div>
                      <div className="font-bold text-foreground">r/{community.name}</div>
                      <div className="text-sm text-muted-foreground">{community.members} members</div>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-full h-8 px-4 font-bold border-primary text-primary hover:bg-primary/5">Join</Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div id="search-results-container" className="space-y-2 sm:space-y-6">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          {filteredPosts.length === 0 && filteredCommunities.length === 0 && (
            <div className="p-10 text-center text-muted-foreground font-medium bg-card rounded-[24px] border border-border shadow-sm">
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
