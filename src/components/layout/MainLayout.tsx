import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  MessageSquare, 
  Plus, 
  Bell, 
  Search, 
  User, 
  Compass,
  Settings,
  LogOut,
  Bookmark,
  Moon,
  Sun,
  ChevronDown,
  Star,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { mockCommunities } from '@/db/db';
import { cn } from '@/lib/utils';
import { ThemeProvider, useTheme } from 'next-themes';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <header id="navbar" className="fixed top-0 inset-x-0 pt-safe-top h-[calc(60px+env(safe-area-inset-top))] bg-glass backdrop-blur-2xl border-b border-border-subtle flex items-center justify-between px-4 sm:px-6 z-50 transition-colors duration-400">
      <div className="flex items-center gap-4 shrink-0 h-full">
        <Link to="/" className="flex items-center gap-2.5 focus:outline-none group hover:scale-105 transition-transform" aria-label="Reddit Home">
          <div className="w-9 h-9 bg-reddit-orange rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="fill-white w-6 h-6">
              <path d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-2L11,2.62a.25.25,0,0,0-.3.1l-.86,3.97a7.12,7.12,0,0,0-3.86,1.23A1.46,1.46,0,1,0,3.33,10a1.45,1.45,0,0,0,.1.53,4.16,4.16,0,0,0,0,.47c0,2.85,3,5.16,6.57,5.16s6.57-2.31,6.57-5.16a4.16,4.16,0,0,0,0-.47A1.45,1.45,0,0,0,16.67,10ZM7.09,12.11a1.28,1.28,0,1,1,1.27-1.27A1.28,1.28,0,0,1,7.09,12.11ZM12.91,15a5.52,5.52,0,0,1-2.91-.84,5.52,5.52,0,0,1-2.91.84,1.28,1.28,0,0,1,0-2.55,5.43,5.43,0,0,1,2.91-.84,5.43,5.43,0,0,1,2.91.84,1.28,1.28,0,0,1,0,2.55Zm-.12-2.89a1.28,1.28,0,1,1,1.27-1.27A1.28,1.28,0,0,1,12.79,12.11Z" />
            </svg>
          </div>
          <span className="hidden lg:block text-[22px] font-bold tracking-tight text-text-primary mt-0.5">reddit</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl mx-4 lg:mx-10 hidden md:flex justify-center relative group h-full items-center">
        <div className="relative flex items-center w-full bg-hover border border-transparent rounded-full overflow-hidden transition-all duration-300 h-11 hover:bg-tertiary focus-within:bg-card focus-within:border-accent-primary focus-within:shadow-sm z-20">
          <div className="pl-4 pr-2 text-text-secondary"><Search size={20} /></div>
          <Input 
            type="text" 
            placeholder="Search Reddit" 
            className="w-full bg-transparent border-none shadow-none focus-visible:ring-0 text-text-primary placeholder-text-secondary h-full px-2 outline-none text-[15px] font-medium"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 shrink-0 h-full">
        <Button variant="ghost" size="icon" className="md:hidden rounded-full h-11 w-11">
          <Search size={20} />
        </Button>

        <div className="hidden sm:block">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 relative">
                <Bell size={22} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-reddit-orange rounded-full border-[2.5px] border-glass"></span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
        </div>

        <Link to="/create" className="hidden sm:flex items-center gap-2 hover:bg-hover h-11 px-4.5 rounded-full transition-colors text-text-primary font-semibold text-[15px]">
          <Plus size={20} />
          <span className="hidden lg:block">Create</span>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2.5 h-11 p-1 hover:bg-hover border border-transparent hover:border-border-subtle rounded-full transition-all focus:outline-none pr-3.5 ml-1">
              <Avatar className="h-9 w-9 border border-border-subtle">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ff4500" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start leading-tight">
                <span className="text-[14px] font-semibold text-text-primary tracking-tight">User123</span>
                <span className="text-[12px] font-medium text-text-secondary flex items-center gap-1">
                  <Star size={10} className="text-reddit-orange fill-reddit-orange" /> 1.2k
                </span>
              </div>
              <ChevronDown size={14} className="text-text-secondary hidden lg:block ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[260px] rounded-[24px] p-2 bg-glass backdrop-blur-3xl border-border-subtle shadow-ios-glass">
            <div className="p-3 flex items-center gap-3.5 border-b border-border-subtle mb-1">
              <Avatar className="h-12 w-12 border border-border-subtle">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ff4500" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-[17px] font-bold text-text-primary tracking-tight">User123</span>
                <span className="text-[14px] text-text-secondary font-medium">u/User123</span>
              </div>
            </div>
            <DropdownMenuItem asChild className="rounded-[14px] focus:bg-hover p-3">
              <Link to="/u/User123" className="flex items-center gap-3.5 font-medium text-[15px]">
                <User size={22} className="text-text-secondary" /> View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-[14px] focus:bg-hover p-3">
              <Link to="/u/User123?tab=saved" className="flex items-center gap-3.5 font-medium text-[15px]">
                <Bookmark size={22} className="text-text-secondary" /> Saved
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-[14px] focus:bg-hover p-3">
              <Link to="/settings" className="flex items-center gap-3.5 font-medium text-[15px]">
                <Settings size={22} className="text-text-secondary" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border-subtle" />
            <DropdownMenuItem 
              className="rounded-[14px] focus:bg-hover p-3 flex items-center justify-between cursor-pointer"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <div className="flex items-center gap-3.5 font-medium text-[15px]">
                {theme === 'dark' ? <Sun size={22} className="text-text-secondary" /> : <Moon size={22} className="text-text-secondary" />} 
                {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border-subtle" />
            <DropdownMenuItem className="rounded-[14px] focus:bg-hover p-3 text-red-500">
              <div className="flex items-center gap-3.5 font-medium text-[15px]">
                <LogOut size={22} /> Log Out
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

const SidebarItem = ({ to, icon: Icon, label, badge, active }: { to: string, icon: any, label: string, badge?: string | number, active?: boolean }) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center justify-between px-4 py-3 rounded-[16px] font-semibold transition-colors group",
      active ? "bg-hover text-text-primary" : "text-text-primary hover:bg-hover"
    )}
  >
    <div className="flex items-center gap-3.5">
      <Icon size={22} className={cn(!active && "text-text-secondary group-hover:text-text-primary transition-colors")} />
      <span className="text-[16px]">{label}</span>
    </div>
    {badge && <Badge className="bg-accent-primary text-white text-[12px] font-bold px-2 py-0.5 rounded-[6px] border-none">{badge}</Badge>}
  </Link>
);

