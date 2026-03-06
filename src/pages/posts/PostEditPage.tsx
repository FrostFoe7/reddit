import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/useStore';
import { usePost, useUpdatePost, useUploadImage } from '@/hooks';
import { toast } from 'sonner';

export const PostEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { data: post, isLoading } = usePost(id);
  const { mutate: updatePost, isPending } = useUpdatePost();
  const { mutateAsync: uploadImage, isPending: isUploadingImage } = useUploadImage();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setTitle(post?.title || '');
    setContent(post?.content || '');
    setImageUrl(post?.image_url || '');
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
          image_url: imageUrl,
        },
      },
      {
        onSuccess: () => {
          navigate(`/posts/${post.id}`);
        },
      },
    );
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      const uploaded = await uploadImage(file);
      setImageUrl(uploaded);
      toast.success('Post image uploaded');
    } catch {
      // onError toast is already handled by hook.
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
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
          <label htmlFor="edit-post-image" className="text-sm font-semibold">
            Image URL
          </label>
          <div className="flex gap-2">
            <Input
              id="edit-post-image"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.webp"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
            >
              Upload
            </Button>
          </div>
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