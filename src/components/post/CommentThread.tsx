import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Comment } from '@/db/db';
import { mockComments } from '@/db/db';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { VoteControl } from '@/components/common/VoteControl';
import { ActionButtons } from '@/components/common/ActionButtons';

interface CommentThreadProps {
  comment: Comment;
  isChild?: boolean;
}

export const CommentThread: React.FC<CommentThreadProps> = ({ comment, isChild = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const childComments = mockComments.filter(c => c.postId === comment.id);

  return (
    <div className={cn("thread-container flex gap-3 sm:gap-4", isChild && "mt-5", isCollapsed && "collapsed-thread")}>
      <div className="thread-col flex flex-col items-center">
        <Avatar className={cn("shrink-0 shadow-sm border border-border", isChild ? "h-8 w-8" : "h-10 w-10")}>
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.avatar}`} />
          <AvatarFallback>{comment.author[0]}</AvatarFallback>
        </Avatar>
        <div 
          className="thread-line" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>
      
      <div className="flex-1 pb-2 thread-content">
        <div className="flex items-center gap-2.5 text-[14px] sm:text-[13px] mb-1.5">
          {comment.isOp && (
            <Badge className="font-bold text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md uppercase border-none">
              OP
            </Badge>
          )}
          <span className={cn("font-bold tracking-tight hover:underline cursor-pointer", comment.isOp ? "text-primary" : "text-foreground")}>
            {comment.author}
          </span>
          <span className="text-muted-foreground opacity-50 font-bold text-[10px]">•</span>
          <span className="text-muted-foreground font-medium">{comment.time}</span>
          {isCollapsed && (
            <span 
              className="text-primary font-bold cursor-pointer ml-1 text-[12px]" 
              onClick={() => setIsCollapsed(false)}
            >
              [expand]
            </span>
          )}
        </div>

        {!isCollapsed && (
          <>
            <div className="text-[16px] sm:text-[15px] text-foreground leading-relaxed mb-3 font-medium">
              {comment.content}
            </div>
            <div className="flex items-center gap-2 -ml-2">
              <VoteControl initialScore={comment.upvotes} />
              <ActionButtons 
                id={comment.id} 
                type="comment" 
              />
            </div>
            
            <div className="reply-container">
              {childComments.map(child => (
                <CommentThread key={child.id} comment={child} isChild />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
