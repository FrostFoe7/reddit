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
          className="text-[14px] sm:text-[15px] font-bold text-primary hover:text-primary/80 transition-colors h-10 px-4 bg-primary/5 rounded-full hover:bg-primary/10"
        >
          Mark all read
        </Button>
      </div>
      
      <div className="flex gap-2.5 mb-6 px-4 sm:px-0 overflow-x-auto no-scrollbar pb-1">
        <Button variant="ghost" className="px-6 py-2 bg-foreground text-background rounded-full text-[14px] font-bold whitespace-nowrap shadow-md">
          All
        </Button>
        <Button variant="ghost" className="px-6 py-2 bg-muted text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-[14px] font-bold whitespace-nowrap transition-all active:scale-95">
          Mentions
        </Button>
        <Button variant="ghost" className="px-6 py-2 bg-muted text-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-[14px] font-bold whitespace-nowrap transition-all active:scale-95">
          Replies
        </Button>
      </div>

      <div className="bg-card border-y sm:border border-border sm:rounded-[32px] shadow-sm overflow-hidden divide-y divide-border/50">
        {notifications.map(n => (
          <div key={n.id} className={cn("p-5 sm:p-6 flex gap-4 hover:bg-muted/50 transition-all cursor-pointer group relative", !n.isRead && "bg-primary/[0.03]")}>
            {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
            
            <div className="w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] rounded-full bg-muted flex items-center justify-center shrink-0 relative shadow-sm border border-border/50">
              {n.type === 'reply' ? (
                <>
                  <Avatar className="w-full h-full">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${n.user}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className={cn("absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-white bg-green-500 shadow-sm")}>
                    <MessageSquare size={12} fill="currentColor" />
                  </div>
                </>
              ) : (
                <div className={cn("w-full h-full rounded-full flex items-center justify-center text-white shadow-inner", n.color)}>
                  <TrendingUp size={24} className="sm:size-6" />
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="flex justify-between items-start mb-1 gap-2">
                <p className="text-[15px] sm:text-[16px] text-foreground leading-snug pr-4">
                  {n.type === 'reply' ? (
                    <><span className="font-bold tracking-tight text-foreground">{n.user}</span> replied to your comment in <span className="font-bold text-foreground">r/{n.sub}</span></>
                  ) : (
                    <>Trending in <span className="font-bold text-foreground">r/{n.sub}</span></>
                  )}
                </p>
                <div className="flex items-center gap-2">
                   {!n.isRead && <div className="w-2.5 h-2.5 bg-primary rounded-full shrink-0 shadow-[0_0_8px_rgba(255,69,0,0.5)]"></div>}
                   <span className="text-[12px] text-muted-foreground whitespace-nowrap font-bold opacity-60 hidden sm:block">{n.time}</span>
                </div>
              </div>
              <p className="text-[14px] sm:text-[15px] text-muted-foreground line-clamp-2 mb-2 font-medium leading-relaxed bg-muted/30 p-2 sm:p-3 rounded-[12px] border border-border/30 italic">
                "{n.text}"
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest sm:hidden">{n.time}</span>
                <div className="flex gap-4">
                  <button className="text-[12px] font-bold text-primary hover:underline">Reply</button>
                  <button className="text-[12px] font-bold text-muted-foreground hover:text-foreground transition-colors">Dismiss</button>
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="self-start opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-10 w-10 -mr-2">
              <MoreHorizontal size={20} />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center pb-12">
        <Button variant="ghost" className="text-muted-foreground font-bold hover:text-primary transition-colors">
          View older notifications
        </Button>
      </div>
    </div>
  );
};
