import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/useStore';
import { usePost, useUpdatePost } from '@/hooks';

export const PostEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { data: post, isLoading } = usePost(id);
  const { mutate: updatePost, isPending } = useUpdatePost();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  React.useEffect(() => {
    setTitle(post?.title || '');
    setContent(post?.content || '');
  }, [post]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold">Please login to edit posts</h2>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading post...</div>;
  }

  if (!post) {
    return <div className="p-8 text-center text-muted-foreground">Post not found.</div>;
  }

  if (post.author_id !== user.id) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold">You can only edit your own posts</h2>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePost(
      {
        id: post.id,
        updates: {
          user_id: user.id,
          title,
          content,
        },
      },
      {
        onSuccess: () => {
          navigate(`/posts/${post.id}`);
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="edit-post-title" className="text-sm font-semibold">
            Title
          </label>
          <Input
            id="edit-post-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="edit-post-content" className="text-sm font-semibold">
            Content
          </label>
          <Textarea
            id="edit-post-content"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-full">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || !title.trim()}
            className="rounded-full"
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};