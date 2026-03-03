import React, { useState } from 'react';
import { mockNotifications } from '@/db/db';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, TrendingUp, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div id="view-notifications" className="view-section active">
      <div className="px-4 sm:px-0 mb-6 flex items-center justify-between">
        <h1 className="text-[28px] sm:text-[32px] font-bold text-foreground tracking-tight">Notifications</h1>
        <Button 
          variant="ghost" 
          onClick={markAllRead}
          className="text-[15px] font-semibold text-primary hover:text-foreground transition-colors p-2 bg-primary/10 rounded-full px-4"
        >
          Mark all read
        </Button>
      </div>
      
      <div className="flex gap-2 mb-6 px-4 sm:px-0 overflow-x-auto no-scrollbar">
        <Button variant="ghost" className="px-5 py-2.5 bg-foreground text-background rounded-full text-[15px] font-semibold whitespace-nowrap">
          All
        </Button>
        <Button variant="ghost" className="px-5 py-2.5 bg-muted text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-[15px] font-semibold whitespace-nowrap transition-colors">
          Mentions
        </Button>
        <Button variant="ghost" className="px-5 py-2.5 bg-muted text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-[15px] font-semibold whitespace-nowrap transition-colors">
          Replies
        </Button>
      </div>

      <div className="bg-card border-y sm:border border-border sm:rounded-[32px] shadow-sm overflow-hidden divide-y divide-border">
        {notifications.map(n => (
          <div key={n.id} className={cn("p-5 flex gap-4 hover:bg-muted transition-colors cursor-pointer group", !n.isRead && "bg-primary/5")}>
            <div className="w-[52px] h-[52px] sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center shrink-0 relative shadow-sm border border-border">
              {n.type === 'reply' ? (
                <>
                  <Avatar className="w-full h-full">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${n.user}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className={cn("absolute -bottom-1 -right-1 w-6 h-6 sm:w-6 sm:h-6 rounded-full border-2 border-card flex items-center justify-center text-white bg-green-500")}>
                    <MessageSquare size={12} fill="currentColor" />
                  </div>
                </>
              ) : (
                <div className={cn("w-full h-full rounded-full flex items-center justify-center text-white", n.color)}>
                  <TrendingUp size={24} className="sm:size-5" />
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[16px] sm:text-[15px] text-foreground leading-tight pr-4">
                  {n.type === 'reply' ? (
                    <><span className="font-bold tracking-tight">{n.user}</span> replied to your comment in <span className="font-bold">r/{n.sub}</span></>
                  ) : (
                    <>Trending in <span className="font-bold">r/{n.sub}</span></>
                  )}
                </p>
                {!n.isRead && <div className="w-2.5 h-2.5 bg-primary rounded-full shrink-0 mt-1.5 shadow-sm"></div>}
              </div>
              <p className="text-[15px] sm:text-[14px] text-muted-foreground line-clamp-2 mb-1.5 font-medium leading-relaxed">"{n.text}"</p>
              <p className="text-[13px] sm:text-[12px] text-muted-foreground opacity-70 font-bold uppercase tracking-wider">{n.time}</p>
            </div>
            <Button variant="ghost" size="icon" className="self-start opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal size={20} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
