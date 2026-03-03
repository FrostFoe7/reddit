import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostCard } from '@/components/post/PostCard';
import { CommentThread } from '@/components/post/CommentThread';
import { mockPosts, mockComments } from '@/db/db';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = mockPosts.find(p => p.id === id);
  const comments = mockComments.filter(c => c.postId === id && !c.parentId);

  if (!post) {
    return (
      <div className="text-center py-24 px-4">
        <h1 className="text-[32px] sm:text-[40px] font-bold text-text-primary tracking-tight mb-4">Post not found</h1>
        <Link to="/" className="inline-block bg-text-primary text-bg-primary h-14 px-8 rounded-full font-bold text-[16px] leading-[56px] hover:opacity-80 transition-opacity shadow-sm">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div id="view-post" className="view-section active">
      <PostCard post={post} isDetail />
      
      <div className="bg-card sm:border border-border-subtle rounded-t-[32px] sm:rounded-[32px] p-0 sm:p-8 sm:shadow-ios-subtle dark:shadow-none mb-14 sm:mb-0 relative z-10">
        <div className="hidden sm:flex items-center gap-4 mb-8">
          <Avatar className="h-11 w-11 shrink-0 shadow-sm border border-border-subtle">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ff4500" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 bg-bg-primary border border-border-strong rounded-full h-12 px-5 flex items-center text-[15px] text-text-secondary cursor-text hover:border-accent-primary transition-colors">
            Add a comment...
          </div>
        </div>
        
        <div className="space-y-6 px-4 sm:px-0 pt-6 sm:pt-0" id="comments-container">
          {comments.map(comment => (
            <CommentThread key={comment.id} comment={comment} />
          ))}
          {comments.length === 0 && (
            <div className="text-center py-10 text-text-secondary font-medium">
              No comments yet. Be the first to share what you think!
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Comment Input */}
      <div className="sm:hidden fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] inset-x-0 bg-glass backdrop-blur-2xl border-t border-border-subtle p-3.5 z-40 flex items-center gap-3">
        <div className="flex-1 bg-card border border-border-strong shadow-sm rounded-full h-11 px-5 flex items-center text-[15px] text-text-secondary">
          Add a comment...
        </div>
      </div>
    </div>
  );
};
