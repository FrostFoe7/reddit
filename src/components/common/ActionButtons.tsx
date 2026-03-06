import React from 'react';
import { MessageSquare, Share2, Award, MoreHorizontal, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUIStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface ActionButtonsProps {
  id: string;
  type: 'post' | 'comment';
  commentsCount?: number;
  onCommentClick?: (e: React.MouseEvent) => void;
  showShareLabel?: boolean;
  className?: string;
  url?: string;
}

const formatNumber = (num: number) => (num > 999 ? (num / 1000).toFixed(1) + 'k' : num);

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  id,
  type,
  commentsCount,
  onCommentClick,
  showShareLabel = false,
  className,
  url,
}) => {
  const { openShare, openReport } = useUIStore();
  const shareUrl = url || `${window.location.origin}/${type}/${id}`;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {type === 'post' && commentsCount !== undefined && (
        <Button
          variant="secondary"
          className="h-8 rounded-full px-3 gap-2 bg-secondary-background hover:bg-muted border border-transparent hover:border-border transition-all"
          onClick={onCommentClick}
        >
          <MessageSquare size={18} />
          <span className="text-xs font-bold">{formatNumber(commentsCount)}</span>
        </Button>
      )}

      {type === 'comment' && (
        <Button
          variant="ghost"
          className="h-8 rounded-full px-3 gap-2 hover:bg-muted"
          onClick={onCommentClick}
        >
          <MessageSquare size={18} />
          <span className="text-xs font-bold">Reply</span>
        </Button>
      )}

      <Button
        variant="secondary"
        className="h-8 rounded-full px-3 bg-secondary-background hover:bg-muted border border-transparent hover:border-border transition-all"
      >
        <Award size={18} />
      </Button>

      <Button
        variant="secondary"
        className="h-8 rounded-full px-3 gap-2 bg-secondary-background hover:bg-muted border border-transparent hover:border-border transition-all"
        onClick={e => {
          e.stopPropagation();
          openShare(shareUrl);
        }}
      >
        <Share2 size={18} />
        {showShareLabel && <span className="text-xs font-bold">Share</span>}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted"
          >
            <MoreHorizontal size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl">
          <DropdownMenuItem onClick={() => openShare(shareUrl)}>
            <Share2 size={16} className="mr-2" /> Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openReport(id)}>
            <Flag size={16} className="mr-2" /> Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
