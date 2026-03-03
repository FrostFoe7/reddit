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
  ChevronDown,
  Star,
  ShieldCheck,
  CheckCircle2,
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
  PieChart
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
import { TooltipProvider } from '@/components/ui/tooltip';
import { mockCommunities, mockNotifications, mockPosts } from '@/db/db';
import { cn } from '@/lib/utils';
import { ThemeProvider, useTheme } from 'next-themes';
import { OverlayProvider } from '@/components/common/GlobalOverlays';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    <header id="navbar" className="fixed top-0 inset-x-0 pt-safe-top h-[calc(60px+env(safe-area-inset-top))] bg-glass backdrop-blur-2xl border-b border-border flex items-center justify-between px-4 sm:px-6 z-50 transition-colors duration-400">
      <div className="flex items-center gap-4 shrink-0 h-full">
        <Link to="/" className="flex items-center gap-2.5 focus:outline-none group hover:scale-105 transition-transform" aria-label="Reddit Home">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="fill-primary-foreground w-6 h-6">
              <path d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-2L11,2.62a.25.25,0,0,0-.3.1l-.86,3.97a7.12,7.12,0,0,0-3.86,1.23A1.46,1.46,0,1,0,3.33,10a1.45,1.45,0,0,0,.1.53,4.16,4.16,0,0,0,0,.47c0,2.85,3,5.16,6.57,5.16s6.57-2.31,6.57-5.16a4.16,4.16,0,0,0,0-.47A1.45,1.45,0,0,0,16.67,10ZM7.09,12.11a1.28,1.28,0,1,1,1.27-1.27A1.28,1.28,0,0,1,7.09,12.11ZM12.91,15a5.52,5.52,0,0,1-2.91-.84,5.52,5.52,0,0,1-2.91.84,1.28,1.28,0,0,1,0-2.55,5.43,5.43,0,0,1,2.91-.84,5.43,5.43,0,0,1,2.91.84,1.28,1.28,0,0,1,0,2.55Zm-.12-2.89a1.28,1.28,0,1,1,1.27-1.27A1.28,1.28,0,0,1,12.79,12.11Z" />
            </svg>
          </div>
          <span className="hidden lg:block text-[22px] font-bold tracking-tight text-foreground mt-0.5">reddit</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl mx-4 lg:mx-10 hidden md:flex justify-center relative h-full items-center">
        <form onSubmit={handleSearchSubmit} className="w-full relative z-20">
          <div className={cn(
            "relative flex items-center w-full bg-muted border border-transparent rounded-full overflow-hidden transition-all duration-300 h-11 hover:bg-neutral-200 dark:hover:bg-neutral-700 focus-within:bg-card focus-within:border-primary focus-within:shadow-sm",
            isSearchFocused && "rounded-b-none"
          )}>
            <div className="pl-4 pr-2 text-muted-foreground"><Search size={20} /></div>
            <Input 
              type="text" 
              placeholder="Search Reddit" 
              value={searchQuery}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full bg-transparent border-none shadow-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground h-full px-2 outline-none text-[15px] font-medium"
            />
          </div>
          
          {isSearchFocused && (searchQuery.length > 0) && (
            <div className="absolute top-full left-0 right-0 bg-card border border-t-0 border-border rounded-b-[24px] shadow-ios-glass overflow-hidden flex flex-col pt-2 pb-3 animate-in fade-in slide-in-from-top-1 duration-200">
              {filteredCommunities.length > 0 && (
                <div className="px-4 py-2 text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Communities</div>
              )}
              {filteredCommunities.map(c => (
                <Link key={c.id} to={`/r/${c.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm", c.icon)}>r/</div>
                  <span className="text-[15px] font-medium text-foreground">r/{c.name}</span>
                </Link>
              ))}
              
              {filteredPosts.length > 0 && (
                <div className="px-4 py-2 text-[12px] font-bold text-muted-foreground uppercase tracking-wider mt-2">Posts</div>
              )}
              {filteredPosts.map(p => (
                <Link key={p.id} to={`/post/${p.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"><Search size={16} /></div>
                  <span className="text-[14px] font-medium text-foreground truncate">{p.title}</span>
                </Link>
              ))}
            </div>
          )}
        </form>
      </div>
      
      <div className="flex items-center gap-2 shrink-0 h-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 relative">
              <Bell size={22} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary rounded-full border-[2.5px] border-card"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[360px] rounded-[24px] p-0 bg-glass backdrop-blur-3xl border-border shadow-ios-glass overflow-hidden flex flex-col max-h-[480px]">
            <div className="p-5 border-b border-border flex justify-between items-center bg-muted/30 sticky top-0 z-10">
              <h3 className="font-bold text-[18px] text-foreground tracking-tight">Notifications</h3>
              <Button variant="ghost" size="sm" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground h-auto p-0" onClick={() => toast.success("Marked all as read")}>
                <CheckCircle2 size={16} className="mr-1" /> Read All
              </Button>
            </div>
            <div className="overflow-y-auto divide-y divide-border no-scrollbar">
              {mockNotifications.map(n => (
                <div key={n.id} className={cn("p-4 flex gap-3 hover:bg-muted transition-colors cursor-pointer", !n.isRead && "bg-primary/5")}>
                  <Avatar className="h-10 w-10 shrink-0 border border-border">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${n.user || n.sub}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <p className="text-[14px] text-foreground leading-tight line-clamp-2 mb-1">
                      <span className="font-bold">{n.user || `r/${n.sub}`}</span> {n.text}
                    </p>
                    <span className="text-[12px] text-muted-foreground font-medium">{n.time}</span>
                  </div>
                  {!n.isRead && <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5 ml-auto"></div>}
                </div>
              ))}
            </div>
            <Link to="/notifications" className="block w-full text-center p-3.5 bg-muted/50 hover:bg-muted text-[14px] font-semibold text-primary transition-colors border-t border-border">
              View All Notifications
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link to="/create" className="hidden sm:flex items-center gap-2 hover:bg-muted h-11 px-4.5 rounded-full transition-colors text-foreground font-semibold text-[15px]">
          <Plus size={20} />
          <span className="hidden lg:block">Create</span>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2.5 h-11 p-1 hover:bg-muted border border-transparent hover:border-border rounded-full transition-all focus:outline-none pr-3.5 ml-1">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ff4500" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start leading-tight">
                <span className="text-[14px] font-semibold text-foreground tracking-tight">User123</span>
                <span className="text-[12px] font-medium text-muted-foreground flex items-center gap-1">
                  <Star size={10} className="text-primary fill-primary" /> 1.2k
                </span>
              </div>
              <ChevronDown size={14} className="text-muted-foreground hidden lg:block ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[260px] rounded-[24px] p-2 bg-glass backdrop-blur-3xl border-border shadow-ios-glass">
            <div className="p-3 flex items-center gap-3.5 border-b border-border mb-1">
              <Avatar className="h-12 w-12 border border-border">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ff4500" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-[17px] font-bold text-foreground tracking-tight">User123</span>
                <span className="text-[14px] text-muted-foreground font-medium">u/User123</span>
              </div>
            </div>
            <DropdownMenuItem asChild className="rounded-[14px] focus:bg-muted p-3">
              <Link to="/u/User123" className="flex items-center gap-3.5 font-medium text-[15px]">
                <User size={22} className="text-muted-foreground" /> View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-[14px] focus:bg-muted p-3">
              <Link to="/settings" className="flex items-center gap-3.5 font-medium text-[15px]">
                <Settings size={22} className="text-muted-foreground" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              className="rounded-[14px] focus:bg-muted p-3 flex items-center justify-between cursor-pointer"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <div className="flex items-center gap-3.5 font-medium text-[15px]">
                {theme === 'dark' ? <Sun size={22} className="text-muted-foreground" /> : <Moon size={22} className="text-muted-foreground" />} 
                {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="rounded-[14px] focus:bg-muted p-3 text-destructive">
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
    <aside id="left-sidebar" className="hidden md:flex md:w-[240px] lg:w-[270px] shrink-0 flex-col border-r border-border sticky top-[calc(60px+env(safe-area-inset-top))] h-[calc(100vh-(60px+env(safe-area-inset-top)))] overflow-y-auto pb-8 styled-scrollbars no-scrollbar transition-colors duration-400">
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
    <aside className="hidden xl:flex flex-col w-[312px] gap-4 ml-6 py-6 sticky top-[calc(60px+env(safe-area-inset-top))] h-[calc(100vh-(60px+env(safe-area-inset-top)))] overflow-y-auto no-scrollbar">
      {isSubredditPage && (
        <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border bg-muted/50">
            <h4 className="text-[14px] font-bold text-foreground uppercase tracking-wider">About Community</h4>
          </div>
          <div className="p-5 flex flex-col gap-4">
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

      <div className="bg-card border border-border rounded-[24px] p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-500"></div>
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div className="flex flex-col">
            <h4 className="text-[15px] font-bold text-foreground">Reddit Premium</h4>
            <p className="text-[13px] text-muted-foreground font-medium leading-snug mt-0.5">
              The best Reddit experience, with Ad-free and more!
            </p>
          </div>
        </div>
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold h-10 shadow-sm">Try Now</Button>
      </div>

      <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border bg-muted/50">
          <h4 className="text-[14px] font-bold text-foreground uppercase tracking-wider">Top Communities</h4>
        </div>
        <div className="flex flex-col">
          {mockCommunities.slice(0, 5).map((community, i) => (
            <Link key={community.id} to={`/r/${community.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-muted transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-[14px] font-bold text-muted-foreground w-4">{i + 1}</span>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm", community.icon)}>r/</div>
                <span className="text-[14px] font-bold text-foreground">r/{community.name}</span>
              </div>
              <Button variant="outline" size="sm" className="rounded-full h-8 px-4 font-bold border-primary text-primary hover:bg-primary/5">Join</Button>
            </Link>
          ))}
          <Button variant="ghost" className="w-full text-primary font-bold text-[14px] py-4 rounded-none h-auto hover:bg-muted">View All</Button>
        </div>
      </div>

      <div className="px-4 py-2 flex flex-wrap gap-x-4 gap-y-1">
        <Link to="#" className="text-[12px] font-medium text-muted-foreground hover:underline">User Agreement</Link>
        <Link to="#" className="text-[12px] font-medium text-muted-foreground hover:underline">Privacy Policy</Link>
        <Link to="#" className="text-[12px] font-medium text-muted-foreground hover:underline">Content Policy</Link>
        <Link to="#" className="text-[12px] font-medium text-muted-foreground hover:underline">Moderator Code of Conduct</Link>
        <hr className="w-full my-2 border-border" />
        <p className="text-[12px] font-medium text-muted-foreground">Reddit, Inc. © 2026. All rights reserved.</p>
      </div>
    </aside>
  );
};

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-glass backdrop-blur-3xl border-t border-border flex items-center justify-around h-[calc(60px+env(safe-area-inset-bottom))] pb-env(safe-area-inset-bottom) md:hidden z-50">
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
            <div className="flex justify-center w-full max-w-[1400px] mx-auto pt-[calc(60px+env(safe-area-inset-top))] flex-1">
              <LeftSidebar />
              <main className="flex-1 w-full max-w-[760px] px-0 sm:px-6 pt-0 sm:pt-6 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-24 relative min-h-[85vh]">
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
