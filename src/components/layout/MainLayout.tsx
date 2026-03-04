import React from 'react';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { OverlayProvider } from '@/components/common/GlobalOverlays';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from './Navbar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <OverlayProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col pl-safe-left pr-safe-right bg-background text-foreground transition-colors duration-400">
            <Navbar />
            <div className="flex justify-center w-full max-w-[1400px] mx-auto pt-14 flex-1">
              <LeftSidebar />
              <main className="flex-1 w-full max-w-[760px] px-0 sm:px-6 pt-0 sm:pt-6 pb-24 relative min-h-[85vh]">
                {children}
              </main>
              <RightSidebar />
            </div>
          </div>
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </OverlayProvider>
    </ThemeProvider>
  );
};
