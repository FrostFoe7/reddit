import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Send, Smile } from 'lucide-react';

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function MessageComposer({ value, onChange, onSubmit }: MessageComposerProps) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex items-center gap-2 bg-muted/50 rounded-3xl px-3 py-1.5 border border-border focus-within:border-primary/50 transition-colors"
    >
      <Button type="button" variant="ghost" size="icon" className="rounded-full h-9 w-9 shrink-0 text-muted-foreground hover:text-primary">
        <ImageIcon size={20} />
      </Button>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Message..."
        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1.5 px-1 outline-none text-foreground placeholder:text-muted-foreground"
      />
      <Button type="button" variant="ghost" size="icon" className="rounded-full h-9 w-9 shrink-0 text-muted-foreground hover:text-primary">
        <Smile size={20} />
      </Button>
      <Button type="submit" size="icon" disabled={!value.trim()} className="rounded-full h-9 w-9 shrink-0 bg-primary text-primary-foreground shadow-sm">
        <Send size={18} />
      </Button>
    </form>
  );
}
