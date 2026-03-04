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
import { ActionButtons } from '@/components/common/ActionButtons';
import { cn } from '@/lib/utils';
import { useOverlays } from '@/components/common/GlobalOverlays';
import { VoteControl } from '@/components/common/VoteControl';

interface PostCardProps {
  post: Post;
  isDetail?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, isDetail = false }) => {
  const navigate = useNavigate();
  const { openShare, openReport, openLightbox } = useOverlays();
  const [isJoined, setIsJoined] = React.useState(false);

  // Normalize data between mock and backend
  const subName = (post as any).subreddit_name || post.sub;
  const authorName = (post as any).author_username || post.author;
  const postUpvotes = (post as any).upvotes ?? 0;
  const postCommentCount = (post as any).comment_count ?? (post as any).comments ?? 0;
  const postTime = (post as any).created_at || post.time;
  const postImage = (post as any).image_url || post.image;
  const subIcon = (post as any).subreddit_icon || post.subIcon;

  const toggleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsJoined(!isJoined);
    import('sonner').then(({ toast }) => {
      toast.success(isJoined ? `Left r/${subName}` : `Joined r/${subName}`);
    });
  };

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
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${subName}&backgroundColor=ff4500`} />
                <AvatarFallback className={cn("text-[10px] font-bold text-white shadow-sm", subIcon)}>r/</AvatarFallback>
              </Avatar>

              <div className="flex flex-col truncate">
                <span className="flex items-center gap-1 flex-nowrap">
                  <Link to={`/r/${subName}`} className="font-bold text-foreground hover:underline">r/{subName}</Link>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground whitespace-nowrap">{postTime}</span>
                </span>
                <span className="text-muted-foreground truncate hover:underline" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/u/${authorName}`);
                }}>
                  {authorName}
                </span>
              </div>
            </span>

            <div className="flex items-center gap-1 shrink-0">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={toggleJoin}
                className={cn(
                  "h-8 rounded-full font-bold px-4 text-[12px] transition-all",
                  isJoined ? "bg-muted text-foreground border border-border" : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {isJoined ? "Joined" : "Join"}
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
              <Link to={`/r/${subName}`} className="flex items-center gap-1.5 hover:underline group/sub">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${subName}&backgroundColor=ff4500`} />
                  <AvatarFallback className={cn("text-[10px] font-bold text-white shadow-sm", subIcon)}>r/</AvatarFallback>
                </Avatar>
                <span className="font-bold text-foreground">r/{subName}</span>
              </Link>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground whitespace-nowrap">{postTime}</span>
            </div>
            
            <div className="flex items-center gap-1 relative z-10" onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={toggleJoin}
                className={cn(
                  "h-7 rounded-full font-bold px-3 text-[12px] transition-all",
                  isJoined ? "bg-muted text-foreground border border-border" : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {isJoined ? "Joined" : "Join"}
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

        {postImage && (
          <div 
            className={cn(
              "relative overflow-hidden bg-black group/media mt-3",
              isDetail ? "sm:rounded-[16px] border-y sm:border border-border" : "rounded-[16px] border border-border"
            )}
            onClick={(e) => {
              if (!isDetail) return;
              e.stopPropagation();
              openLightbox(postImage);
            }}
          >
            <div className="aspect-video w-full flex items-center justify-center overflow-hidden">
              <img 
                src={postImage} 
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
          <VoteControl initialScore={postUpvotes} />
          
          <ActionButtons 
            id={post.id} 
            type="post" 
            commentsCount={postCommentCount} 
            showShareLabel={true}
            onCommentClick={() => !isDetail && navigate(`/post/${post.id}`)}
          />
        </div>
      </div>
    </article>
  );
};
