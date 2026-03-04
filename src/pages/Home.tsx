import React from 'react';
import { PostCard } from '@/components/post/PostCard';
import { mockPosts } from '@/db/db';
import { CreatePostPrompt } from '@/components/common/CreatePostPrompt';
import { SortBar } from '@/components/common/SortBar';

export const Home: React.FC = () => {
  return (
    <div id="view-home" className="flex flex-col gap-4 sm:gap-6">
      <CreatePostPrompt className="hidden sm:flex" />

      <div className="bg-card sm:bg-transparent border-y sm:border-none border-border">
        <SortBar className="py-2 sm:py-0" />
      </div>

      <div id="feed-container" className="flex flex-col gap-1 sm:gap-4 lg:gap-6">
        {mockPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div id="scroll-trigger" className="h-32 flex flex-col items-center justify-center py-10 gap-4">
        <div id="scroll-spinner" className="w-10 h-10 border-[3px] border-muted border-t-primary rounded-full animate-spin shadow-sm"></div>
        <p className="text-[14px] font-bold text-muted-foreground animate-pulse">Loading more posts...</p>
      </div>
    </div>
  );
};
