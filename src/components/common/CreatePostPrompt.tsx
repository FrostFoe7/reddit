import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CreatePostPromptProps {
  className?: string;
}

export const CreatePostPrompt: React.FC<CreatePostPromptProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <div 
        className={cn(
          "hidden sm:flex items-center gap-4 p-4.5 bg-card border border-border rounded-[24px] shadow-ios-subtle dark:shadow-none transition-all duration-400 cursor-pointer group",
          className
        )}
        onClick={() => navigate('/create')}
      >
        <Avatar className="h-11 w-11 shrink-0 shadow-sm border border-border">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ff4500" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 bg-background border border-transparent group-hover:border-border transition-colors rounded-full h-12 px-5 flex items-center text-[15px] text-muted-foreground font-medium">
          Create Post
        </div>
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => navigate('/create?type=image')}>
                <ImageIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create Image Post</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => navigate('/create?type=link')}>
                <LinkIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create Link Post</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