const LeftSidebar = () => {
  const location = useLocation();
  return (
    <aside id="left-sidebar" className="hidden md:flex md:w-[220px] lg:w-[260px] shrink-0 flex-col border-r border-border-subtle sticky top-[calc(60px+env(safe-area-inset-top))] h-[calc(100vh-(60px+env(safe-area-inset-top)))] overflow-y-auto pb-8 no-scrollbar transition-colors duration-400">
      <nav className="flex flex-col p-4 space-y-6 mt-2">
        <div className="space-y-1">
          <SidebarItem to="/" icon={Home} label="Home" active={location.pathname === '/'} />
          <SidebarItem to="/search?q=popular" icon={TrendingUp} label="Popular" active={location.search.includes('popular')} />
          <SidebarItem to="/messages" icon={MessageSquare} label="Messages" badge={2} active={location.pathname === '/messages'} />
        </div>
        <div className="h-px bg-border-subtle mx-4"></div>
        <div>
          <div className="flex items-center justify-between w-full px-4 py-2 text-text-secondary mb-2">
            <span className="text-[12px] font-bold tracking-wider uppercase">Communities</span>
          </div>
          <div className="space-y-1">
            {mockCommunities.map(community => (
              <Link 
                key={community.id}
                to={`/r/${community.id}`} 
                className="flex items-center gap-3.5 px-4 py-3 hover:bg-hover rounded-[16px] text-text-primary font-medium transition-colors"
              >
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm border border-border-subtle/20", community.icon)}>r/</div>
                <span className="text-[16px]">{community.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav id="bottom-nav" className="md:hidden fixed bottom-0 inset-x-0 bg-glass backdrop-blur-3xl border-t border-border-subtle flex justify-around items-center h-[calc(4rem+env(safe-area-inset-bottom))] pb-safe-bottom z-50 transition-transform duration-300 px-2 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
      <Link to="/" className={cn("flex flex-col items-center justify-center w-12 h-12 transition-colors", isActive('/') ? "text-text-primary" : "text-text-secondary")}>
        <Home size={26} fill={isActive('/') ? "currentColor" : "none"} />
      </Link>
      <Link to="/search?q=explore" className={cn("flex flex-col items-center justify-center w-12 h-12 transition-colors", location.search.includes('explore') ? "text-text-primary" : "text-text-secondary")}>
        <Compass size={26} />
      </Link>
      <Link to="/create" className="flex flex-col items-center justify-center w-12 h-12 text-text-secondary">
        <div className="bg-bg-primary rounded-full p-2.5 border border-border-subtle shadow-sm">
          <Plus size={20} className="text-text-primary" />
        </div>
      </Link>
      <Link to="/messages" className={cn("flex flex-col items-center justify-center w-12 h-12 transition-colors relative", isActive('/messages') ? "text-text-primary" : "text-text-secondary")}>
        <MessageSquare size={26} />
        <span className="absolute top-[8px] right-[8px] w-2.5 h-2.5 bg-reddit-orange rounded-full border-[2px] border-glass"></span>
      </Link>
      <Link to="/notifications" className={cn("flex flex-col items-center justify-center w-12 h-12 transition-colors", isActive('/notifications') ? "text-text-primary" : "text-text-secondary")}>
        <Bell size={26} />
      </Link>
    </nav>
  );
};

const RightSidebar = () => {
  return (
    <aside id="right-sidebar" className="hidden lg:block lg:w-[300px] xl:w-[320px] shrink-0 pt-6 px-6 space-y-6 sticky top-[calc(60px+env(safe-area-inset-top))] h-[calc(100vh-(60px+env(safe-area-inset-top)))] overflow-y-auto no-scrollbar transition-colors duration-400">
      <div className="bg-card border border-border-subtle rounded-[24px] p-6 flex gap-4 sidebar-card shadow-ios-subtle">
        <ShieldCheck className="text-reddit-orange shrink-0 drop-shadow-sm" size={40} />
        <div className="flex flex-col justify-center">
          <h4 className="text-[16px] font-bold text-text-primary tracking-tight mb-1">Reddit Premium</h4>
          <Button className="mt-3 bg-reddit-orange text-white text-[14px] font-bold w-full py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-sm">
            Try Now
          </Button>
        </div>
      </div>
      <div className="text-[13px] font-medium text-text-secondary p-2 pt-4 border-t border-border-subtle">
        Reddit Inc © 2026. All rights reserved.
      </div>
    </aside>
  );
};

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <div className="min-h-screen flex flex-col pl-safe-left pr-safe-right">
          <Navbar />
          <div className="flex justify-center w-full max-w-[1400px] mx-auto pt-[calc(60px+env(safe-area-inset-top))] flex-1">
            <LeftSidebar />
            <main className="flex-1 w-full max-w-[760px] px-0 sm:px-6 pt-0 sm:pt-6 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-24 transition-colors duration-400 relative min-h-[85vh]">
              {children}
            </main>
            <RightSidebar />
          </div>
          <BottomNav />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
};
