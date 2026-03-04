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
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const navigate = useNavigate();

  const handlePost = () => {
    // Implement post logic
    console.log('Posting:', { title, body, type: activeTab });
  };

  return (
    <div id="view-create" className="px-0 sm:px-0 max-w-[760px] mx-auto">
      <div className="mb-6 px-4 sm:px-0 flex items-center justify-between border-b border-border pb-4">
        <h1 className="text-[20px] font-bold text-foreground">Create post</h1>
        <Button variant="ghost" className="text-primary font-bold hover:bg-muted rounded-full px-4 h-8 text-[14px]">
          Drafts <span className="ml-1.5 bg-muted-foreground/20 px-1.5 rounded text-[12px]">0</span>
        </Button>
      </div>

      <div className="flex flex-col gap-6 px-4 sm:px-0">
        {/* Community Picker */}
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            className="flex items-center justify-between w-full sm:w-[320px] bg-card border border-border rounded-[20px] px-4 py-6 h-10 transition-colors hover:border-primary group"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-dashed border-muted-foreground/50 group-hover:border-primary group-hover:text-primary">
                r/
              </div>
              <span className="text-[14px] font-bold text-muted-foreground group-hover:text-foreground">Select a community</span>
            </div>
            <ChevronDown size={20} className="text-muted-foreground group-hover:text-foreground" />
          </Button>
        </div>

        {/* Post Type Tabs */}
        <div className="bg-card border border-border rounded-[16px] shadow-sm overflow-hidden">
          <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full h-auto bg-transparent border-b border-border p-0 rounded-none grid grid-cols-4">
              <TabsTrigger 
                value="text" 
                className="flex items-center gap-2 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary transition-all font-bold text-[14px] h-full"
              >
                <Type size={20} />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="flex items-center gap-2 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary transition-all font-bold text-[14px] h-full"
              >
                <ImageIcon size={20} />
                <span className="hidden sm:inline">Images & Video</span>
              </TabsTrigger>
              <TabsTrigger 
                value="link" 
                className="flex items-center gap-2 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary transition-all font-bold text-[14px] h-full"
              >
                <LinkIcon size={20} />
                <span className="hidden sm:inline">Link</span>
              </TabsTrigger>
              <TabsTrigger 
                value="poll" 
                disabled
                className="flex items-center gap-2 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary transition-all font-bold text-[14px] h-full disabled:opacity-30"
              >
                <BarChart2 size={20} />
                <span className="hidden sm:inline">Poll</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-4 flex flex-col gap-4">
              {/* Title Field */}
              <div className="relative">
                <Textarea 
                  placeholder="Title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 300))}
                  className="w-full bg-card border border-border rounded-[8px] px-4 py-3 min-h-[56px] h-auto text-[18px] font-bold text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary transition-colors resize-none overflow-hidden"
                  rows={1}
                />
                <div className="absolute right-3 bottom-2 text-[12px] text-muted-foreground font-medium pointer-events-none">
                  {title.length}/300
                </div>
              </div>

              {/* Dynamic Content based on Tab */}
              <TabsContent value="text" className="mt-0 space-y-4">
                <div className="border border-border rounded-[8px] overflow-hidden focus-within:border-primary transition-colors">
                  <div className="bg-muted/30 p-2 flex items-center gap-1 border-b border-border">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[4px] hover:bg-muted font-bold">B</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[4px] hover:bg-muted italic font-serif">i</Button>
                    <div className="w-[1px] h-4 bg-border mx-1"></div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[4px] hover:bg-muted"><LinkIcon size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[4px] hover:bg-muted"><ImageIcon size={14} /></Button>
                    <div className="w-[1px] h-4 bg-border mx-1"></div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[4px] hover:bg-muted"><BarChart2 size={14} /></Button>
                  </div>
                  <Textarea 
                    placeholder="Body text (optional)" 
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full bg-transparent border-0 rounded-none min-h-[200px] p-4 text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:ring-0 leading-relaxed resize-y"
                  />
                </div>
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <div className="border border-dashed border-border rounded-[12px] min-h-[280px] flex flex-col items-center justify-center p-8 gap-4 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus size={24} className="text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-[16px] font-bold">Drag and drop images or video</p>
                    <p className="text-[14px] text-muted-foreground">Upload up to 20 images or videos</p>
                  </div>
                  <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/5 font-bold h-9">Upload</Button>
                </div>
              </TabsContent>

              <TabsContent value="link" className="mt-0">
                <Textarea 
                  placeholder="URL" 
                  className="w-full bg-card border border-border rounded-[8px] px-4 py-3 min-h-[56px] text-[14px] text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary transition-colors resize-none"
                  rows={1}
                />
              </TabsContent>
            </div>

            {/* Tags/Flair Area */}
            <div className="px-4 pb-4 flex flex-wrap gap-2">
              <Button variant="secondary" className="rounded-full h-8 px-3 text-[12px] font-bold bg-muted hover:bg-muted/80 flex items-center gap-1.5">
                <Plus size={14} /> OC
              </Button>
              <Button variant="secondary" className="rounded-full h-8 px-3 text-[12px] font-bold bg-muted hover:bg-muted/80 flex items-center gap-1.5">
                <Plus size={14} /> Spoiler
              </Button>
              <Button variant="secondary" className="rounded-full h-8 px-3 text-[12px] font-bold bg-muted hover:bg-muted/80 flex items-center gap-1.5">
                <Plus size={14} /> NSFW
              </Button>
              <Button variant="secondary" className="rounded-full h-8 px-3 text-[12px] font-bold bg-muted hover:bg-muted/80 flex items-center gap-1.5">
                <Plus size={14} /> Flair
              </Button>
            </div>

            {/* Bottom Bar */}
            <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-muted-foreground" />
                <span className="text-[12px] text-muted-foreground">Drafts are saved automatically</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(-1)} 
                  className="px-5 h-9 rounded-full font-bold text-[14px] border-primary text-primary hover:bg-primary/5"
                >
                  Save Draft
                </Button>
                <Button 
                  disabled={!title.trim()}
                  onClick={handlePost}
                  className={cn(
                    "px-8 h-9 rounded-full font-bold text-[14px] shadow-sm transition-all",
                    title.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  Post
                </Button>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Post Options */}
        <div className="flex flex-col gap-2 bg-card border border-border rounded-[16px] p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[14px] font-bold">Post as profile</span>
              <span className="text-[12px] text-muted-foreground">Your post will be visible to your followers and on your profile.</span>
            </div>
            <div className="w-10 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
