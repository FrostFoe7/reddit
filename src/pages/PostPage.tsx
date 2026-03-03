import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PostCard } from '@/components/post/PostCard';
import { CommentThread } from '@/components/post/CommentThread';
import { mockPosts, mockComments } from '@/db/db';
import { Button } from '@/components/ui/button';
import { Search, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
      {/* Main Content Area */}
      <div className="w-full min-w-0">
        <div className="bg-background">
          <PostCard post={post} isDetail />
          
          {/* Comment Composer Section */}
          <div className="mt-4 px-4 sm:px-0">
            <div className="border border-border rounded-[20px] bg-background focus-within:border-muted-foreground transition-colors overflow-hidden">
              <textarea 
                className="w-full min-h-[44px] px-4 py-3 bg-transparent border-none focus:ring-0 resize-none text-[14px] placeholder:text-muted-foreground"
                placeholder="Join the conversation"
              />
              <div className="flex justify-between items-center px-2 py-2 bg-muted/10 border-t border-border/50">
                <div className="flex gap-1">
                  {/* Formatting buttons would go here */}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="rounded-full font-bold text-[12px]">Cancel</Button>
                  <Button size="sm" className="rounded-full font-bold text-[12px] px-4">Comment</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comment Controls (Sort/Search) */}
          <div className="flex items-center gap-4 mt-6 mb-4 px-4 sm:px-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[12px] text-muted-foreground whitespace-nowrap">Sort by:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 font-bold text-[12px] text-muted-foreground hover:text-foreground">
                    Best <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40 rounded-[12px]">
                  <DropdownMenuItem className="font-bold">Best</DropdownMenuItem>
                  <DropdownMenuItem>Top</DropdownMenuItem>
                  <DropdownMenuItem>New</DropdownMenuItem>
                  <DropdownMenuItem>Controversial</DropdownMenuItem>
                  <DropdownMenuItem>Old</DropdownMenuItem>
                  <DropdownMenuItem>Q&A</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="relative flex-1 min-w-[150px]">
              <div className="flex items-center h-9 px-3 rounded-full border border-border bg-muted/20 hover:border-muted-foreground transition-colors cursor-pointer group">
                <Search size={16} className="text-muted-foreground mr-2 shrink-0 group-hover:text-foreground" />
                <span className="text-[14px] text-muted-foreground truncate group-hover:text-foreground">Search Comments</span>
              </div>
            </div>
          </div>

          {/* Comments Tree */}
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
