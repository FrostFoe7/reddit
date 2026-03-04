import type { Post } from '@/types';
import React from 'react';
import { usePosts } from '@/hooks';
import { PostCard } from '@/components/post/PostCard';
import { CreatePostPrompt } from '@/components/common/CreatePostPrompt';
import { SortBar } from '@/components/common/SortBar';

export const Home: React.FC = () => {
  const { data: posts, isLoading, error } = usePosts();

  return (
    <div id="view-home" className="flex flex-col gap-4 sm:gap-6">
      <CreatePostPrompt className="hidden sm:flex" />

      <div className="bg-card sm:bg-transparent border-y sm:border-none border-border">
        <SortBar className="py-2 sm:py-0" />
      </div>

      <div id="feed-container" className="flex flex-col gap-1 sm:gap-4 lg:gap-6">
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center font-bold">
            Failed to load posts. Is the backend running?
          </div>
        )}

        {posts?.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {!isLoading && posts?.length === 0 && (
          <div className="p-12 text-center text-muted-foreground font-medium bg-card rounded-[24px] border border-border shadow-sm">
            <p className="text-[18px] font-bold text-foreground mb-1">No posts found</p>
            <p className="text-sm">Be the first to share something!</p>
          </div>
        )}
      </div>

      <div id="scroll-trigger" className="h-32 flex flex-col items-center justify-center py-10 gap-4">
        <div id="scroll-spinner" className="w-10 h-10 border-[3px] border-muted border-t-primary rounded-full animate-spin shadow-sm"></div>
        <p className="text-[14px] font-bold text-muted-foreground animate-pulse">Loading more posts...</p>
      </div>
    </div>
  );
};
