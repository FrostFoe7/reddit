import React from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./Navbar";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { useUIStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export const MainLayoutContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen flex flex-col pl-safe-left pr-safe-right bg-background text-foreground transition-colors duration-400">
      <Navbar />
      <div className="flex justify-center w-full max-w-[1400px] mx-auto pt-14 flex-1">
        <LeftSidebar />
        <main
          className={cn(
            "flex-1 w-full px-0 sm:px-6 pt-6 sm:pt-8 pb-24 relative min-h-[85vh] flex justify-center transition-all duration-300",
            sidebarCollapsed
              ? "max-w-[calc(1400px-80px-312px)]"
              : "max-w-[calc(1400px-270px-312px)]",
          )}
        >
          <div className="w-full max-w-3xl">{children}</div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
};

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <MainLayoutContent>{children}</MainLayoutContent>
          <Toaster position="top-center" richColors />
        </TooltipProvider>
    </ThemeProvider>
  );
};
