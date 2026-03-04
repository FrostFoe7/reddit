import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CommentComposerProps {
  className?: string;
  placeholder?: string;
  onCancel?: () => void;
  onSubmit?: (content: string) => void;
}

export const CommentComposer: React.FC<CommentComposerProps> = ({ 
  className, 
  placeholder = "Join the conversation",
  onCancel,
  onSubmit 
}) => {
  return (
    <div className={cn("border border-border rounded-[20px] bg-background focus-within:border-muted-foreground transition-colors overflow-hidden", className)}>
      <textarea 
        className="w-full min-h-[44px] px-4 py-3 bg-transparent border-none focus:ring-0 resize-none text-[14px] placeholder:text-muted-foreground"
        placeholder={placeholder}
      />
      <div className="flex justify-between items-center px-2 py-2 bg-muted/10 border-t border-border/50">
        <div className="flex gap-1">
          {/* Formatting buttons would go here */}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full font-bold text-[12px]"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            size="sm" 
            className="rounded-full font-bold text-[12px] px-4"
            onClick={() => onSubmit && onSubmit('')} // Dummy call for now
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};
