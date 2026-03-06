import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Share2, Flag, Bell, Ban, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUIStore, useAuthStore } from '@/store/useStore';
import { toast } from 'sonner';
import { useDeleteCommunity, useJoinCommunity, useLeaveCommunity, useUserMemberships } from '@/hooks';
import { useNavigate } from 'react-router-dom';

interface CommunityHeaderProps {
  sub: {
    id: string;
    name: string;
    members?: string | number;
    creator_id?: string;
    description?: string;
    desc?: string;
    icon_url?: string;
    icon?: string;
    banner_url?: string;
    can_manage?: boolean;
    current_user_role?: 'member' | 'moderator' | 'admin' | null;
    is_joined?: boolean;
  };
}

export const CommunityHeader: React.FC<CommunityHeaderProps> = ({ sub }) => {
  const navigate = useNavigate();
  const { openShare, openReport } = useUIStore();
  const user = useAuthStore(state => state.user);

  const { data: memberships = [] } = useUserMemberships();
  const { mutate: joinMutate } = useJoinCommunity();
  const { mutate: leaveMutate } = useLeaveCommunity();
  const { mutate: deleteCommunity } = useDeleteCommunity();

  const isJoined = typeof sub.is_joined === 'boolean' ? sub.is_joined : memberships.includes(sub.id);

  const toggleJoin = () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (isJoined) {
      leaveMutate(sub.id);
    } else {
      joinMutate(sub.id);
    }
  };

  const subIcon = sub.icon_url || sub.icon;
  const subDesc = sub.description || sub.desc;
  const subMembers = sub.members || 0;
  const canManage = Boolean(sub.can_manage) || ['moderator', 'admin'].includes(sub.current_user_role || '');
  const bannerStyle = sub.banner_url ? { backgroundImage: `url(${sub.banner_url})` } : undefined;

  const handleDelete = () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    const shouldDelete = window.confirm(`Delete r/${sub.name}? This action cannot be undone.`);
    if (!shouldDelete) return;

    deleteCommunity(sub.id, {
      onSuccess: () => {
        navigate('/');
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to delete community');
      },
    });
  };

  return (
    <div className="bg-card border-b sm:border border-border sm:rounded-[32px] overflow-hidden mb-6 shadow-ios-subtle relative">
      <div
        className={cn(
          'h-28 sm:h-36 opacity-90 relative bg-gradient-to-r from-primary/20 to-primary/40 bg-cover bg-center',
        )}
        style={bannerStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full text-white backdrop-blur-xl transition-colors shadow-sm"
            >
              <MoreHorizontal size={22} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[220px] rounded-[20px] p-1.5 bg-glass backdrop-blur-2xl shadow-ios-float border-border"
          >
            <DropdownMenuItem
              className="rounded-xl p-2.5 font-medium flex justify-between"
              onClick={() => openShare(window.location.href)}
            >
              Share <Share2 size={18} className="text-muted-foreground" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl p-2.5 font-medium flex justify-between"
              onClick={() => toast.info('Notifications turned on')}
            >
              Mute Notifications <Bell size={18} className="text-muted-foreground" />
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border my-1 mx-2" />
            <DropdownMenuItem className="rounded-xl p-2.5 font-medium flex justify-between">
              Community Info <Info size={18} className="text-muted-foreground" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl p-2.5 font-medium flex justify-between text-destructive focus:text-destructive"
              onClick={() => toast.error('Community blocked')}
            >
              Block Community <Ban size={18} />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl p-2.5 font-medium flex justify-between text-destructive focus:text-destructive"
              onClick={() => openReport(`sub_${sub.id}`)}
            >
              Report <Flag size={18} />
            </DropdownMenuItem>
            {canManage && (
              <>
                <DropdownMenuSeparator className="bg-border my-1 mx-2" />
                <DropdownMenuItem
                  className="rounded-xl p-2.5 font-medium"
                  onClick={() => navigate(`/r/settings/${encodeURIComponent(sub.name)}`)}
                >
                  Community Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl p-2.5 font-medium"
                  onClick={() => navigate(`/r/mod/${encodeURIComponent(sub.name)}`)}
                >
                  Moderator Tools
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border my-1 mx-2" />
                <DropdownMenuItem
                  className="rounded-xl p-2.5 font-medium flex justify-between text-destructive focus:text-destructive"
                  onClick={handleDelete}
                >
                  Delete Community <Ban size={18} />
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="px-5 sm:px-8 pb-8 relative">
        <div className="flex justify-between items-end mb-4">
          <div
            className={cn(
              'w-[88px] h-[88px] sm:w-[104px] sm:h-[104px] rounded-full border-4 border-card flex items-center justify-center text-white text-3xl font-bold -mt-[44px] sm:-mt-[52px] relative shadow-md tracking-tighter bg-primary overflow-hidden',
            )}
          >
            {subIcon ? (
              <img src={subIcon} alt={`r/${sub.name} icon`} className="w-full h-full object-cover" />
            ) : (
              'r/'
            )}
          </div>
          <Button
            onClick={toggleJoin}
            variant={isJoined ? 'outline' : 'default'}
            className={cn(
              'h-11 px-6 rounded-full font-bold text-sm shadow-sm transition-all active:scale-95',
              isJoined
                ? 'border-border text-foreground hover:bg-muted'
                : 'bg-primary text-white hover:opacity-90',
            )}
          >
            {isJoined ? 'Joined' : 'Join'}
          </Button>
        </div>
        <h1 className="text-3xl sm:text-3xl font-bold text-foreground leading-tight tracking-tight mb-1">
          r/{sub.name}
        </h1>
        <p className="text-sm text-muted-foreground font-medium mb-4">
          r/{sub.name} • {subMembers} Members
        </p>
        <p className="text-base text-foreground leading-relaxed max-w-2xl font-medium">{subDesc}</p>
      </div>
    </div>
  );
};
