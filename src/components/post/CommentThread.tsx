import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, MessageSquare, MoreHorizontal } from 'lucide-react';
import type { Comment } from '@/db/db';
import { mockComments } from '@/db/db';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CommentThreadProps {
  comment: Comment;
  isChild?: boolean;
}

const formatNumber = (num: number) => num > 999 ? (num / 1000).toFixed(1) + 'k' : num;

export const CommentThread: React.FC<CommentThreadProps> = ({ comment, isChild = false }) => {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleVote = (type: 'up' | 'down') => {
    setVoteStatus(prev => prev === type ? null : type);
  };

  const score = comment.upvotes + (voteStatus === 'up' ? 1 : voteStatus === 'down' ? -1 : 0);
  const childComments = mockComments.filter(c => c.parentId === comment.id);

  return (
    <div className={cn("thread-container flex gap-3 sm:gap-4", isChild && "mt-5", isCollapsed && "collapsed-thread")}>
      <div className="thread-col flex flex-col items-center">
        <Avatar className={cn("shrink-0 shadow-sm border border-border-subtle", isChild ? "h-8 w-8" : "h-10 w-10")}>
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.avatar}`} />
          <AvatarFallback>{comment.author[0]}</AvatarFallback>
        </Avatar>
        <div 
          className="thread-line hover:bg-border-strong transition-colors" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      </div>
      
      <div className="flex-1 pb-2 thread-content">
        <div className="flex items-center gap-2.5 text-[14px] sm:text-[13px] mb-1.5">
          {comment.isOp && (
            <Badge className="font-bold text-[10px] bg-reddit-orange/10 text-reddit-orange px-2 py-0.5 rounded-md uppercase border-none">
              OP
            </Badge>
          )}
          <span className={cn("font-bold tracking-tight hover:underline cursor-pointer", comment.isOp ? "text-reddit-orange" : "text-text-primary")}>
            {comment.author}
          </span>
          <span className="text-text-secondary opacity-50 font-bold text-[10px]">•</span>
          <span className="text-text-secondary font-medium">{comment.time}</span>
          {isCollapsed && (
            <span 
              className="text-accent-primary font-bold cursor-pointer ml-1" 
              onClick={() => setIsCollapsed(false)}
            >
              [expand]
            </span>
          )}
        </div>

        {!isCollapsed && (
          <>
            <div className="text-[16px] sm:text-[15px] text-text-primary leading-relaxed mb-3 font-medium">
              {comment.content}
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-text-secondary font-semibold text-[14px] -ml-3 sm:-ml-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "flex items-center gap-1.5 h-10 px-3 hover:bg-hover rounded-full transition-colors",
                  voteStatus === 'up' && "text-vote-up bg-vote-up/10"
                )}
                onClick={() => handleVote('up')}
              >
                <ArrowUp size={20} className={cn(voteStatus === 'up' && "fill-current")} />
                <span className={cn(
                  voteStatus === 'up' ? "text-vote-up" : voteStatus === 'down' ? "text-accent-primary" : "text-text-primary"
                )}>
                  {formatNumber(score)}
                </span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "flex items-center h-10 px-3 hover:bg-hover rounded-full transition-colors",
                  voteStatus === 'down' && "text-accent-primary bg-accent-primary/10"
                )}
                onClick={() => handleVote('down')}
              >
                <ArrowDown size={20} className={cn(voteStatus === 'down' && "fill-current")} />
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 h-10 px-4 hover:bg-hover rounded-full transition-colors">
                <MessageSquare size={20} /> Reply
              </Button>
              <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-hover rounded-full">
                <MoreHorizontal size={20} />
              </Button>
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
