import React from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { PostCard } from '@/components/post/PostCard';
import { mockPosts, mockComments } from '@/db/db';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, MessageSquare } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'posts';

  const userPosts = mockPosts.filter(p => p.author === username);
  const userComments = mockComments.filter(c => c.author === username);

  return (
    <div id="view-profile" className="view-section active">
      <div className="bg-card border-b sm:border border-border-subtle sm:rounded-[32px] overflow-hidden mb-6 -mt-2 sm:mt-0 relative shadow-sm">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-orange-400 to-red-500 relative">
           <Button variant="ghost" size="icon" className="absolute top-4 right-4 w-11 h-11 bg-black/30 hover:bg-black/50 rounded-full text-white backdrop-blur-xl shadow-sm">
            <MoreHorizontal size={22} />
           </Button>
        </div>
        <div className="px-5 sm:px-8 pb-8 relative flex flex-col items-center sm:items-start text-center sm:text-left">
          <Avatar className="w-[104px] h-[104px] sm:w-[120px] sm:h-[120px] border-4 border-card -mt-[52px] sm:-mt-[60px] shadow-md mb-4">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=ff4500`} />
            <AvatarFallback>{username?.[0]}</AvatarFallback>
          </Avatar>
          <h1 className="text-[28px] sm:text-[32px] font-bold text-text-primary leading-tight tracking-tight mb-1">{username}</h1>
          <p className="text-[15px] text-text-secondary font-medium mb-5">u/{username} • <span className="text-reddit-orange">Premium</span></p>
          <div className="flex gap-8 text-[15px] justify-center sm:justify-start w-full">
            <div className="flex flex-col">
              <span className="font-bold text-text-primary text-[18px]">1,245</span> 
              <span className="text-text-secondary text-[13px] uppercase tracking-wider font-semibold">Karma</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-text-primary text-[18px]">Aug 12, 2023</span> 
              <span className="text-text-secondary text-[13px] uppercase tracking-wider font-semibold">Cake day</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="bg-transparent border-b border-border-subtle rounded-none h-auto p-0 flex gap-8 mb-6 px-4 sm:px-0 overflow-x-auto no-scrollbar">
          <TabsTrigger value="posts" className="pb-3.5 pt-2 text-[16px] font-semibold data-[state=active]:text-text-primary data-[state=active]:border-b-[3px] data-[state=active]:border-text-primary rounded-none shadow-none bg-transparent border-b-[3px] border-transparent px-1 whitespace-nowrap">
            Posts
          </TabsTrigger>
          <TabsTrigger value="comments" className="pb-3.5 pt-2 text-[16px] font-semibold data-[state=active]:text-text-primary data-[state=active]:border-b-[3px] data-[state=active]:border-text-primary rounded-none shadow-none bg-transparent border-b-[3px] border-transparent px-1 whitespace-nowrap">
            Comments
          </TabsTrigger>
          <TabsTrigger value="saved" className="pb-3.5 pt-2 text-[16px] font-semibold data-[state=active]:text-text-primary data-[state=active]:border-b-[3px] data-[state=active]:border-text-primary rounded-none shadow-none bg-transparent border-b-[3px] border-transparent px-1 whitespace-nowrap">
            Saved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0 space-y-2 sm:space-y-6">
          {userPosts.map(post => <PostCard key={post.id} post={post} />)}
          {userPosts.length === 0 && (
            <div className="p-10 text-center text-text-secondary font-medium bg-card rounded-[24px] border border-border-subtle">
              No posts yet.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="comments" className="mt-0 space-y-2 sm:space-y-4 px-4 sm:px-0">
          {userComments.map(comment => (
            <Link key={comment.id} to={`/post/${comment.postId}`} className="block">
              <div className="bg-card border-y sm:border border-border-subtle sm:rounded-[24px] p-6 cursor-pointer hover:border-border-strong hover:shadow-ios-subtle transition-all duration-300 active:scale-[0.99]">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={18} className="text-text-secondary" />
                  <p className="text-[13px] text-text-secondary font-bold uppercase tracking-wider">Commented on post</p>
                </div>
                <p className="text-[16px] text-text-primary font-medium leading-relaxed">"{comment.content}"</p>
              </div>
            </Link>
          ))}
          {userComments.length === 0 && (
            <div className="p-10 text-center text-text-secondary font-medium bg-card rounded-[24px] border border-border-subtle">
              No comments yet.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="mt-0 space-y-2 sm:space-y-6">
           <div className="p-10 text-center text-text-secondary font-medium bg-card rounded-[24px] border border-border-subtle">
              No saved posts yet.
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
