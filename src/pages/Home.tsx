import React from 'react';
import { PostCard } from '@/components/post/PostCard';
import { mockPosts } from '@/db/db';
import { Flame, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const Home: React.FC = () => {
  return (
    <div id="view-home" className="space-y-6">
      {/* Desktop Create Post */}
      <div className="hidden sm:flex items-center gap-4 p-4.5 bg-card border border-border rounded-[24px] mb-6 shadow-ios-subtle dark:shadow-none transition-all duration-400 cursor-pointer group">
        <Avatar className="h-11 w-11 shrink-0 shadow-sm border border-border">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ff4500" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 bg-background border border-transparent group-hover:border-border transition-colors rounded-full h-12 px-5 flex items-center text-[15px] text-muted-foreground font-medium">
          Create Post
        </div>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted">
                <ImageIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create Image Post</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted">
                <LinkIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create Link Post</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 sm:mb-6 px-4 sm:px-0 text-[15px] font-semibold text-muted-foreground overflow-x-auto no-scrollbar">
        <Button variant="ghost" className="flex items-center gap-2 px-5 py-2.5 bg-muted text-foreground rounded-full whitespace-nowrap">
          <Flame size={20} className="text-primary fill-primary" /> Hot
        </Button>
        <Button variant="ghost" className="flex items-center gap-2 px-5 py-2.5 rounded-full hover:bg-muted whitespace-nowrap">
          <Star size={20} /> New
        </Button>
        <Button variant="ghost" className="flex items-center gap-2 px-5 py-2.5 rounded-full hover:bg-muted whitespace-nowrap">
          <TrendingUp size={20} /> Top
        </Button>
      </div>

      <div id="feed-container" className="space-y-2 sm:space-y-6">
        {mockPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div id="scroll-trigger" className="h-24 flex items-center justify-center py-8">
        <div id="scroll-spinner" className="w-8 h-8 border-[3px] border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    </div>
  );
};
