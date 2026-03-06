import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import dayjs from '@/lib/dayjs';
import type { Conversation } from '@/types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-border">
      {conversations.map(conv => (
        <div
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={cn(
            'p-5 flex gap-4 hover:bg-muted transition-colors cursor-pointer relative',
            selectedId === conv.id ? 'bg-primary/5 sm:bg-muted' : 'bg-card',
          )}
        >
          <Avatar className="w-12 h-12 shrink-0 border border-border">
            <AvatarImage
              src={
                conv.contact_avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.contact_name}`
              }
            />
            <AvatarFallback>{conv.contact_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-1">
              <span className="text-base font-bold text-foreground truncate">{conv.contact_name}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2 font-medium">
                {conv.time ? dayjs(conv.time).format('h:mm A') : ''}
              </span>
            </div>
            <p className="text-sm truncate font-medium text-muted-foreground">
              {conv.last_msg || 'No messages yet'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
