import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostCard } from '@/components/post/PostCard';
import { CommentThread } from '@/components/post/CommentThread';
import { mockPosts, mockComments } from '@/db/db';
import { CommentComposer } from '@/components/post/CommentComposer';
import { CommentControls } from '@/components/post/CommentControls';

export const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = mockPosts.find(p => p.id === id);
  const comments = mockComments.filter(c => c.postId === id && !c.parentId);

  if (!post) {
    return (
      <div className="text-center py-24 px-4">
        <h1 className="text-[32px] sm:text-[40px] font-bold text-foreground tracking-tight mb-4">Post not found</h1>
        <Link to="/" className="inline-block bg-primary text-primary-foreground h-14 px-8 rounded-full font-bold text-[16px] leading-[56px] hover:opacity-80 transition-opacity shadow-sm">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full min-w-0">
        <div className="bg-background">
          <PostCard post={post} isDetail />
          
          <div className="mt-4 px-4 sm:px-0">
            <CommentComposer />
          </div>

          <CommentControls className="mt-6 mb-4" />

          <div className="space-y-4 pb-12">
            {comments.map(comment => (
              <CommentThread key={comment.id} comment={comment} />
            ))}
            {comments.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No comments yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
