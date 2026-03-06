import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  MessageSquare,
  SquarePlus,
  Megaphone,
  Menu,
  User,
  Settings,
  Moon,
  Sun,
  LogOut,
  Star,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMarkNotificationRead, useMarkNotificationsRead, useNotifications } from '@/hooks';
import { useAuth } from '@/hooks';
import type { Notification } from '@/types';
import { useTheme } from 'next-themes';
import { SearchBar } from './SearchBar';
import { useUIStore } from '@/store/useStore';
import { toast } from 'sonner';

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toggleSidebar } = useUIStore();
  const { user, isAuthenticated, logout } = useAuth();
  const { data: notifications = [] } = useNotifications();
  const { mutate: markAllNotificationsRead } = useMarkNotificationsRead();
  const { mutate: markNotificationRead } = useMarkNotificationRead();
  const unreadCount = notifications.filter((n: Notification) => !n.is_read).length;

  const handleAction = (label: string) => {
    toast.info(label);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead(undefined, {
      onSuccess: () => {
        toast.success('All notifications marked as read', {
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        });
      },
    });
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="fixed top-0 inset-x-0 h-14 bg-background flex flex-col z-50">
      <div className="flex-1 flex items-center justify-between px-2 sm:px-4">
        <div className="flex items-center gap-0.5 sm:gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 sm:h-10 sm:w-10"
                  onClick={toggleSidebar}
                >
                  <Menu size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Toggle navigation</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Link
            to="/"
            className="flex items-center gap-2 pr-1 sm:pr-4 group"
            aria-label="Reddit Home"
          >
           <span>TimesForum</span>
          </Link>
        </div>

        <div className="flex-1 max-w-3xl mx-4 hidden md:block">
          <SearchBar />
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 md:hidden"
            onClick={() => navigate('/search')}
          >
            <Search size={20} />
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleAction('Advertise')}
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 hidden sm:flex"
                >
                  <Megaphone size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Advertise</TooltipContent>
            </Tooltip>

            {isAuthenticated ? (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => navigate('/messages')}
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-10 w-10 relative"
                    >
                      <MessageSquare size={20} />
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Chat</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-10 w-10"
                      onClick={() => navigate('/posts/create')}
                    >
                      <SquarePlus size={20} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Create Post</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 relative">
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[calc(100vw-32px)] sm:w-80 rounded-[20px] p-0 overflow-hidden shadow-ios-float border-border mt-2"
                  >
                    <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                      <span className="font-bold text-sm">Notifications</span>
                      <Button
                        onClick={handleMarkAllRead}
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs font-bold text-primary hover:bg-transparent"
                      >
                        Read All
                      </Button>
                    </div>
                    <div className="max-h-[70vh] sm:max-h-[400px] overflow-y-auto no-scrollbar">
                      {notifications.map((n: Notification) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (!n.is_read) {
                              markNotificationRead(n.id);
                            }
                            navigate('/notifications');
                          }}
                          className="p-4 flex gap-3 hover:bg-muted cursor-pointer transition-colors border-b border-border last:border-0 relative"
                        >
                          {!n.is_read && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                          )}
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${n.user || n.sub}`}
                            />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0 justify-center">
                            <p className="text-sm leading-snug">
                              <span className="font-bold">{n.user || n.sub}</span> {n.text}
                            </p>
                            <span className="text-xs text-muted-foreground mt-1 font-medium">
                              {n.created_at}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-muted/10 border-t border-border text-center">
                      <Button
                        onClick={() => navigate('/notifications')}
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs font-bold text-primary"
                      >
                        See all notifications
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-10 w-10 p-0 rounded-full hover:bg-muted ml-0.5 sm:ml-1"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              user?.avatar_url ||
                              user?.avatar ||
                              'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_0.png'
                            }
                          />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background"></span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 rounded-[20px] p-2 mt-2 shadow-ios-float border-border"
                  >
                    <div className="flex items-center gap-3 p-3 mb-2 border-b border-border pb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={
                            user?.avatar_url ||
                            user?.avatar ||
                            'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_0.png'
                          }
                        />
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-base">{user?.username}</span>
                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                          <Star size={12} className="text-primary fill-current" /> {user?.karma}{' '}
                          karma
                        </span>
                      </div>
                    </div>
                    <DropdownMenuItem
                      onClick={() => navigate(`/profile/${user?.username}`)}
                      className="rounded-xl py-3 font-semibold px-3"
                    >
                      <User size={20} className="mr-3 text-muted-foreground" /> View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate('/settings')}
                      className="rounded-xl py-3 font-semibold px-3"
                    >
                      <Settings size={20} className="mr-3 text-muted-foreground" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1.5" />
                    <DropdownMenuItem
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="rounded-xl py-3 font-semibold px-3"
                    >
                      {theme === 'dark' ? (
                        <Sun size={20} className="mr-3" />
                      ) : (
                        <Moon size={20} className="mr-3" />
                      )}
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1.5" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-xl py-3 font-semibold px-3 text-destructive focus:text-destructive"
                    >
                      <LogOut size={20} className="mr-3" /> Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2 px-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/auth/login')}
                  className="rounded-full hidden sm:flex"
                >
                  Log In
                </Button>
                <Button size="sm" onClick={() => navigate('/auth/register')} className="rounded-full">
                  Sign Up
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/auth/login')}
                  className="rounded-full h-10 w-10 sm:hidden"
                >
                  <User size={20} />
                </Button>
              </div>
            )}
          </TooltipProvider>
        </div>
      </div>
      <Separator />
    </header>
  );
};
