import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  MoreHorizontal,
  Share2,
  Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Post } from '@/db/db';
import { cn } from '@/lib/utils';
import { useOverlays } from '@/components/common/GlobalOverlays';
import { VoteControl } from '@/components/common/VoteControl';
import { ActionButtons } from '@/components/common/ActionButtons';

interface PostCardProps {
  post: Post;
  isDetail?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, isDetail = false }) => {
  const navigate = useNavigate();
  const { openShare, openReport, openLightbox } = useOverlays();

  return (
    <article 
      className={cn(
        "w-full group bg-background transition-colors cursor-pointer",
        isDetail ? "" : "hover:bg-neutral-100 dark:hover:bg-neutral-900/50 sm:rounded-[16px] px-4 py-3 my-1"
      )}
      onClick={() => !isDetail && navigate(`/post/${post.id}`)}
    >
      <div className="flex flex-col">
        {/* Credit Bar / PDP Header */}
        {isDetail ? (
          <div id="pdp-credit-bar" className="flex justify-between text-[12px] px-4 sm:px-0 relative pb-2 pt-4">
            <span className="flex gap-2 items-center pr-2 truncate">
              <Button 
                variant="secondary" 
                size="icon" 
                className="hidden sm:flex w-8 h-8 rounded-full shrink-0"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={16} />
              </Button>
              
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.sub}&backgroundColor=ff4500`} />
                <AvatarFallback className={cn("text-[10px] font-bold text-white shadow-sm", post.subIcon)}>r/</AvatarFallback>
              </Avatar>

              <div className="flex flex-col truncate">
                <span className="flex items-center gap-1 flex-nowrap">
                  <Link to={`/r/${post.sub}`} className="font-bold text-foreground hover:underline">r/{post.sub}</Link>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground whitespace-nowrap">{post.time}</span>
                </span>
                <span className="text-muted-foreground truncate hover:underline" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/u/${post.author}`);
                }}>
                  {post.author}
                </span>
              </div>
            </span>

            <div className="flex items-center gap-1 shrink-0">
              <Button variant="secondary" size="sm" className="h-8 rounded-full font-bold px-4 text-[12px] bg-primary text-primary-foreground hover:bg-primary/90">
                Join
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted">
                    <MoreHorizontal size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-[12px]">
                  <DropdownMenuItem onClick={() => openShare(window.location.origin + `/post/${post.id}`)}>
                    <Share2 size={16} className="mr-2" /> Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openReport(post.id)}>
                    <Flag size={16} className="mr-2" /> Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[12px] min-h-[32px] mb-1">
            <div className="flex items-center gap-1.5 min-w-0 relative z-10" onClick={(e) => e.stopPropagation()}>
              <Link to={`/r/${post.sub}`} className="flex items-center gap-1.5 hover:underline group/sub">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.sub}&backgroundColor=ff4500`} />
                  <AvatarFallback className={cn("text-[10px] font-bold text-white shadow-sm", post.subIcon)}>r/</AvatarFallback>
                </Avatar>
                <span className="font-bold text-foreground">r/{post.sub}</span>
              </Link>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground whitespace-nowrap">{post.time}</span>
            </div>
            
            <div className="flex items-center gap-1 relative z-10" onClick={(e) => e.stopPropagation()}>
              <Button variant="secondary" size="sm" className="h-7 rounded-full font-bold px-3 text-[12px] bg-primary text-primary-foreground hover:bg-primary/90">
                Join
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted">
                <MoreHorizontal size={18} />
              </Button>
            </div>
          </div>
        )}

        <h1 className={cn(
          "font-semibold text-foreground leading-tight tracking-tight px-4 sm:px-0",
          isDetail ? "text-[22px] sm:text-[24px] mt-2 mb-3" : "text-[18px] mb-1"
        )}>
          {post.title}
        </h1>

        {post.content && (
          <div className={cn(
            "text-[14px] leading-relaxed text-foreground px-4 sm:px-0",
            !isDetail && "line-clamp-3 text-muted-foreground"
          )}>
            {post.content}
          </div>
        )}

        {post.image && (
          <div 
            className={cn(
              "relative overflow-hidden bg-black group/media mt-3",
              isDetail ? "sm:rounded-[16px] border-y sm:border border-border" : "rounded-[16px] border border-border"
            )}
            onClick={(e) => {
              if (!isDetail) return;
              e.stopPropagation();
              openLightbox(post.image!);
            }}
          >
            <div className="aspect-video w-full flex items-center justify-center overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-contain transition-transform group-hover/media:scale-[1.01]" 
                loading="lazy"
              />
            </div>
          </div>
        )}

        <div className={cn(
          "flex items-center gap-2 mt-3 relative z-10 px-4 sm:px-0 pb-2",
          isDetail && "border-b border-border mb-2"
        )} onClick={(e) => e.stopPropagation()}>
          <VoteControl initialScore={post.upvotes} />
          
          <ActionButtons 
            id={post.id} 
            type="post" 
            commentsCount={post.comments} 
            showShareLabel={true}
            onCommentClick={() => !isDetail && navigate(`/post/${post.id}`)}
          />
        </div>
      </div>
    </article>
  );
};
