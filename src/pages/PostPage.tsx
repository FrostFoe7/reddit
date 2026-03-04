import type { Comment } from '@/types';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePost, useComments } from '@/hooks';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/post/PostCard';
import { CommentThread } from '@/components/post/CommentThread';
import { CommentComposer } from '@/components/post/CommentComposer';
import { CommentControls } from '@/components/post/CommentControls';

export const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: post, isLoading: postLoading } = usePost(id);
  const { data: comments = [], isLoading: commentsLoading } = useComments(id);
  
  const topLevelComments = comments.filter((c: Comment) => !c.parent_id);

  if (postLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-muted-foreground">
             <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
             <polyline points="14 2 14 8 20 8" />
             <line x1="9" y1="15" x2="15" y2="15" />
             <line x1="9" y1="11" x2="15" y2="11" />
           </svg>
        </div>
        <h1 className="text-[28px] font-bold text-foreground tracking-tight mb-3">Post not found</h1>
        <p className="text-[16px] text-muted-foreground font-medium mb-10 max-w-[280px]">This post may have been removed or the link might be broken.</p>
        <Button onClick={() => navigate('/')} className="rounded-full px-10 h-12 font-bold bg-primary text-primary-foreground shadow-md transition-all active:scale-95">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="w-full min-w-0">
        <div className="bg-background">
          <PostCard post={post} isDetail />
          
          <div className="mt-2 sm:mt-6 px-4 sm:px-0">
            <CommentComposer />
          </div>

          <div className="mt-6 border-b border-border/50">
            <CommentControls className="mb-4" />
          </div>

          <div className="space-y-1 sm:space-y-4 pb-20 pt-2">
            {topLevelComments.map((comment: any) => (
              <CommentThread key={comment.id} comment={comment} allComments={comments} />
            ))}
            {!commentsLoading && topLevelComments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 opacity-50">
                     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                   </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-[18px]">No comments yet</h4>
                  <p className="text-[14px] text-muted-foreground font-medium">Be the first to share what you think!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
