import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Plus, 
  Bell, 
  Search, 
  User, 
  Compass,
  Settings,
  LogOut,
  Moon,
  Sun,
  Star,
  ShieldCheck,
  Newspaper,
  Gamepad2,
  Info,
  Megaphone,
  LifeBuoy,
  BookOpen,
  Briefcase,
  Mic2,
  Users,
  MessageSquare,
  PieChart,
  Menu,
  SquarePlus,
  X
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { mockCommunities, mockNotifications, mockPosts } from '@/db/db';
import { cn } from '@/lib/utils';
import { ThemeProvider, useTheme } from 'next-themes';
import { OverlayProvider } from '@/components/common/GlobalOverlays';
import { Toaster } from '@/components/ui/sonner';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scoped search logic
  const isSubreddit = location.pathname.startsWith('/r/') && !location.pathname.includes('/r/popular');
  const subName = isSubreddit ? location.pathname.split('/')[2] : null;

  const filteredCommunities = searchQuery.length > 0 
    ? mockCommunities.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];
  
  const filteredPosts = searchQuery.length > 0
    ? mockPosts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchFocused(false);
    }
  };

  useEffect(() => {
    setIsSearchFocused(false);
  }, [location]);

  return (
    <header className="fixed top-0 inset-x-0 h-14 bg-background border-b border-border flex items-center justify-between px-4 z-50">
      {/* Left: Hamburger & Logo */}
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-full h-10 w-10">
                <Menu size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Open navigation</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Link to="/" className="flex items-center gap-2 pr-4 group" aria-label="Reddit Home">
          <svg className="h-[22px] text-primary fill-current" viewBox="0 0 514 149" xmlns="http://www.w3.org/2000/svg">
            <path d="m71.62,45.92l-12.01,28.56c-1.51-.76-5.11-1.61-8.51-1.61s-6.81.85-10.12,2.46c-6.53,3.31-11.35,9.93-11.35,19.48v52.3H-.26V45.35h29.04v14.28h.57c6.81-9.08,17.21-15.79,30.74-15.79,4.92,0,9.65.95,11.54,2.08Z" />
            <path d="m65.84,96.52c0-29.41,20.15-52.68,50.32-52.68,27.33,0,46.91,19.96,46.91,48.05,0,4.92-.47,9.55-1.51,14h-68.48c3.12,10.69,12.39,19.01,26.29,19.01,7.66,0,18.54-2.74,24.4-7.28l9.27,22.32c-8.61,5.86-21.75,8.7-33.29,8.7-32.25,0-53.91-20.81-53.91-52.11Zm26.67-9.36h43.03c0-13.05-8.89-19.96-19.77-19.96-12.3,0-20.62,7.94-23.27,19.96Z" />
            <path d="m419.53-.37c10.03,0,18.25,8.23,18.25,18.25s-8.23,18.25-18.25,18.25-18.25-8.23-18.25-18.25S409.51-.37,419.53-.37Zm14.94,147.49h-29.89V45.35h29.89v101.77Z" />
            <path d="m246,1.47l-.09,53.53h-.57c-8.23-7.85-17.12-11.07-28.75-11.07-28.66,0-47.67,23.08-47.67,52.3s17.78,52.4,46.72,52.4c12.11,0,23.55-4.16,30.93-13.62h.85v12.11h28.47V1.47h-29.89Zm1.42,121.39h-.99l-6.67-6.93c-4.34,4.33-10.28,6.93-17.22,6.93-14.64,0-24.88-11.58-24.88-26.6s10.24-26.6,24.88-26.6,24.88,11.58,24.88,26.6v26.6Z" />
            <path d="m360.15,1.47l-.09,53.53h-.57c-8.23-7.85-17.12-11.07-28.75-11.07-28.66,0-47.67,23.08-47.67,52.3s17.78,52.4,46.72,52.4c12.11,0,23.55-4.16,30.93-13.62h.85v12.11h28.47V1.47h-29.89Zm1.28,121.39h-.99l-6.67-6.93c-4.34,4.33-10.28,6.93-17.22,6.93-14.64,0-24.88-11.58-24.88-26.6s10.24-26.6,24.88-26.6,24.88,11.58,24.88,26.6v26.6Z" />
            <path d="m492.44,45.35h21.85v25.44h-21.85v76.33h-29.89v-76.33h-21.75v-25.44h21.75v-27.66h29.89v27.66Z" />
          </svg>
        </Link>
      </div>

      {/* Middle: Search Bar */}
      <div className="flex-1 max-w-[750px] mx-4 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative group/search">
          <div className={cn(
            "flex items-center w-full bg-secondary-background hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full h-10 px-4 transition-colors border border-transparent focus-within:bg-background focus-within:border-border focus-within:shadow-sm",
            isSearchFocused && "rounded-b-none"
          )}>
            <Search size={18} className="text-muted-foreground mr-2 shrink-0" />
            
            {subName && !searchQuery && (
              <Badge variant="secondary" className="mr-2 h-7 gap-1.5 pl-1.5 pr-1 font-semibold text-[12px] bg-background border-border">
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[8px] text-white">r/</div>
                r/{subName}
                <X size={14} className="cursor-pointer hover:text-foreground" onClick={() => navigate('/')} />
              </Badge>
            )}

            <Input 
              type="text" 
              placeholder={subName ? `Search in r/${subName}` : "Search Reddit"} 
              value={searchQuery}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="bg-transparent border-none shadow-none focus-visible:ring-0 h-full p-0 text-[14px] font-medium placeholder:text-muted-foreground"
            />
            
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full ml-1" 
                onClick={() => setSearchInput('')}
              >
                <X size={14} />
              </Button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-background border border-t-0 border-border rounded-b-[20px] shadow-lg z-50 overflow-hidden py-2">
              {filteredCommunities.map(c => (
                <Link key={c.id} to={`/r/${c.id}`} className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors">
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white", c.icon)}>r/</div>
                  <span className="text-[14px] font-medium">r/{c.name}</span>
                </Link>
              ))}
              {filteredPosts.map(p => (
                <Link key={p.id} to={`/post/${p.id}`} className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors">
                  <Search size={16} className="text-muted-foreground" />
                  <span className="text-[14px] font-medium truncate">{p.title}</span>
                </Link>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <TooltipProvider>
          {/* Advertise */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hidden sm:flex">
                <Megaphone size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Advertise</TooltipContent>
          </Tooltip>

          {/* Chat */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 relative">
                <MessageSquare size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Chat</TooltipContent>
          </Tooltip>

          {/* Create */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={() => navigate('/create')}>
                <SquarePlus size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create Post</TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 relative">
                <Bell size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-[16px] p-0 overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                <span className="font-bold text-[14px]">Notifications</span>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-[12px] font-bold text-primary">Read All</Button>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {mockNotifications.map(n => (
                  <div key={n.id} className="p-3 flex gap-3 hover:bg-muted cursor-pointer transition-colors border-b border-border last:border-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${n.user || n.sub}`} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <p className="text-[13px] leading-tight"><span className="font-bold">{n.user || n.sub}</span> {n.text}</p>
                      <span className="text-[11px] text-muted-foreground mt-1">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-muted ml-1">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_0.png" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-[16px] p-2 mt-1">
              <div className="flex items-center gap-3 p-2 mb-2 border-b border-border pb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_0.png" />
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-[14px]">User123</span>
                  <span className="text-[12px] text-muted-foreground font-medium flex items-center gap-1">
                    <Star size={10} className="text-primary fill-current" /> 1.2k karma
                  </span>
                </div>
              </div>
              <DropdownMenuItem onClick={() => navigate('/u/User123')} className="rounded-[8px] py-2.5 font-medium">
                <User size={18} className="mr-3 text-muted-foreground" /> View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-[8px] py-2.5 font-medium">
                <Settings size={18} className="mr-3 text-muted-foreground" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-[8px] py-2.5 font-medium"
              >
                {theme === 'dark' ? <Sun size={18} className="mr-3" /> : <Moon size={18} className="mr-3" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-[8px] py-2.5 font-medium text-destructive">
                <LogOut size={18} className="mr-3" /> Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      </div>
    </header>
  );
};

const SidebarNavItem = ({ to, icon: Icon, label, badge, active, className }: { to: string, icon: any, label: string, badge?: string | number, active?: boolean, className?: string }) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center justify-between px-4 py-2 rounded-[8px] transition-colors group",
      active ? "bg-muted text-foreground" : "text-foreground hover:bg-muted",
      className
    )}
  >
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-8 h-8 shrink-0">
        <Icon size={20} className={cn(!active && "text-foreground group-hover:text-foreground")} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className={cn("text-[14px] font-medium truncate", active && "font-bold")}>{label}</span>
    </div>
    {badge && <Badge className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0 rounded-[4px] border-none">{badge}</Badge>}
  </Link>
);

const LeftSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside id="left-sidebar" className="hidden md:flex md:w-[240px] lg:w-[270px] shrink-0 flex-col border-r border-border sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto pb-8 styled-scrollbars no-scrollbar transition-colors duration-400">
      <nav className="flex flex-col p-2 space-y-1" aria-label="Primary">
        <div className="flex flex-col space-y-0.5">
          <SidebarNavItem to="/" icon={Home} label="Home" active={location.pathname === '/' && !location.search.includes('feed=news')} />
          <SidebarNavItem to="/r/popular" icon={TrendingUp} label="Popular" active={location.pathname.includes('/r/popular')} />
          <SidebarNavItem to="/?feed=news" icon={Newspaper} label="News" active={location.search.includes('feed=news')} />
          <SidebarNavItem to="/explore" icon={Compass} label="Explore" active={location.pathname === '/explore'} />
        </div>

        <hr className="my-3 border-border mx-2" />

        <Accordion type="multiple" defaultValue={["recent", "communities", "games", "resources"]} className="w-full space-y-1">
          <AccordionItem value="recent" className="border-none">
            <AccordionTrigger className="py-2 px-4 hover:bg-muted rounded-[8px] no-underline hover:no-underline text-[12px] font-bold tracking-widest text-muted-foreground uppercase transition-none">
              RECENT
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-2">
              <div className="flex flex-col space-y-0.5">
                <SidebarNavItem to="/r/Backend" icon={() => (
                  <Avatar className="w-6 h-6"><AvatarImage src="https://styles.redditmedia.com/t5_2sr2v/styles/communityIcon_inx7byubklb91.png" /><AvatarFallback>B</AvatarFallback></Avatar>
                )} label="r/Backend" />
                <SidebarNavItem to="/r/Dhaka" icon={() => (
                  <Avatar className="w-6 h-6"><AvatarImage src="https://styles.redditmedia.com/t5_2s6vl/styles/communityIcon_pjea2f9av9341.png" /><AvatarFallback>D</AvatarFallback></Avatar>
                )} label="r/Dhaka" />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="communities" className="border-none">
            <AccordionTrigger className="py-2 px-4 hover:bg-muted rounded-[8px] no-underline hover:no-underline text-[12px] font-bold tracking-widest text-muted-foreground uppercase transition-none">
              COMMUNITIES
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-2">
              <div className="flex flex-col space-y-0.5">
                <button 
                  onClick={() => navigate('/create')}
                  className="flex items-center gap-3 px-4 py-2 rounded-[8px] hover:bg-muted transition-colors text-foreground group w-full text-left"
                >
                  <div className="flex items-center justify-center w-8 h-8 shrink-0 bg-muted rounded-full group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700">
                    <Plus size={18} />
                  </div>
                  <span className="text-[14px] font-medium">Create a community</span>
                </button>
                <Link 
                  to="/user/communities"
                  className="flex items-center gap-3 px-4 py-2 rounded-[8px] hover:bg-muted transition-colors text-foreground group w-full"
                >
                  <div className="flex items-center justify-center w-8 h-8 shrink-0">
                    <Settings size={18} className="text-muted-foreground group-hover:text-foreground" />
                  </div>
                  <span className="text-[14px] font-medium">Manage Communities</span>
                </Link>
                {mockCommunities.map(community => (
                  <SidebarNavItem 
                    key={community.id}
                    to={`/r/${community.id}`} 
                    icon={() => (
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm", community.icon)}>r/</div>
                    )}
                    label={community.name}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="games" className="border-none">
            <AccordionTrigger className="py-2 px-4 hover:bg-muted rounded-[8px] no-underline hover:no-underline text-[12px] font-bold tracking-widest text-muted-foreground uppercase transition-none">
              GAMES
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-2">
              <div className="flex flex-col space-y-0.5">
                <SidebarNavItem to="/r/GamesOnReddit" icon={Gamepad2} label="Discover Games" />
                <SidebarNavItem to="/post/game1" icon={() => (
                  <Avatar className="w-6 h-6"><AvatarImage src="https://styles.redditmedia.com/t5_g4t9vd/styles/communityIcon_jejg2erkc48g1.png" /></Avatar>
                )} label="BattleBirds" />
                <SidebarNavItem to="/post/game2" icon={() => (
                  <Avatar className="w-6 h-6"><AvatarImage src="https://styles.redditmedia.com/t5_gikv8d/styles/communityIcon_nz4nl06rg4hg1.png" /></Avatar>
                )} label="Soul Thieves" />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="resources" className="border-none">
            <AccordionTrigger className="py-2 px-4 hover:bg-muted rounded-[8px] no-underline hover:no-underline text-[12px] font-bold tracking-widest text-muted-foreground uppercase transition-none">
              RESOURCES
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-2">
              <div className="flex flex-col space-y-0.5">
                <SidebarNavItem to="https://www.redditinc.com" icon={Info} label="About Reddit" />
                <SidebarNavItem to="https://ads.reddit.com" icon={Megaphone} label="Advertise" />
                <SidebarNavItem to="/reddit-pro" icon={PieChart} label="Reddit Pro" />
                <Badge variant="outline" className="ml-12 w-fit text-[10px] font-bold text-primary border-primary bg-primary/5 px-1 py-0 h-4">BETA</Badge>
                <SidebarNavItem to="https://support.reddithelp.com" icon={LifeBuoy} label="Help" />
                <SidebarNavItem to="https://redditblog.com" icon={BookOpen} label="Blog" />
                <SidebarNavItem to="https://www.redditinc.com/careers" icon={Briefcase} label="Careers" />
                <SidebarNavItem to="https://www.redditinc.com/press" icon={Mic2} label="Press" />
                <hr className="my-2 border-border mx-4" />
                <SidebarNavItem to="/best/communities" icon={Users} label="Communities" />
                <SidebarNavItem to="/posts/2026/global" icon={Star} label="Best of Reddit" />
                <SidebarNavItem to="/policies/content-policy" icon={BookOpen} label="Content Policy" />
                <SidebarNavItem to="/policies/privacy-policy" icon={ShieldCheck} label="Privacy Policy" />
                <SidebarNavItem to="/policies/user-agreement" icon={BookOpen} label="User Agreement" />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-auto pt-8 pb-4 px-4">
          <p className="text-[10px] text-muted-foreground">Reddit, Inc. © 2026. All rights reserved.</p>
        </div>
      </nav>
    </aside>
  );
};

const RightSidebar = () => {
  const location = useLocation();
  const isSubredditPage = location.pathname.startsWith('/r/') && !location.pathname.includes('/r/popular');

  return (
    <aside id="right-sidebar" className="hidden xl:flex flex-col w-[312px] shrink-0 border-l border-border sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto pb-8 styled-scrollbars no-scrollbar transition-colors duration-400">
      <div className="flex flex-col p-4 space-y-6">
        {/* About Community Section (Full Width, No Card) */}
        {isSubredditPage && (
          <div className="flex flex-col space-y-3">
            <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest px-2">About Community</h3>
            <div className="bg-secondary-background/50 rounded-[16px] p-4 flex flex-col gap-4">
              <p className="text-[14px] text-foreground leading-normal">
                A community dedicated to discussions, news, and updates. Welcome!
              </p>
              <div className="flex gap-6">
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold">1.2m</span>
                  <span className="text-[12px] text-muted-foreground font-medium">Members</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div> 4.5k
                  </span>
                  <span className="text-[12px] text-muted-foreground font-medium">Online</span>
                </div>
              </div>
              <Button className="w-full rounded-full font-bold h-10 shadow-sm">Create Post</Button>
            </div>
          </div>
        )}

        {/* Recent Posts Section */}
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Recent Posts</h3>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-transparent h-auto p-0 font-bold text-[12px]">Clear</Button>
          </div>
          <div className="flex flex-col space-y-1">
            {mockPosts.slice(0, 4).map((post) => (
              <Link key={post.id} to={`/post/${post.id}`} className="px-2 py-2.5 hover:bg-muted rounded-[12px] transition-colors flex flex-col gap-1 group">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Avatar className="w-4 h-4">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.sub}&backgroundColor=ff4500`} />
                    <AvatarFallback>r/</AvatarFallback>
                  </Avatar>
                  <span className="font-bold text-foreground/80 group-hover:underline">r/{post.sub}</span>
                  <span>•</span>
                  <span>3d ago</span>
                </div>
                <h4 className="text-[13px] font-semibold leading-snug text-foreground group-hover:underline line-clamp-2">
                  {post.title}
                </h4>
                <div className="text-[11px] text-muted-foreground font-medium">
                  {post.upvotes} upvotes • {post.comments} comments
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Communities Section */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest px-2">Top Communities</h3>
          <div className="flex flex-col space-y-1">
            {mockCommunities.slice(0, 5).map((community, i) => (
              <Link key={community.id} to={`/r/${community.id}`} className="flex items-center justify-between px-2 py-2 hover:bg-muted rounded-[12px] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-bold text-muted-foreground w-4">{i + 1}</span>
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-sm", community.icon)}>r/</div>
                  <span className="text-[13px] font-bold text-foreground">r/{community.name}</span>
                </div>
                <Button variant="outline" size="sm" className="rounded-full h-7 px-3 font-bold border-primary text-primary hover:bg-primary/5 text-[11px]">Join</Button>
              </Link>
            ))}
            <Button variant="ghost" className="w-full text-primary font-bold text-[12px] py-2 rounded-[12px] h-auto hover:bg-muted mt-1">View All</Button>
          </div>
        </div>

        {/* Premium Promo Section */}
        <div className="bg-primary/5 border border-primary/10 rounded-[16px] p-4 flex flex-col gap-3 relative overflow-hidden group">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col">
              <h4 className="text-[14px] font-bold text-foreground">Reddit Premium</h4>
              <p className="text-[12px] text-muted-foreground font-medium leading-snug mt-0.5">
                The best Reddit experience, with Ad-free and more!
              </p>
            </div>
          </div>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold h-9 text-[13px]">Try Now</Button>
        </div>

        {/* Footer */}
        <div className="px-2 pt-4 flex flex-wrap gap-x-3 gap-y-1">
          {["User Agreement", "Privacy Policy", "Content Policy", "Moderator Code"].map((link) => (
            <Link key={link} to="#" className="text-[11px] font-medium text-muted-foreground hover:underline">{link}</Link>
          ))}
          <hr className="w-full my-3 border-border" />
          <p className="text-[11px] font-medium text-muted-foreground">Reddit, Inc. © 2026. All rights reserved.</p>
        </div>
      </div>
    </aside>
  );
};

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-glass backdrop-blur-3xl border-t border-border flex items-center justify-around h-14 pb-env(safe-area-inset-bottom) md:hidden z-50">
      <Button variant="ghost" size="icon" className={cn("flex flex-col gap-1 h-auto py-1", location.pathname === '/' && "text-primary")} onClick={() => navigate('/')}>
        <Home size={24} />
        <span className="text-[10px] font-bold">Home</span>
      </Button>
      <Button variant="ghost" size="icon" className={cn("flex flex-col gap-1 h-auto py-1", location.pathname === '/explore' && "text-primary")} onClick={() => navigate('/explore')}>
        <Compass size={24} />
        <span className="text-[10px] font-bold">Explore</span>
      </Button>
      <div className="relative -top-3">
        <Button className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-all" onClick={() => navigate('/create')}>
          <Plus size={32} />
        </Button>
      </div>
      <Button variant="ghost" size="icon" className={cn("flex flex-col gap-1 h-auto py-1", location.pathname === '/messages' && "text-primary")} onClick={() => navigate('/messages')}>
        <MessageSquare size={24} />
        <span className="text-[10px] font-bold">Chat</span>
      </Button>
      <Button variant="ghost" size="icon" className={cn("flex flex-col gap-1 h-auto py-1", location.pathname === '/notifications' && "text-primary")} onClick={() => navigate('/notifications')}>
        <Bell size={24} />
        <span className="text-[10px] font-bold">Inbox</span>
      </Button>
    </nav>
  );
};

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
            <BottomNav />
          </div>
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </OverlayProvider>
    </ThemeProvider>
  );
};
