import type { ReactNode } from 'react';
import { Label } from '@/components/common/Label';
import { cn } from '@/lib/utils';

interface FormFieldWrapperProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormFieldWrapper({ id, label, error, children, className }: FormFieldWrapperProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
        {label}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive ml-1">{error}</p> : null}
    </div>
  );
}
