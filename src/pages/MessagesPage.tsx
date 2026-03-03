import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  return (
    <div id="view-messages" className="view-section active">
      <div className="bg-card sm:border border-border sm:rounded-[32px] shadow-sm overflow-hidden flex h-[calc(100vh-140px)] sm:h-[75vh] min-h-[500px]">
        <div className="w-full sm:w-[340px] flex flex-col border-r border-border shrink-0">
          <div className="p-5 border-b border-border flex justify-between items-center bg-card z-10">
            <h2 className="text-[22px] font-bold text-foreground tracking-tight">Messages</h2>
            <Button variant="ghost" size="icon" className="rounded-full bg-muted text-foreground">
              <Plus size={20} />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-border">
            <div className="p-5 flex gap-4 hover:bg-muted transition-colors cursor-pointer bg-primary/5">
              <Avatar className="w-[48px] h-[48px] shrink-0 border border-border">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[16px] font-bold text-foreground truncate">Alex_Dev</span>
                  <span className="text-[13px] text-muted-foreground whitespace-nowrap ml-2 font-medium">12:30 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[15px] text-muted-foreground truncate font-medium text-foreground">Sure, I can send over the repo link.</p>
                  <div className="w-2.5 h-2.5 bg-primary rounded-full shrink-0 ml-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex flex-1 flex-col bg-background relative">
          <div className="flex-1 flex items-center justify-center text-muted-foreground font-medium text-[16px]">
            Select a conversation
          </div>
        </div>
      </div>
    </div>
  );
};
