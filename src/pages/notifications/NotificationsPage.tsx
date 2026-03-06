import React from 'react';
import { useMarkNotificationRead, useMarkNotificationsRead, useNotifications } from '@/hooks';
import { Button } from '@/components/ui/button';
import { useVirtualizer } from '@tanstack/react-virtual';
import { NotificationItem } from '@/pages/notifications/components/NotificationItem';
import { ListSkeleton } from '@/components/common';

export const NotificationsPage: React.FC = () => {
  const { data: notifications = [], isLoading, error } = useNotifications();
  const markReadMutation = useMarkNotificationsRead();
  const markSingleReadMutation = useMarkNotificationRead();
  const listRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: notifications.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 140,
    overscan: 6,
  });

  const markAllRead = () => {
    markReadMutation.mutate();
  };

  const markOneRead = (notificationId: string) => {
    markSingleReadMutation.mutate(notificationId);
  };

  return (
    <div id="view-notifications" className="view-section active">
      <div className="px-4 sm:px-0 mb-6 flex items-center justify-between">
        <h1 className="text-3xl sm:text-3xl font-bold text-foreground tracking-tight">
          Notifications
        </h1>
        <Button
          variant="ghost"
          onClick={markAllRead}
          className="text-sm sm:text-sm font-bold text-primary hover:text-primary/80 transition-colors h-10 px-4 bg-primary/5 rounded-full hover:bg-primary/10"
        >
          Mark all read
        </Button>
      </div>

      <div className="flex gap-2.5 mb-6 px-4 sm:px-0 overflow-x-auto no-scrollbar pb-1">
        <Button
          variant="ghost"
          className="px-6 py-2 bg-foreground text-background rounded-full text-sm font-bold whitespace-nowrap shadow-md"
        >
          All
        </Button>
        <Button
          variant="ghost"
          className="px-6 py-2 bg-muted text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95"
        >
          Mentions
        </Button>
        <Button
          variant="ghost"
          className="px-6 py-2 bg-muted text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-sm font-bold whitespace-nowrap transition-all active:scale-95"
        >
          Replies
        </Button>
      </div>

      <div
        ref={listRef}
        className="bg-card border-y sm:border border-border sm:rounded-[32px] shadow-sm overflow-y-auto h-[calc(100vh-220px)]"
      >
        {isLoading && (
          <div className="p-6 space-y-4">
            <ListSkeleton count={4} />
          </div>
        )}
        {error && <div className="p-8 text-center text-destructive">Failed to load notifications.</div>}
        {!isLoading && !error && notifications.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">No notifications yet.</div>
        )}
        {!isLoading && notifications.length > 0 && (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map(virtualRow => {
              const n = notifications[virtualRow.index];
              return (
                <div
                  key={n.id}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <NotificationItem notification={n} onMarkRead={markOneRead} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 text-center pb-12">
        <Button
          variant="ghost"
          className="text-muted-foreground font-bold hover:text-primary transition-colors"
        >
          View older notifications
        </Button>
      </div>
    </div>
  );
};
