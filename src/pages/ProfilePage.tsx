import React from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useUser, usePosts, useComments } from '@/hooks';
import { PostCard } from '@/components/post/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MoreHorizontal, 
  MessageSquare, 
  Share2, 
  Flag, 
  Ban, 
  UserPlus, 
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOverlays } from '@/components/common/GlobalOverlays';
import { toast } from 'sonner';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'posts';
  const { openShare, openReport } = useOverlays();
  const [isFollowing, setIsFollowing] = React.useState(false);

  const { data: user, isLoading: userLoading } = useUser(username);
  const { data: posts = [] } = usePosts();
  // Filter posts and comments for this user
  // In a real app, you'd have a specific API for user's content
  const userPosts = posts.filter((p: Post) => (p.author_username || p.author) === username);
  const { data: allComments = [] } = useComments(undefined); // This might need a different hook for user's comments
  const userComments = allComments.filter((c: Comment) => (c.author_username || c.author) === username);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? `Unfollowed u/${username}` : `Following u/${username}`);
  };

  if (userLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div id="view-profile" className="view-section active">
      <div className="bg-card border-b sm:border border-border sm:rounded-[32px] overflow-hidden mb-6 relative shadow-sm">
        <div className="h-32 sm:h-48 bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 relative">
           <div className="absolute top-3 right-3 sm:top-6 sm:right-6 flex gap-2">
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon" className="w-10 h-10 sm:w-12 sm:h-12 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md shadow-sm transition-all active:scale-95 border border-white/10">
                  <MoreHorizontal size={22} />
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-[220px] rounded-[20px] p-2 bg-glass backdrop-blur-2xl shadow-ios-float border-border">
                 <DropdownMenuItem className="rounded-[12px] p-3 font-semibold flex justify-between" onClick={() => openShare(window.location.href)}>
                   Share Profile <Share2 size={18} className="text-muted-foreground" />
                 </DropdownMenuItem>
                 <DropdownMenuItem className="rounded-[12px] p-3 font-semibold flex justify-between" onClick={toggleFollow}>
                   {isFollowing ? "Unfollow" : "Follow"} <UserPlus size={18} className="text-muted-foreground" />
                 </DropdownMenuItem>
                 <DropdownMenuItem className="rounded-[12px] p-3 font-semibold flex justify-between" onClick={() => toast.info("Chat feature coming soon!")}>
                   Send Message <Mail size={18} className="text-muted-foreground" />
                 </DropdownMenuItem>
                 <DropdownMenuSeparator className="bg-border my-1.5 mx-1" />
                 <DropdownMenuItem className="rounded-[12px] p-3 font-semibold flex justify-between text-destructive focus:text-destructive" onClick={() => toast.error("User blocked")}>
                   Block User <Ban size={18} />
                 </DropdownMenuItem>
                 <DropdownMenuItem className="rounded-[12px] p-3 font-semibold flex justify-between text-destructive focus:text-destructive" onClick={() => openReport(`user_${username}`)}>
                   Report <Flag size={18} />
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           </div>
        </div>
        <div className="px-5 sm:px-10 pb-8 relative flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="relative -mt-[52px] sm:-mt-[60px] mb-4">
            <Avatar className="w-[104px] h-[104px] sm:w-[130px] sm:h-[130px] border-[5px] border-card shadow-lg">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=ff4500`} />
              <AvatarFallback className="text-2xl font-bold">{username?.[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-card shadow-sm"></div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between w-full mb-6 gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-[28px] sm:text-[36px] font-bold text-foreground leading-none tracking-tight">{username}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-[14px] sm:text-[15px] text-muted-foreground font-medium">
                <span>u/{username}</span>
                <span>•</span>
                {user?.is_premium && <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full text-[12px]">Premium</span>}
              </div>
            </div>
            <div className="flex gap-3 mt-2 sm:mt-0">
              <Button 
                onClick={toggleFollow}
                variant={isFollowing ? "outline" : "default"}
                className={cn(
                  "rounded-full px-8 font-bold h-11 shadow-md transition-all active:scale-95",
                  isFollowing ? "border-primary text-primary hover:bg-primary/5" : "bg-primary text-primary-foreground hover:opacity-90"
                )}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button onClick={() => toast.info("Chat feature coming soon!")} variant="outline" size="icon" className="rounded-full h-11 w-11 border-border hover:bg-muted shadow-sm transition-all active:scale-95"><Mail size={20} /></Button>
            </div>
          </div>
          
          <div className="flex gap-10 text-[15px] justify-center sm:justify-start w-full border-t border-border/50 pt-5">
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-bold text-foreground text-[20px] tracking-tight">{user?.karma || 0}</span> 
              <span className="text-muted-foreground text-[12px] uppercase tracking-widest font-bold opacity-70 mt-0.5">Karma</span>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-bold text-foreground text-[20px] tracking-tight">
                {user?.cake_day ? new Date(user.cake_day).toLocaleDateString() : 'Aug 12, 2023'}
              </span> 
              <span className="text-muted-foreground text-[12px] uppercase tracking-widest font-bold opacity-70 mt-0.5">Cake day</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList variant="line" className="px-4 sm:px-0 gap-6 sm:gap-10 mb-6 overflow-x-auto no-scrollbar justify-start">
          {['posts', 'comments', 'saved'].map((tab) => (
            <TabsTrigger 
              key={tab}
              value={tab} 
              className="font-bold text-[15px] sm:text-[16px] capitalize"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="posts" className="mt-0 space-y-3 sm:space-y-6">
          {userPosts.map(post => <PostCard key={post.id} post={post} />)}
          {userPosts.length === 0 && (
            <div className="p-12 text-center text-muted-foreground font-medium bg-card rounded-[24px] border border-border shadow-sm">
              <p className="text-[18px] font-bold text-foreground mb-1">No posts yet</p>
              <p className="text-[14px]">When {username} posts, they'll show up here.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="comments" className="mt-0 space-y-3 sm:space-y-4 px-0">
          {userComments.map(comment => (
            <Link key={comment.id} to={`/post/${comment.post_id}`} className="block group">
              <div className="bg-card border-y sm:border border-border sm:rounded-[24px] p-5 sm:p-6 cursor-pointer hover:border-primary/30 hover:shadow-ios-subtle transition-all duration-300 active:scale-[0.99]">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={18} className="text-primary" />
                  <p className="text-[12px] text-muted-foreground font-bold uppercase tracking-widest">Commented on post</p>
                </div>
                <p className="text-[16px] text-foreground font-medium leading-relaxed group-hover:text-primary transition-colors">"{comment.content}"</p>
              </div>
            </Link>
          ))}
          {userComments.length === 0 && (
            <div className="p-12 text-center text-muted-foreground font-medium bg-card rounded-[24px] border border-border shadow-sm">
              <p className="text-[18px] font-bold text-foreground mb-1">No comments yet</p>
              <p className="text-[14px]">When {username} comments, they'll show up here.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="mt-0 space-y-3 sm:space-y-6">
           <div className="p-12 text-center text-muted-foreground font-medium bg-card rounded-[24px] border border-border shadow-sm">
              <p className="text-[18px] font-bold text-foreground mb-1">No saved posts</p>
              <p className="text-[14px]">Saved posts are private and only visible to you.</p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
