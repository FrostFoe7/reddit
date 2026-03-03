import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Share2, 
  Award, 
  MoreHorizontal,
  EyeOff,
  Flag,
  Trash2,
  Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Post } from '@/db/db';
import { cn } from '@/lib/utils';
import { useOverlays } from '@/components/common/GlobalOverlays';
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
  isDetail?: boolean;
}

const formatNumber = (num: number) => num > 999 ? (num / 1000).toFixed(1) + 'k' : num;

export const PostCard: React.FC<PostCardProps> = ({ post, isDetail = false }) => {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const navigate = useNavigate();
  const { openShare, openReport, openLightbox } = useOverlays();

  const handleVote = (type: 'up' | 'down', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVoteStatus(prev => prev === type ? null : type);
  };

  const score = post.upvotes + (voteStatus === 'up' ? 1 : voteStatus === 'down' ? -1 : 0);

  return (
    <article 
      className={cn(
        "w-full group bg-background transition-colors cursor-pointer",
        isDetail ? "py-4" : "hover:bg-neutral-100 dark:hover:bg-neutral-900/50 sm:rounded-[16px] px-4 py-3 my-1"
      )}
      onClick={() => !isDetail && navigate(`/post/${post.id}`)}
    >
      <div className="flex flex-col gap-2">
        {/* Credit Bar */}
        <div className="flex items-center justify-between text-[12px] min-h-[32px]">
          <div className="flex items-center gap-1.5 min-w-0 relative z-10" onClick={(e) => e.stopPropagation()}>
            <Link to={`/r/${post.sub}`} className="flex items-center gap-1.5 hover:underline group/sub">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.sub}&backgroundColor=ff4500`} />
                <AvatarFallback className={cn("text-[10px] font-bold text-white", post.subIcon)}>r/</AvatarFallback>
              </Avatar>
              <span className="font-bold text-foreground">r/{post.sub}</span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground whitespace-nowrap">{post.time}</span>
            {!isDetail && <span className="hidden sm:inline text-muted-foreground">• Suggested for you</span>}
          </div>

          <div className="flex items-center gap-1 relative z-10" onClick={(e) => e.stopPropagation()}>
            {!isDetail && (
              <Button variant="secondary" size="sm" className="h-7 rounded-full font-bold px-3 text-[12px] bg-primary text-primary-foreground hover:bg-primary/90">
                Join
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted">
                  <MoreHorizontal size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-[12px] p-1 shadow-lg">
                <DropdownMenuItem className="rounded-[8px] py-2">
                  <Pencil size={16} className="mr-2" /> Edit Post
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-[8px] py-2" onClick={() => openShare(window.location.origin + `/post/${post.id}`)}>
                  <Share2 size={16} className="mr-2" /> Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-[8px] py-2" onClick={() => toast.info("Post hidden")}>
                  <EyeOff size={16} className="mr-2" /> Hide
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-[8px] py-2 text-destructive" onClick={() => openReport(post.id)}>
                  <Flag size={16} className="mr-2" /> Report
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-[8px] py-2 text-destructive">
                  <Trash2 size={16} className="mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title */}
        <h2 className={cn(
          "font-semibold text-foreground leading-tight tracking-tight",
          isDetail ? "text-[22px] sm:text-[24px] mb-2" : "text-[18px]"
        )}>
          {post.title}
        </h2>

        {/* Text Content (if any) */}
        {post.content && (
          <div className={cn(
            "text-[14px] leading-normal text-muted-foreground",
            !isDetail && "line-clamp-3"
          )}>
            {post.content}
          </div>
        )}

        {/* Media Container */}
        {post.image && (
          <div 
            className="relative rounded-[16px] overflow-hidden border border-border bg-black group/media mt-1"
            onClick={(e) => {
              e.stopPropagation();
              openLightbox(post.image!);
            }}
          >
            <div className="aspect-video w-full flex items-center justify-center overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-contain transition-transform group-hover/media:scale-[1.02]" 
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center gap-2 mt-1 relative z-10" onClick={(e) => e.stopPropagation()}>
          {/* Vote Pill */}
          <div className="flex items-center bg-secondary-background rounded-full h-8 overflow-hidden border border-transparent hover:border-border transition-colors">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8 rounded-none hover:text-vote-up hover:bg-muted",
                voteStatus === 'up' && "text-vote-up bg-muted"
              )}
              onClick={(e) => handleVote('up', e)}
            >
              <ArrowBigUp size={20} className={cn(voteStatus === 'up' && "fill-current")} />
            </Button>
            <span className={cn(
              "px-1 font-bold text-[12px] min-w-[20px] text-center",
              voteStatus === 'up' ? "text-vote-up" : voteStatus === 'down' ? "text-vote-down" : "text-foreground"
            )}>
              {formatNumber(score)}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8 rounded-none hover:text-vote-down hover:bg-muted",
                voteStatus === 'down' && "text-vote-down bg-muted"
              )}
              onClick={(e) => handleVote('down', e)}
            >
              <ArrowBigDown size={20} className={cn(voteStatus === 'down' && "fill-current")} />
            </Button>
          </div>

          {/* Comments Button */}
          <Button 
            variant="secondary" 
            className="h-8 rounded-full px-3 gap-2 bg-secondary-background hover:bg-muted border border-transparent hover:border-border transition-all"
            onClick={() => !isDetail && navigate(`/post/${post.id}`)}
          >
            <MessageSquare size={18} />
            <span className="text-[12px] font-bold">{formatNumber(post.comments)}</span>
          </Button>

          {/* Award Button */}
          <Button variant="secondary" className="h-8 rounded-full px-3 bg-secondary-background hover:bg-muted border border-transparent hover:border-border transition-all">
            <Award size={18} />
          </Button>

          {/* Share Button */}
          <Button 
            variant="secondary" 
            className="h-8 rounded-full px-3 gap-2 bg-secondary-background hover:bg-muted border border-transparent hover:border-border transition-all"
            onClick={() => openShare(window.location.origin + `/post/${post.id}`)}
          >
            <Share2 size={18} />
            <span className="text-[12px] font-bold hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>
    </article>
  );
};
