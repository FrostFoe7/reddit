import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, MoreHorizontal, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification: n, onMarkRead }: NotificationItemProps) {
  return (
    <div
      className={cn(
        'p-5 sm:p-6 flex gap-4 hover:bg-muted/50 transition-all cursor-pointer group relative border-b border-border/50',
        !n.is_read && 'bg-primary/[0.03]',
      )}
    >
      {!n.is_read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
      <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-muted flex items-center justify-center shrink-0 relative shadow-sm border border-border/50">
        {n.type === 'reply' ? (
          <>
            <Avatar className="w-full h-full">
              <AvatarImage src={n.actor_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.user}`} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-white bg-green-500 shadow-sm">
              <MessageSquare size={12} fill="currentColor" />
            </div>
          </>
        ) : (
          <div className={cn('w-full h-full rounded-full flex items-center justify-center text-white shadow-inner', n.color)}>
            <TrendingUp size={24} className="sm:size-6" />
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="flex justify-between items-start mb-1 gap-2">
          <p className="text-sm sm:text-base text-foreground leading-snug pr-4">
            <span className="font-bold tracking-tight text-foreground">{n.user || n.actor_name || 'System'}</span> {n.text}
          </p>
          <span className="text-xs text-muted-foreground whitespace-nowrap font-bold opacity-60 hidden sm:block">
            {n.time ? new Date(n.time).toLocaleString() : ''}
          </span>
        </div>
        <div className="flex gap-4">
          {!n.is_read && (
            <button className="text-xs font-bold text-primary hover:underline" onClick={() => onMarkRead(n.id)}>
              Mark read
            </button>
          )}
          <button className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors" onClick={() => onMarkRead(n.id)}>
            Dismiss
          </button>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="self-start opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-10 w-10 -mr-2" aria-label="Notification actions">
        <MoreHorizontal size={20} />
      </Button>
    </div>
  );
}
