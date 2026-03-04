import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ChevronDown,
  Image as ImageIcon,
  Link as LinkIcon,
  BarChart2,
  Type,
  Info,
  Plus,
  Check,
  Bold,
  Italic,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommunities, useCreatePost } from "@/hooks";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { z } from 'zod';
import type { Community, Post } from "@/types";
import { useAuthStore } from "@/store/useStore";

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  content: z.string().optional(),
  subreddit_id: z.string().min(1, 'Please select a community'),
});

export const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const { data: communities } = useCommunities();
  const createPostMutation = useCreatePost();
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert focus:outline-none max-w-none min-h-[180px] p-4 text-sm',
      },
    },
  });

  const handlePost = () => {
    if (!user) {
        navigate("/login");
        return;
    }

    const content = editor?.getHTML() || "";
    
    const validation = postSchema.safeParse({
      title,
      content,
      subreddit_id: selectedCommunity?.id,
    });

    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    if (!selectedCommunity) return;

    createPostMutation.mutate(
      {
        id: Math.random().toString(36).substring(2, 5) + "-" + Math.random().toString(36).substring(2, 5) + "-" + Math.random().toString(36).substring(2, 5),
        title,
        content,
        subreddit_id: selectedCommunity.id,
        post_type: (activeTab === "media" ? "image" : activeTab) as Post['post_type'],
        author_id: user.id,
      },
      {
        onSuccess: () => {
          toast.success("Post submitted successfully!");
          setTimeout(() => navigate("/"), 1000);
        },
        onError: (err: Error) => {
          toast.error(err.message || "Failed to create post");
        }
      },
    );
  };

  return (
    <div id="view-create" className="px-0 sm:px-0 max-w-3xl mx-auto">
      <div className="mb-4 sm:mb-6 px-4 sm:px-0 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Create post
          </h1>
          <Button
            variant="ghost"
            className="text-primary font-bold hover:bg-primary/10 rounded-full px-4 h-9 text-sm"
          >
            Drafts{" "}
            <span className="ml-1.5 bg-primary/10 px-2 py-0.5 rounded-full text-xs">
              0
            </span>
          </Button>
        </div>
        <Separator />
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 px-4 sm:px-0">
        {/* Community Picker Popover */}
        <div className="flex flex-col gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="flex items-center justify-between w-full sm:w-80 bg-card border border-border rounded-[20px] px-4 py-6 h-12 transition-all hover:border-primary group shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  {selectedCommunity ? (
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm",
                        selectedCommunity.icon_url || "bg-primary",
                      )}
                    >
                      r/
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground border border-dashed border-muted-foreground/50 group-hover:border-primary group-hover:text-primary transition-colors">
                      r/
                    </div>
                  )}
                  <span
                    className={cn(
                      "text-sm font-bold transition-colors",
                      selectedCommunity
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {selectedCommunity
                      ? `r/${selectedCommunity.name}`
                      : "Select a community"}
                  </span>
                </div>
                <ChevronDown
                  size={20}
                  className="text-muted-foreground group-hover:text-foreground"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)] p-0 rounded-[20px] shadow-ios-float border-border overflow-hidden"
              align="start"
              sideOffset={6}
            >
              <Command className="bg-card">
                <CommandInput
                  placeholder="Search communities..."
                  className="h-11 font-medium border-none focus:ring-0"
                />
                <CommandList className="max-h-[300px] no-scrollbar">
                  <CommandEmpty className="p-4 text-sm text-muted-foreground font-medium text-center">
                    No community found.
                  </CommandEmpty>
                  <CommandGroup
                    heading="Your Communities"
                    className="px-2 pt-2 pb-4"
                  >
                    {communities?.map((community) => (
                      <CommandItem
                        key={community.id}
                        value={community.name}
                        onSelect={() => {
                          setSelectedCommunity(community);
                          setOpen(false);
                        }}
                        className="rounded-xl px-3 py-2.5 flex items-center gap-3 cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm",
                            community.icon_url || "bg-primary",
                          )}
                        >
                          r/
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-bold text-sm truncate">
                            r/{community.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {community.members || 0} members
                          </span>
                        </div>
                        {selectedCommunity?.id === community.id && (
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Post Type Tabs */}
        <div className="bg-card border border-border rounded-2xl sm:rounded-[20px] shadow-sm overflow-hidden">
          <Tabs
            defaultValue="text"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList variant="line" className="w-full grid grid-cols-4">
              <TabsTrigger
                value="text"
                className="flex items-center justify-center gap-2 font-bold text-sm"
              >
                <Type size={20} />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="flex items-center justify-center gap-2 font-bold text-sm"
              >
                <ImageIcon size={20} />
                <span className="hidden sm:inline">Images & Video</span>
              </TabsTrigger>
              <TabsTrigger
                value="link"
                className="flex items-center justify-center gap-2 font-bold text-sm"
              >
                <LinkIcon size={20} />
                <span className="hidden sm:inline">Link</span>
              </TabsTrigger>
              <TabsTrigger
                value="poll"
                disabled
                className="flex items-center justify-center gap-2 font-bold text-sm"
              >
                <BarChart2 size={20} />
                <span className="hidden sm:inline">Poll</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-3 sm:p-5 flex flex-col gap-4">
              {/* Title Field */}
              <div className="relative">
                <Textarea
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 300))}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3.5 min-h-14 h-auto text-base sm:text-lg font-bold text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary transition-all resize-none overflow-hidden shadow-sm"
                  rows={1}
                />
                <div className="absolute right-3 bottom-2 text-[11px] text-muted-foreground font-bold pointer-events-none opacity-60">
                  {title.length}/300
                </div>
              </div>

              {/* Dynamic Content based on Tab */}
              <TabsContent value="text" className="mt-0 space-y-4">
                <div className="border border-border rounded-xl overflow-hidden focus-within:border-primary/50 transition-all shadow-sm">
                  <div className="bg-muted/30 p-2 flex items-center gap-1 border-b border-border overflow-x-auto no-scrollbar">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-9 w-9 shrink-0 rounded-lg hover:bg-muted font-bold", editor?.isActive('bold') && "bg-muted")}
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                    >
                      <Bold size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-9 w-9 shrink-0 rounded-lg hover:bg-muted italic", editor?.isActive('italic') && "bg-muted")}
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                    >
                      <Italic size={16} />
                    </Button>
                    <div className="w-[1px] h-4 bg-border mx-1 shrink-0"></div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-9 w-9 shrink-0 rounded-lg hover:bg-muted", editor?.isActive('bulletList') && "bg-muted")}
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    >
                      <List size={16} />
                    </Button>
                  </div>
                  <EditorContent editor={editor} />
                </div>
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <div className="border border-dashed border-border rounded-2xl min-h-[240px] sm:min-h-[300px] flex flex-col items-center justify-center p-6 sm:p-10 gap-4 bg-muted/10 hover:bg-muted/20 transition-all cursor-pointer group active:scale-[0.99]">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Plus size={28} className="text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-base sm:text-lg font-bold">
                      Drag and drop images or video
                    </p>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                      Upload up to 20 images or videos
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-full border-primary text-primary hover:bg-primary/5 font-bold h-10 px-8 mt-2 shadow-sm"
                  >
                    Upload
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="link" className="mt-0">
                <Textarea
                  placeholder="URL"
                  className="w-full bg-card border border-border rounded-xl px-4 py-3.5 min-h-14 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary transition-all resize-none shadow-sm"
                  rows={1}
                />
              </TabsContent>
            </div>

            {/* Tags/Flair Area */}
            <div className="px-3 sm:px-5 pb-5 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="rounded-full h-9 px-4 text-xs font-bold bg-muted hover:bg-muted/80 flex items-center gap-2 transition-all active:scale-[0.95]"
              >
                <Plus size={16} /> OC
              </Button>
              <Button
                variant="secondary"
                className="rounded-full h-9 px-4 text-xs font-bold bg-muted hover:bg-muted/80 flex items-center gap-2 transition-all active:scale-[0.95]"
              >
                <Plus size={16} /> Spoiler
              </Button>
              <Button
                variant="secondary"
                className="rounded-full h-9 px-4 text-xs font-bold bg-muted hover:bg-muted/80 flex items-center gap-2 transition-all active:scale-[0.95]"
              >
                <Plus size={16} /> NSFW
              </Button>
              <Button
                variant="secondary"
                className="rounded-full h-9 px-4 text-xs font-bold bg-muted hover:bg-muted/80 flex items-center gap-2 transition-all active:scale-[0.95]"
              >
                <Plus size={16} /> Flair
              </Button>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col">
              <Separator />
              <div className="p-4 sm:p-5 bg-muted/20 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Info size={18} className="text-muted-foreground" />
                  <span className="text-xs sm:text-xs text-muted-foreground font-medium">
                    Drafts are saved automatically
                  </span>
                </div>
                <div className="flex gap-3 ml-auto">
                  <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="px-6 h-10 rounded-full font-bold text-sm border-primary text-primary hover:bg-primary/5 shadow-sm transition-all active:scale-[0.95]"
                  >
                    Save Draft
                  </Button>
                  <Button
                    disabled={!title.trim()}
                    onClick={handlePost}
                    className={cn(
                      "px-10 h-10 rounded-full font-bold text-sm shadow-md transition-all active:scale-[0.95]",
                      title.trim()
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
                    )}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Post Options */}
        <div className="flex flex-col gap-2 bg-card border border-border rounded-2xl sm:rounded-[20px] p-4 sm:p-5 shadow-sm mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-bold">Post as profile</span>
              <span className="text-xs text-muted-foreground font-medium leading-relaxed">
                Your post will be visible to your followers and on your profile.
              </span>
            </div>
            <div className="shrink-0">
              <div className="w-12 h-7 bg-primary rounded-full relative p-1 cursor-pointer shadow-inner">
                <div className="w-5 h-5 bg-white rounded-full absolute right-1 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
