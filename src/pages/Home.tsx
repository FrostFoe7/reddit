import React, { useRef, useState } from 'react';
import { usePosts } from '@/hooks';
import { PostCard } from '@/components/post/PostCard';
import { CreatePostPrompt } from '@/components/common/CreatePostPrompt';
import { SortBar } from '@/components/common/SortBar';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Separator } from '@/components/ui/separator';

// Note: React Compiler may skip memoization of useVirtualizer due to incompatible API
// This is a known limitation and doesn't affect functionality
/* eslint-disable react-hooks/incompatible-library */
export const Home: React.FC = () => {
  const [currentSort, setCurrentSort] = useState('new');
  const { data: posts = [], isLoading, error } = usePosts(currentSort);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, 
    overscan: 5,
  });

  return (
    <div id="view-home" className="flex flex-col gap-4 sm:gap-6">
      <CreatePostPrompt className="hidden sm:flex" />

      <div className="bg-card sm:bg-transparent border-y sm:border-none border-border">
        <SortBar 
            className="py-2 sm:py-0" 
            activeSort={currentSort} 
            onSortChange={setCurrentSort} 
        />
      </div>

      <div
        ref={parentRef}
        id="feed-container"
        className="h-[calc(100vh-120px)] overflow-y-auto no-scrollbar flex flex-col"
      >
        {isLoading && (
          <div className="space-y-4 px-4 sm:px-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card p-4 rounded-2xl border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton circle width={32} height={32} />
                  <Skeleton width={100} />
                </div>
                <Skeleton height={24} width="80%" className="mb-2" />
                <Skeleton height={200} className="rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center font-bold mx-4">
            Failed to load posts. Is the backend running?
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="flex flex-col">
                  <div className="pb-2 sm:pb-4 px-0 sm:px-0">
                    <PostCard post={posts[virtualItem.index]} />
                  </div>
                  <Separator className="my-2 opacity-50" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="p-12 text-center text-muted-foreground font-medium bg-card rounded-3xl border border-border shadow-sm mx-4">
            <p className="text-lg font-bold text-foreground mb-1">
              No posts found
            </p>
            <p className="text-sm">Be the first to share something!</p>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <div
            id="scroll-trigger"
            className="h-32 flex flex-col items-center justify-center py-10 gap-4"
            style={{
               position: 'relative',
               bottom: 0,
               width: '100%'
            }}
          >
            <div
              id="scroll-spinner"
              className="w-10 h-10 border-[3px] border-muted border-t-primary rounded-full animate-spin shadow-sm"
            ></div>
            <p className="text-sm font-bold text-muted-foreground animate-pulse">
              No more posts to load
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
