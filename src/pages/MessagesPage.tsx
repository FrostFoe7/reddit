import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  ChevronLeft,
  Send,
  MoreHorizontal,
  Image as ImageIcon,
  Smile,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const MessagesPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const contacts = [
    {
      id: 1,
      name: "Alex_Dev",
      lastMsg: "Sure, I can send over the repo link.",
      time: "12:30 PM",
      unread: true,
      avatar: "Alex",
    },
    {
      id: 2,
      name: "stuckyfeet",
      lastMsg: "Did you see the new update?",
      time: "10:15 AM",
      unread: false,
      avatar: "stucky",
    },
    {
      id: 3,
      name: "doctor-_-atomic",
      lastMsg: "The server is back up now.",
      time: "Yesterday",
      unread: false,
      avatar: "atomic",
    },
  ];

  const selectedContact = contacts.find((c) => c.id === selectedId);

  return (
    <div id="view-messages" className="view-section active">
      <div className="bg-card sm:border border-border sm:rounded-[32px] shadow-sm overflow-hidden flex h-[calc(100vh-110px)] sm:h-[75vh] min-h-[500px] relative">
        {/* Contacts List */}
        <div
          className={cn(
            "w-full sm:w-[340px] flex flex-col border-r border-border shrink-0 transition-transform duration-300",
            selectedId && "hidden sm:flex",
          )}
        >
          <div className="p-5 border-b border-border flex justify-between items-center bg-card z-10">
            <h2 className="text-[22px] font-bold text-foreground tracking-tight">
              Messages
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-muted text-foreground hover:bg-muted/80 h-10 w-10"
            >
              <Plus size={20} />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-border">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedId(contact.id)}
                className={cn(
                  "p-5 flex gap-4 hover:bg-muted transition-colors cursor-pointer relative",
                  selectedId === contact.id
                    ? "bg-primary/5 sm:bg-muted"
                    : "bg-card",
                  contact.unread &&
                    !selectedId &&
                    "after:content-[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-primary",
                )}
              >
                <Avatar className="w-[48px] h-[48px] shrink-0 border border-border">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.avatar}`}
                  />
                  <AvatarFallback>{contact.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[16px] font-bold text-foreground truncate">
                      {contact.name}
                    </span>
                    <span className="text-[13px] text-muted-foreground whitespace-nowrap ml-2 font-medium">
                      {contact.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p
                      className={cn(
                        "text-[14px] truncate font-medium",
                        contact.unread
                          ? "text-foreground font-bold"
                          : "text-muted-foreground",
                      )}
                    >
                      {contact.lastMsg}
                    </p>
                    {contact.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full shrink-0 ml-2"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation View */}
        <div
          className={cn(
            "flex-1 flex flex-col bg-background relative transition-transform duration-300",
            !selectedId && "hidden sm:flex",
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
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedContact?.avatar}`}
                    />
                    <AvatarFallback>{selectedContact?.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-[15px] sm:text-[16px] font-bold text-foreground leading-tight">
                      {selectedContact?.name}
                    </span>
                    <span className="text-[12px] text-green-500 font-bold flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>{" "}
                      Online
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal size={20} className="text-muted-foreground" />
                </Button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/5">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Avatar className="w-16 h-16 mb-3 border-2 border-border shadow-sm">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedContact?.avatar}`}
                    />
                  </Avatar>
                  <h3 className="font-bold text-[18px]">
                    {selectedContact?.name}
                  </h3>
                  <p className="text-[13px] text-muted-foreground max-w-[200px] mt-1">
                    You've been friends on Reddit for 2 years
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 rounded-full h-8 text-[12px] font-bold border-primary text-primary hover:bg-primary/5"
                  >
                    View Profile
                  </Button>
                </div>

                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-[18px] rounded-bl-none px-4 py-2.5 max-w-[80%] shadow-sm">
                    <p className="text-[15px] leading-relaxed text-foreground">
                      {selectedContact?.lastMsg}
                    </p>
                    <span className="text-[11px] text-muted-foreground mt-1 block font-medium opacity-70">
                      12:30 PM
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-[18px] rounded-br-none px-4 py-2.5 max-w-[80%] shadow-md">
                    <p className="text-[15px] leading-relaxed">
                      Hey! Thanks for getting back to me. I'll check it out
                      right away.
                    </p>
                    <span className="text-[11px] text-primary-foreground/70 mt-1 block font-medium">
                      12:35 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-3 sm:p-4 bg-card border-t border-border">
                <div className="flex items-center gap-2 bg-muted/50 rounded-[24px] px-3 py-1.5 border border-border focus-within:border-primary/50 transition-colors">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 shrink-0 text-muted-foreground hover:text-primary"
                  >
                    <ImageIcon size={20} />
                  </Button>
                  <input
                    type="text"
                    placeholder="Message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] py-1.5 px-1 outline-none text-foreground placeholder:text-muted-foreground"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 shrink-0 text-muted-foreground hover:text-primary"
                  >
                    <Smile size={20} />
                  </Button>
                  <Button
                    size="icon"
                    className="rounded-full h-9 w-9 shrink-0 bg-primary text-primary-foreground shadow-sm"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-[20px] font-bold text-foreground">
                Your Messages
              </h3>
              <p className="text-muted-foreground font-medium text-[15px] mt-2 max-w-[280px]">
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
