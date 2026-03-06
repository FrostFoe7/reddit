import type { ReactNode } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CardWrapper } from '@/components/common/CardWrapper';
import { Button } from '@/components/common/Button';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, footer, children }: AuthLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <CardWrapper className="w-full max-w-[440px] rounded-[20px] shadow-ios-float py-0 px-0 overflow-hidden">
        <div className="flex justify-between items-center pt-6 pb-2 px-6">
          <div className="inline-flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
              <ArrowLeft size={20} className="text-muted-foreground" />
            </Button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm3.9 12.1a1.2 1.2 0 0 1-1.7 1.7 4.2 4.2 0 0 0-4.4 0 1.2 1.2 0 0 1-1.7-1.7 6.6 6.6 0 0 1 7.8 0z" />
              </svg>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-full">
            <X size={20} className="text-muted-foreground" />
          </Button>
        </div>

        <div className="flex flex-col py-2 px-8">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-[15px] text-muted-foreground mt-1">{subtitle}</p>
        </div>

        <div className="flex flex-col grow shrink overflow-y-auto py-6 px-8 space-y-4 max-h-[60vh] no-scrollbar">
          {children}
        </div>

        <div className="flex flex-col p-8 pt-4 space-y-4 border-t border-border/50">{footer}</div>
      </CardWrapper>
    </div>
  );
}
