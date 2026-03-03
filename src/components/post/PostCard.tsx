import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Post } from '@/db/db';
import { cn } from '@/lib/utils';


interface PostCardProps {
  post: Post;
  isDetail?: boolean;
}

const formatNumber = (num: number) => num > 999 ? (num / 1000).toFixed(1) + 'k' : num;

export const PostCard: React.FC<PostCardProps> = ({ post, isDetail = false }) => {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleVote = (type: 'up' | 'down', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVoteStatus(prev => prev === type ? null : type);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const score = post.upvotes + (voteStatus === 'up' ? 1 : voteStatus === 'down' ? -1 : 0);

  return (
    <article className={cn(
      "overflow-hidden relative group",
      isDetail 
        ? "bg-card sm:border border-border-subtle sm:rounded-[32px] sm:shadow-ios-subtle mb-6" 
        : "post-card bg-card border-y sm:border border-border-subtle rounded-none sm:rounded-[32px] sm:shadow-ios-subtle transition-all duration-300 sm:hover:shadow-ios-float sm:hover:-translate-y-0.5 flex flex-col sm:flex-row"
    )}>
      {/* Desktop Side Vote Bar */}
      {!isDetail && (
        <div className="hidden sm:flex flex-col items-center py-5 px-3 w-[68px] shrink-0 gap-1 bg-primary/30 border-r border-border-subtle/50">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-11 w-11 rounded-full hover:bg-hover hover:text-vote-up transition-colors",
              voteStatus === 'up' && "text-vote-up bg-vote-up/10"
            )}
            onClick={(e) => handleVote('up', e)}
          >
            <ArrowUp size={22} className={cn(voteStatus === 'up' && "fill-current")} />
          </Button>
          <span className={cn(
            "text-[14px] font-bold tracking-tight py-1",
            voteStatus === 'up' ? "text-vote-up" : voteStatus === 'down' ? "text-accent-primary" : "text-text-primary"
          )}>
            {formatNumber(score)}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-11 w-11 rounded-full hover:bg-hover hover:text-accent-primary transition-colors",
              voteStatus === 'down' && "text-accent-primary bg-accent-primary/10"
            )}
            onClick={(e) => handleVote('down', e)}
          >
            <ArrowDown size={22} className={cn(voteStatus === 'down' && "fill-current")} />
          </Button>
        </div>
      )}

      <div className={cn("flex-1 w-full min-w-0", isDetail ? "p-5 sm:p-8" : "p-5 sm:p-6")}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5 text-[14px]">
            <Link to={`/r/${post.sub}`} className="flex items-center gap-2 font-bold text-text-primary hover:underline truncate z-10">
              <div className={cn("w-7 h-7 rounded-full shrink-0 shadow-sm flex items-center justify-center text-white text-[11px] font-bold", post.subIcon)}>
                r/
              </div> 
              r/{post.sub}
            </Link>
            <span className="text-text-secondary opacity-50 font-bold text-[10px]">•</span>
            <span className="text-text-secondary font-medium">
              {isDetail && `u/${post.author} • `}
              {post.time}
            </span>
          </div>
          <div className="flex gap-2 z-10 relative">
            {isDetail && (
              <Button className="bg-bg-primary hover:bg-border-subtle text-text-primary h-9 px-4.5 rounded-full font-semibold text-[14px] transition-colors border border-border-strong">
                Join
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-text-secondary hover:bg-hover rounded-full w-9 h-9">
              <MoreHorizontal size={22} />
            </Button>
          </div>
        </div>

        <Link to={`/post/${post.id}`} className={cn("block", isDetail && "pointer-events-none")}>
          <h2 className={cn(
            "font-bold text-text-primary mb-3 leading-snug tracking-tight",
            isDetail ? "text-[24px] sm:text-[28px]" : "text-[22px]"
          )}>
            {post.title}
          </h2>
          {post.content && (
            <div className={cn(
              "font-medium leading-relaxed",
              isDetail ? "text-[16px] sm:text-[17px] space-y-4 mb-6 text-text-primary" : "text-[15px] sm:text-[16px] text-text-secondary line-clamp-3 mb-4"
            )}>
              {post.content}
            </div>
          )}
        </Link>

        {post.image && (
          <div className={cn(
            "mt-3 mb-5 bg-bg-primary sm:rounded-[20px] overflow-hidden sm:border border-border-subtle w-full max-h-[500px] flex items-center justify-center relative shadow-sm",
            !isDetail && "-mx-5 sm:mx-0",
            !isDetail && "w-[calc(100%+2.5rem)] sm:w-full"
          )}>
            <img src={post.image} loading="lazy" className="max-h-[500px] object-cover w-full" alt={post.title} />
          </div>
        )}

        <div className={cn(
          "flex items-center gap-1.5 sm:gap-3 text-text-secondary font-semibold text-[14px]",
          isDetail ? "pt-5 border-t border-border-subtle" : "-ml-2 relative z-10"
        )}>
          {/* Mobile Vote Buttons */}
          <div className="flex sm:hidden items-center bg-hover rounded-full mr-1 h-11 px-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-9 w-9 rounded-full hover:bg-card hover:text-vote-up transition-all",
                voteStatus === 'up' && "text-vote-up bg-card shadow-sm"
              )}
              onClick={(e) => handleVote('up', e)}
            >
              <ArrowUp size={20} className={cn(voteStatus === 'up' && "fill-current")} />
            </Button>
            <span className={cn(
              "px-2 font-bold text-[14px]",
              voteStatus === 'up' ? "text-vote-up" : voteStatus === 'down' ? "text-accent-primary" : "text-text-primary"
            )}>
              {formatNumber(score)}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-9 w-9 rounded-full hover:bg-card hover:text-accent-primary transition-all",
                voteStatus === 'down' && "text-accent-primary bg-card shadow-sm"
              )}
              onClick={(e) => handleVote('down', e)}
            >
              <ArrowDown size={20} className={cn(voteStatus === 'down' && "fill-current")} />
            </Button>
          </div>

          <Link to={`/post/${post.id}`} className="flex items-center gap-2 h-11 px-4 hover:bg-hover rounded-full transition-colors">
            <MessageSquare size={22} />
            <span className="hidden sm:inline">{formatNumber(post.comments)} Comments</span>
            <span className="sm:hidden">{formatNumber(post.comments)}</span>
          </Link>
          
          <Button variant="ghost" className="flex items-center gap-2 h-11 px-4 hover:bg-hover rounded-full transition-colors font-semibold">
            <Share2 size={22} />
            <span className="hidden sm:inline">Share</span>
          </Button>

          <Button 
            variant="ghost" 
            className="flex items-center gap-2 h-11 px-4 hover:bg-hover rounded-full transition-colors ml-auto sm:ml-0 font-semibold"
            onClick={handleSave}
          >
            <Bookmark size={22} className={cn(isSaved && "fill-text-primary text-text-primary")} />
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </Button>
        </div>
      </div>
    </article>
  );
};
