import type { ComponentProps } from 'react';
import { Button } from '@/components/common/Button';

type ButtonProps = ComponentProps<typeof Button>;

interface SubmitButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export function SubmitButton({ isLoading, loadingText = 'Saving...', children, disabled, ...props }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={disabled || isLoading} {...props}>
      {isLoading ? loadingText : children}
    </Button>
  );
}
