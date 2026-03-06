import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CardWrapperProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function CardWrapper({ title, children, className }: CardWrapperProps) {
  return (
    <Card className={className}>
      {title ? (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
