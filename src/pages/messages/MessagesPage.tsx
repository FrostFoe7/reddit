import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Plus,
  ChevronLeft,
  MoreHorizontal,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConversations, useMessages, useSendMessage } from '@/hooks';
import { useAuthStore } from '@/store/useStore';
import dayjs from '@/lib/dayjs';
import type { Conversation, Message } from '@/types';
import { ConversationList } from '@/pages/messages/components/ConversationList';
import { MessageComposer } from '@/pages/messages/components/MessageComposer';
import { ListSkeleton } from '@/components/common/ListSkeleton';

export const MessagesPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const user = useAuthStore(state => state.user);

  const {
    data: conversations = [],
    isLoading: convLoading,
    error: convError,
  } = useConversations();
  const { data: messages = [], isLoading: msgLoading, error: msgError } = useMessages(selectedId);
  const { mutate: sendMessage } = useSendMessage();

  const selectedConversation = conversations.find((c: Conversation) => c.id === selectedId);

  const handleSend = () => {
    if (!messageText.trim() || !selectedId) return;
    sendMessage({
      conversation_id: selectedId,
      content: messageText,
    });
    setMessageText('');
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold">Please login to view messages</h2>
      </div>
    );
  }

  return (
    <div id="view-messages" className="view-section active">
      <div className="bg-card sm:border border-border sm:rounded-[32px] shadow-sm overflow-hidden flex h-[calc(100vh-110px)] sm:h-[75vh] min-h-[500px] relative">
        {/* Contacts List */}
        <div
          className={cn(
            'w-full sm:w-[340px] flex flex-col border-r border-border shrink-0 transition-transform duration-300',
            selectedId && 'hidden sm:flex',
          )}
        >
          <div className="p-5 border-b border-border flex justify-between items-center bg-card z-10">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Messages</h2>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-muted text-foreground hover:bg-muted/80 h-10 w-10"
            >
              <Plus size={20} />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-border">
            {convLoading ? (
              <div className="p-4">
                <ListSkeleton count={4} />
              </div>
            ) : convError ? (
              <div className="p-8 text-center text-destructive">Failed to load conversations</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No conversations yet</div>
            ) : (
              <ConversationList
                conversations={conversations}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>
        </div>

        {/* Conversation View */}
        <div
          className={cn(
            'flex-1 flex flex-col bg-background relative transition-transform duration-300',
            !selectedId && 'hidden sm:flex',
          )}
        >
          {selectedId ? (
            <>
              {/* Chat Header */}
              <div className="p-3 sm:p-4 border-b border-border bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:hidden rounded-full -ml-2"
                    onClick={() => setSelectedId(null)}
                  >
                    <ChevronLeft size={24} />
                  </Button>
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border border-border">
                    <AvatarImage
                      src={
                        selectedConversation?.contact_avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedConversation?.contact_name}`
                      }
                    />
                    <AvatarFallback>{selectedConversation?.contact_name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-bold text-foreground leading-tight">
                      {selectedConversation?.contact_name}
                    </span>
                    <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Online
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal size={20} className="text-muted-foreground" />
                </Button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/5">
                {msgLoading ? (
                  <div className="text-center">Loading messages...</div>
                ) : msgError ? (
                  <div className="text-center text-destructive">Failed to load messages</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground">No messages in this conversation yet</div>
                ) : (
                  messages.map((msg: Message) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex',
                        msg.sender_id === user.id ? 'justify-end' : 'justify-start',
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] px-4 py-2.5 rounded-[18px] shadow-sm',
                          msg.sender_id === user.id
                            ? 'bg-primary text-primary-foreground rounded-br-none shadow-md'
                            : 'bg-card border border-border rounded-bl-none shadow-sm',
                        )}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <span
                          className={cn(
                            'text-[11px] mt-1 block font-medium opacity-70',
                            msg.sender_id === user.id
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground',
                          )}
                        >
                          {dayjs(msg.created_at).format('h:mm A')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 sm:p-4 bg-card border-t border-border">
                <MessageComposer value={messageText} onChange={setMessageText} onSubmit={handleSend} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Your Messages</h3>
              <p className="text-muted-foreground font-medium text-sm mt-2 max-w-72">
                Send private photos and messages to a friend or group.
              </p>
              <Button className="mt-6 rounded-full px-8 font-bold bg-primary text-primary-foreground">
                Send Message
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
