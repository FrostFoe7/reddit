import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, MessageSquare, MoreHorizontal, Flag, Pencil, Trash2 } from 'lucide-react';
import type { Comment } from '@/db/db';
import { mockComments } from '@/db/db';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useOverlays } from '@/components/common/GlobalOverlays';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CommentThreadProps {
  comment: Comment;
  isChild?: boolean;
}

const formatNumber = (num: number) => num > 999 ? (num / 1000).toFixed(1) + 'k' : num;

export const CommentThread: React.FC<CommentThreadProps> = ({ comment, isChild = false }) => {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { openReport } = useOverlays();

  const handleVote = (type: 'up' | 'down') => {
    setVoteStatus(prev => prev === type ? null : type);
  };

  const score = comment.upvotes + (voteStatus === 'up' ? 1 : voteStatus === 'down' ? -1 : 0);
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
            <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground font-semibold text-[14px] -ml-3 sm:-ml-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "flex items-center gap-1.5 h-10 px-3 hover:bg-muted rounded-full transition-colors",
                  voteStatus === 'up' && "text-vote-up bg-vote-up/10"
                )}
                onClick={() => handleVote('up')}
              >
                <ArrowUp size={20} className={cn(voteStatus === 'up' && "fill-current")} />
                <span className={cn(
                  voteStatus === 'up' ? "text-vote-up" : voteStatus === 'down' ? "text-vote-down" : "text-foreground"
                )}>
                  {formatNumber(score)}
                </span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "flex items-center h-10 px-3 hover:bg-muted rounded-full transition-colors",
                  voteStatus === 'down' && "text-vote-down bg-vote-down/10"
                )}
                onClick={() => handleVote('down')}
              >
                <ArrowDown size={20} className={cn(voteStatus === 'down' && "fill-current")} />
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 h-10 px-4 hover:bg-muted rounded-full transition-colors">
                <MessageSquare size={20} /> Reply
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-10 h-10 hover:bg-muted rounded-full">
                    <MoreHorizontal size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px] rounded-[16px] p-1.5 bg-glass backdrop-blur-2xl shadow-ios-float border-border">
                  <DropdownMenuItem className="rounded-[10px] p-2 font-medium flex justify-between">
                    Edit <Pencil size={16} className="text-muted-foreground" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-[10px] p-2 font-medium flex justify-between text-destructive focus:text-destructive" onClick={() => openReport(comment.id)}>
                    Report <Flag size={16} />
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-[10px] p-2 font-medium flex justify-between text-destructive focus:text-destructive">
                    Delete <Trash2 size={16} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
