import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Bold, Italic, Link as LinkIcon, List, Code } from 'lucide-react';

interface CommentComposerProps {
  className?: string;
  placeholder?: string;
  onCancel?: () => void;
  onSubmit?: (content: string) => void;
}

export const CommentComposer: React.FC<CommentComposerProps> = ({
  className,
  placeholder = 'What are your thoughts?',
  onCancel,
  onSubmit,
}) => {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!content.trim()) return;

    if (onSubmit) {
      onSubmit(content);
    } else {
      toast.success('Comment posted successfully!');
    }
    setContent('');
    setIsFocused(false);
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(44, textarea.scrollHeight)}px`;
    }
  }, [content]);

  return (
    <div
      className={cn(
        'border border-border rounded-3xl bg-card transition-all duration-300 shadow-sm overflow-hidden',
        isFocused
          ? 'border-primary/50 ring-1 ring-primary/10 shadow-md'
          : 'hover:border-neutral-400 dark:hover:border-neutral-600',
        className,
      )}
    >
      <textarea
        ref={textareaRef}
        value={content}
        onChange={e => setContent(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="w-full min-h-14 px-5 py-4 bg-transparent border-none focus:ring-0 resize-none text-sm text-foreground placeholder:text-muted-foreground leading-relaxed"
        placeholder={placeholder}
      />

      <div
        className={cn(
          'flex justify-between items-center px-3 py-2 bg-muted/20 border-t border-border/50 transition-all',
          !isFocused && !content && 'opacity-60 grayscale-[0.5]',
        )}
      >
        <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
          >
            <Bold size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
          >
            <Italic size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
          >
            <LinkIcon size={16} />
          </Button>
          <div className="w-[1px] h-4 bg-border mx-1"></div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
          >
            <List size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
          >
            <Code size={16} />
          </Button>
        </div>

        <div className="flex gap-2 shrink-0">
          {(isFocused || content) && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full font-bold text-xs h-9 px-4 hover:bg-muted"
              onClick={() => {
                setContent('');
                setIsFocused(false);
                if (onCancel) onCancel();
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            disabled={!content.trim()}
            className={cn(
              'rounded-full font-bold text-xs px-6 h-9 transition-all shadow-sm',
              content.trim()
                ? 'bg-primary text-primary-foreground hover:opacity-90 active:scale-95'
                : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed',
            )}
            onClick={handleSubmit}
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};
