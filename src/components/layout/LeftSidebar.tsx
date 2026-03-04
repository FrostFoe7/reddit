import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Newspaper, 
  Compass, 
  Plus, 
  Settings, 
  Gamepad2, 
  Info, 
  Megaphone, 
  PieChart, 
  LifeBuoy, 
  BookOpen, 
  Briefcase, 
  Mic2, 
  Users, 
  Star, 
  ShieldCheck 
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockCommunities } from '@/db/db';
import { cn } from '@/lib/utils';
import { SidebarNavItem } from './SidebarNavItem';

export const LeftSidebar = () => {
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
