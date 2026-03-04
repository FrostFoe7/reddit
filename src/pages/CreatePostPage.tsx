import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  ChevronDown, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  BarChart2, 
  Type, 
  Info,
  Plus,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockCommunities } from '@/db/db';
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
import { toast } from 'sonner';

export const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const [open, setOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<typeof mockCommunities[0] | null>(null);
  
  const navigate = useNavigate();

  const handlePost = () => {
    if (!selectedCommunity) {
      toast.error('Please select a community first');
      return;
    }
    toast.success('Post submitted successfully!');
    console.log('Posting:', { title, body, type: activeTab, community: selectedCommunity.id });
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div id="view-create" className="px-0 sm:px-0 max-w-[760px] mx-auto">
      <div className="mb-4 sm:mb-6 px-4 sm:px-0 flex items-center justify-between border-b border-border pb-4">
        <h1 className="text-[20px] sm:text-[24px] font-bold text-foreground tracking-tight">Create post</h1>
        <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10 rounded-full px-4 h-9 text-[14px]">
          Drafts <span className="ml-1.5 bg-primary/10 px-2 py-0.5 rounded-full text-[12px]">0</span>
        </Button>
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
                className="flex items-center justify-between w-full sm:w-[320px] bg-card border border-border rounded-[20px] px-4 py-6 h-12 transition-all hover:border-primary group shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  {selectedCommunity ? (
                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm", selectedCommunity.icon)}>
                      r/
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground border border-dashed border-muted-foreground/50 group-hover:border-primary group-hover:text-primary transition-colors">
                      r/
                    </div>
                  )}
                  <span className={cn(
                    "text-[14px] font-bold transition-colors",
                    selectedCommunity ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {selectedCommunity ? `r/${selectedCommunity.name}` : "Select a community"}
                  </span>
                </div>
                <ChevronDown size={20} className="text-muted-foreground group-hover:text-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)] p-0 rounded-[20px] shadow-ios-float border-border overflow-hidden" 
              align="start"
              sideOffset={6}
            >
              <Command className="bg-card">
                <CommandInput placeholder="Search communities..." className="h-11 font-medium border-none focus:ring-0" />
                <CommandList className="max-h-[300px] no-scrollbar">
                  <CommandEmpty className="p-4 text-[14px] text-muted-foreground font-medium text-center">No community found.</CommandEmpty>
                  <CommandGroup heading="Your Communities" className="px-2 pt-2 pb-4">
                    {mockCommunities.map((community) => (
                      <CommandItem
                        key={community.id}
                        value={community.name}
                        onSelect={() => {
                          setSelectedCommunity(community);
                          setOpen(false);
                        }}
                        className="rounded-[12px] px-3 py-2.5 flex items-center gap-3 cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary transition-colors"
                      >
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm", community.icon)}>
                          r/
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-bold text-[14px] truncate">r/{community.name}</span>
                          <span className="text-[12px] text-muted-foreground truncate">{community.members} members</span>
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
        <div className="bg-card border border-border rounded-[16px] sm:rounded-[20px] shadow-sm overflow-hidden">
          <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
            <TabsList variant="line" className="w-full grid grid-cols-4">
              <TabsTrigger 
                value="text" 
                className="flex items-center justify-center gap-2 font-bold text-[14px]"
              >
                <Type size={20} />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="flex items-center justify-center gap-2 font-bold text-[14px]"
              >
                <ImageIcon size={20} />
                <span className="hidden sm:inline">Images & Video</span>
              </TabsTrigger>
              <TabsTrigger 
                value="link" 
                className="flex items-center justify-center gap-2 font-bold text-[14px]"
              >
                <LinkIcon size={20} />
                <span className="hidden sm:inline">Link</span>
              </TabsTrigger>
              <TabsTrigger 
                value="poll" 
                disabled
                className="flex items-center justify-center gap-2 font-bold text-[14px]"
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
                  className="w-full bg-card border border-border rounded-[12px] px-4 py-3.5 min-h-[56px] h-auto text-[16px] sm:text-[18px] font-bold text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary transition-all resize-none overflow-hidden shadow-sm"
                  rows={1}
                />
                <div className="absolute right-3 bottom-2 text-[11px] text-muted-foreground font-bold pointer-events-none opacity-60">
                  {title.length}/300
                </div>
              </div>

              {/* Dynamic Content based on Tab */}
              <TabsContent value="text" className="mt-0 space-y-4">
                <div className="border border-border rounded-[12px] overflow-hidden focus-within:border-primary/50 transition-all shadow-sm">
                  <div className="bg-muted/30 p-2 flex items-center gap-1 border-b border-border overflow-x-auto no-scrollbar">
                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-[8px] hover:bg-muted font-bold">B</Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-[8px] hover:bg-muted italic font-serif">i</Button>
                    <div className="w-[1px] h-4 bg-border mx-1 shrink-0"></div>
                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-[8px] hover:bg-muted"><LinkIcon size={16} /></Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-[8px] hover:bg-muted"><ImageIcon size={16} /></Button>
                    <div className="w-[1px] h-4 bg-border mx-1 shrink-0"></div>
                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-[8px] hover:bg-muted"><BarChart2 size={16} /></Button>
                  </div>
                  <Textarea 
                    placeholder="Body text (optional)" 
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full bg-transparent border-0 rounded-none min-h-[180px] sm:min-h-[240px] p-4 text-[15px] text-foreground placeholder:text-muted-foreground focus-visible:ring-0 leading-relaxed resize-y"
                  />
                </div>
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <div className="border border-dashed border-border rounded-[16px] min-h-[240px] sm:min-h-[300px] flex flex-col items-center justify-center p-6 sm:p-10 gap-4 bg-muted/10 hover:bg-muted/20 transition-all cursor-pointer group active:scale-[0.99]">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <Plus size={28} className="text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] sm:text-[18px] font-bold">Drag and drop images or video</p>
                    <p className="text-[14px] text-muted-foreground font-medium mt-1">Upload up to 20 images or videos</p>
                  </div>
                  <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/5 font-bold h-10 px-8 mt-2 shadow-sm">Upload</Button>
                </div>
              </TabsContent>

              <TabsContent value="link" className="mt-0">
                <Textarea 
                  placeholder="URL" 
                  className="w-full bg-card border border-border rounded-[12px] px-4 py-3.5 min-h-[56px] text-[15px] text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary transition-all resize-none shadow-sm"
                  rows={1}
                />
              </TabsContent>
            </div>

            {/* Tags/Flair Area */}
            <div className="px-3 sm:px-5 pb-5 flex flex-wrap gap-2">
              <Button variant="secondary" className="rounded-full h-9 px-4 text-[13px] font-bold bg-muted hover:bg-muted/80 flex items-center gap-2 transition-all active:scale-[0.95]">
                <Plus size={16} /> OC
              </Button>
              <Button variant="secondary" className="rounded-full h-9 px-4 text-[13px] font-bold bg-muted hover:bg-muted/80 flex items-center gap-2 transition-all active:scale-[0.95]">
                <Plus size={16} /> Spoiler
              </Button>
              <Button variant="secondary" className="rounded-full h-9 px-4 text-[13px] font-bold bg-muted hover:bg-muted/80 flex items-center gap-2 transition-all active:scale-[0.95]">
                <Plus size={16} /> NSFW
              </Button>
              <Button variant="secondary" className="rounded-full h-9 px-4 text-[13px] font-bold bg-muted hover:bg-muted/80 flex items-center gap-2 transition-all active:scale-[0.95]">
                <Plus size={16} /> Flair
              </Button>
            </div>

            {/* Bottom Bar */}
            <div className="p-4 sm:p-5 bg-muted/20 border-t border-border flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Info size={18} className="text-muted-foreground" />
                <span className="text-[12px] sm:text-[13px] text-muted-foreground font-medium">Drafts are saved automatically</span>
              </div>
              <div className="flex gap-3 ml-auto">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)} 
                  className="px-6 h-10 rounded-full font-bold text-[14px] border-primary text-primary hover:bg-primary/5 shadow-sm transition-all active:scale-[0.95]"
                >
                  Save Draft
                </Button>
                <Button 
                  disabled={!title.trim()}
                  onClick={handlePost}
                  className={cn(
                    "px-10 h-10 rounded-full font-bold text-[14px] shadow-md transition-all active:scale-[0.95]",
                    title.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  )}
                >
                  Post
                </Button>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Post Options */}
        <div className="flex flex-col gap-2 bg-card border border-border rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 shadow-sm mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[15px] font-bold">Post as profile</span>
              <span className="text-[13px] text-muted-foreground font-medium leading-relaxed">Your post will be visible to your followers and on your profile.</span>
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
