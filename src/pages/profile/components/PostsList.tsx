import { PostCard } from '@/pages/posts/components/PostCard';
import type { Post } from '@/types';

interface PostsListProps {
  posts: Post[];
}

export function PostsList({ posts }: PostsListProps) {
  return (
    <div className="space-y-3 sm:space-y-6">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
