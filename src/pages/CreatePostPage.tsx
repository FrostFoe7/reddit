import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown } from 'lucide-react';

export const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  return (
    <div id="view-create" className="px-0 sm:px-0">
      <div className="mb-6 px-4 sm:px-0 flex items-center justify-between">
        <h1 className="text-[28px] sm:text-[32px] font-bold text-text-primary tracking-tight">Create a post</h1>
      </div>
      <div className="bg-card border-y sm:border border-border-subtle sm:rounded-[32px] shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-border-subtle">
          <Button variant="outline" className="flex items-center justify-between w-full sm:w-[320px] bg-bg-primary border border-border-strong rounded-[16px] px-5 py-3.5 transition-colors hover:border-text-secondary">
            <span className="text-[16px] font-semibold text-text-primary">Choose a community</span>
            <ChevronDown size={20} className="text-text-secondary" />
          </Button>
        </div>
        <div className="p-4 sm:p-6 flex flex-col gap-4">
          <Input 
            type="text" 
            placeholder="Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-bg-primary border border-border-strong rounded-[16px] px-5 py-4 h-auto text-[18px] font-bold text-text-primary placeholder-text-secondary focus-visible:ring-1 focus-visible:ring-accent-primary transition-colors"
          />
          <Textarea 
            placeholder="Text (optional)" 
            className="w-full bg-bg-primary border border-border-strong rounded-[16px] min-h-[240px] p-5 text-[16px] text-text-primary placeholder-text-secondary focus-visible:ring-1 focus-visible:ring-accent-primary transition-colors leading-relaxed"
          />
        </div>
        <div className="p-5 sm:p-6 bg-primary/50 border-t border-border-subtle flex justify-end gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)} className="px-6 py-3 rounded-full font-semibold text-[15px] text-text-primary hover:bg-hover">
            Cancel
          </Button>
          <Button 
            disabled={!title.trim()}
            className={title.trim() ? "bg-accent-primary text-white hover:opacity-90 px-8 py-3 rounded-full font-semibold text-[15px] shadow-sm" : "bg-bg-tertiary text-text-secondary cursor-not-allowed px-8 py-3 rounded-full font-semibold text-[15px]"}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};
