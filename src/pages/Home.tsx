import React from 'react';
import { PostCard } from '@/components/post/PostCard';
import { mockPosts } from '@/db/db';
import { CreatePostPrompt } from '@/components/common/CreatePostPrompt';
import { SortBar } from '@/components/common/SortBar';

export const Home: React.FC = () => {
  return (
    <div id="view-home" className="space-y-6">
      <CreatePostPrompt className="mb-6" />

      <SortBar className="mb-4 sm:mb-6" />

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
