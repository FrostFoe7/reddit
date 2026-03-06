import { useLocation, Link, useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  useCommunities,
  usePosts,
  useUserMemberships,
  useJoinCommunity,
  useLeaveCommunity,
  useUser,
  useTopCommunities,
} from '@/hooks';
import type { Community, Post } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useStore';
import dayjs from '@/lib/dayjs';

export const RightSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const { data: communities = [] } = useCommunities();
  const { data: topCommunities = [] } = useTopCommunities(5);
  const { data: posts = [] } = usePosts();
  const { data: memberships = [] } = useUserMemberships();
  const { mutate: joinMutate } = useJoinCommunity();
  const { mutate: leaveMutate } = useLeaveCommunity();

  const isSubredditPage =
    location.pathname.startsWith('/r/') && !location.pathname.includes('/r/popular');
  const isPostPage = location.pathname.startsWith('/post/');
  const isProfilePage = location.pathname.startsWith('/u/');

  let communityContext: Community | null = null;
  const profileUsername = isProfilePage ? location.pathname.split('/')[2] : null;
  const { data: profileUser } = useUser(profileUsername || undefined);

  if (isSubredditPage) {
    const subName = location.pathname.split('/')[2];
    communityContext = communities.find((c: Community) => c.name === subName) || null;
  } else if (isPostPage) {
    const postId = location.pathname.split('/')[2];
    const post = posts.find((p: Post) => p.id === postId);
    if (post) {
      const subName = post.subreddit_name || post.sub;
      communityContext = communities.find((c: Community) => c.name === subName) || null;
    }
  }

  const isCreatePage = location.pathname === '/create';
  const showCommunityInfo = isSubredditPage || isPostPage;

  const handleAction = (label: string) => {
    if (label === 'Chat' || label === 'Message Mods') {
      navigate('/messages');
      return;
    }

    toast.success(`${label} completed`);
  };

  const handleExternal = (label: string) => {
    const links: Record<string, string> = {
      'User Agreement': 'https://www.redditinc.com/policies/user-agreement',
      'Privacy Policy': 'https://www.redditinc.com/policies/privacy-policy',
      'Content Policy': 'https://www.redditinc.com/policies/content-policy',
      'Moderator Code': 'https://www.redditinc.com/policies/moderator-code-of-conduct',
    };

    const target = links[label];
    if (target) {
      window.open(target, '_blank', 'noopener,noreferrer');
      return;
    }

    toast.info(`${label}`);
  };

  const handleJoinLeave = (e: React.MouseEvent, subId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (memberships.includes(subId)) {
      leaveMutate(subId);
    } else {
      joinMutate(subId);
    }
  };

  const contextIcon = communityContext?.icon_url || communityContext?.icon;
  const contextDesc = communityContext?.description || communityContext?.desc;
  const contextMembers = communityContext?.members || '0';
  const isContextJoined = communityContext ? memberships.includes(communityContext.id) : false;

  return (
    <aside
      id="right-sidebar"
      className="hidden xl:flex flex-col w-[312px] shrink-0 border-l border-border sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto pb-8 styled-scrollbars no-scrollbar transition-colors duration-400"
    >
      <div className="flex flex-col p-4 space-y-6">
        {isCreatePage && (
          <div className="flex flex-col space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">📝</span>
                </div>
                <h3 className="text-base font-bold text-foreground">Posting to Reddit</h3>
              </div>
              <ol className="flex flex-col pt-2">
                {[
                  'Remember the human',
                  'Behave like you would in real life',
                  'Look for the original source of content',
                  'Search for duplicates before posting',
                  "Read the community's rules",
                ].map((rule, i) => (
                  <li key={i} className="flex flex-col">
                    <div className="flex gap-3 text-sm font-medium py-3">
                      <span className="text-muted-foreground whitespace-nowrap font-bold opacity-50">
                        {i + 1}.
                      </span>
                      <span className="text-foreground leading-snug">{rule}</span>
                    </div>
                    {i < 4 && <Separator className="opacity-50" />}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {isProfilePage && profileUser && (
          <div className="flex flex-col space-y-3">
            <div className="bg-secondary-background/50 rounded-2xl p-4 flex flex-col gap-4 border border-border shadow-sm">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-foreground capitalize">
                  {profileUser.username}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  u/{profileUser.username}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-foreground leading-normal italic">
                  {profileUser.bio || 'No bio yet.'}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Separator className="opacity-50" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-base font-bold">{profileUser.karma}</span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Karma
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold">
                      {dayjs(profileUser.cake_day).format('MMM D, YYYY')}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Cake Day
                    </span>
                  </div>
                </div>
                <Separator className="opacity-50" />
              </div>

              <div className="flex flex-col gap-2">
                {user?.id !== profileUser.id && (
                  <>
                    <Button
                      onClick={() => handleAction('Follow')}
                      className="w-full rounded-full font-bold h-10 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Follow
                    </Button>
                    <Button
                      onClick={() => handleAction('Chat')}
                      variant="outline"
                      className="w-full rounded-full font-bold h-10 border-primary text-primary hover:bg-primary/5"
                    >
                      Chat
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {showCommunityInfo && communityContext && (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                About Community
              </h3>
            </div>
            <div className="bg-secondary-background/50 rounded-2xl p-4 flex flex-col gap-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm',
                    contextIcon || 'bg-primary',
                  )}
                >
                  r/
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base">r/{communityContext.name}</span>
                  <div className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Online
                  </div>
                </div>
              </div>
              <p className="text-sm text-foreground leading-normal">
                {contextDesc ||
                  'A community for creators, developers, entrepreneurs, and makers to openly share their journey.'}
              </p>

              <div className="flex flex-col gap-3">
                <Separator className="opacity-50" />
                <div className="flex gap-6 py-1">
                  <div className="flex flex-col">
                    <span className="text-base font-bold">{contextMembers}</span>
                    <span className="text-xs text-muted-foreground font-medium">Members</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold">4.5k</span>
                    <span className="text-xs text-muted-foreground font-medium">Online</span>
                  </div>
                </div>
                <Separator className="opacity-50" />
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={e => handleJoinLeave(e, communityContext!.id)}
                  variant={isContextJoined ? 'outline' : 'default'}
                  className={cn(
                    'w-full rounded-full font-bold h-10 shadow-sm transition-all',
                    isContextJoined
                      ? 'border-border text-foreground hover:bg-muted'
                      : 'bg-primary text-white hover:opacity-90',
                  )}
                >
                  {isContextJoined ? 'Joined' : 'Join'}
                </Button>
                <Button
                  onClick={() => navigate('/create', { state: { subredditId: communityContext?.id } })}
                  variant="outline"
                  className="w-full rounded-full font-bold h-10 border-primary text-primary hover:bg-primary/5"
                >
                  Create Post
                </Button>
              </div>
            </div>
          </div>
        )}

        {showCommunityInfo && (communityContext?.rules?.length ?? 0) > 0 && (
          <div className="flex flex-col space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">
              r/{communityContext?.name} Rules
            </h3>
            <div className="space-y-1">
              {communityContext?.rules?.map((rule, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2 hover:bg-muted rounded-xl cursor-pointer transition-colors group"
                >
                  <span className="text-xs font-bold text-muted-foreground mt-0.5 opacity-50">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {rule.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showCommunityInfo && (communityContext?.moderators?.length ?? 0) > 0 && (
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Moderators
              </h3>
              <Button
                onClick={() => handleAction('Message Mods')}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-primary/10"
              >
                <MessageSquare size={16} className="text-primary" />
              </Button>
            </div>
            <div className="flex flex-col space-y-1 px-1">
              {communityContext?.moderators?.map(mod => (
                <Link
                  key={mod.id}
                  to={`/u/${mod.username}`}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded-xl transition-colors group"
                >
                  <Avatar className="h-7 w-7 border border-border/50">
                    <AvatarImage
                      src={
                        mod.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${mod.username}`
                      }
                    />
                    <AvatarFallback>{mod.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-bold group-hover:text-primary transition-colors">
                    u/{mod.username}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!showCommunityInfo && !isCreatePage && !isProfilePage && (
          <>
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Recent Posts
                </h3>
              </div>
              <div className="flex flex-col space-y-1">
                {posts.slice(0, 4).map((post: Post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="px-2 py-2.5 hover:bg-muted rounded-xl transition-colors flex flex-col gap-1 group"
                  >
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Avatar className="w-4 h-4">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.subreddit_name || post.sub}&backgroundColor=ff4500`}
                        />
                        <AvatarFallback
                          className={cn(
                            'text-[10px] font-bold text-white',
                            post.subreddit_icon || post.subIcon || 'bg-primary',
                          )}
                        >
                          r/
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-foreground/80 group-hover:underline">
                        r/{post.subreddit_name || post.sub}
                      </span>
                      <span>•</span>
                      <span>{dayjs(post.created_at).fromNow()}</span>
                    </div>
                    <h4 className="text-xs font-semibold leading-snug text-foreground group-hover:underline line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="text-[11px] text-muted-foreground font-medium">
                      {post.upvotes} upvotes • {post.comment_count || post.comments || 0} comments
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">
                Top Communities
              </h3>
              <div className="flex flex-col space-y-1">
                {topCommunities.map((community: Community, i: number) => {
                  const isJoined = memberships.includes(community.id);
                  return (
                    <Link
                      key={community.id}
                      to={`/r/${community.name}`}
                      className="flex items-center justify-between px-2 py-2 hover:bg-muted rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground w-4 opacity-50">
                          {i + 1}
                        </span>
                        <div
                          className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-sm transition-transform group-hover:scale-110',
                            community.icon_url || community.icon || 'bg-primary',
                          )}
                        >
                          r/
                        </div>
                        <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                          r/{community.name}
                        </span>
                      </div>
                      <Button
                        onClick={e => handleJoinLeave(e, community.id)}
                        variant={isJoined ? 'secondary' : 'outline'}
                        size="sm"
                        className={cn(
                          'rounded-full h-7 px-3 font-bold text-[11px] shadow-sm',
                          !isJoined && 'border-primary text-primary hover:bg-primary/5',
                        )}
                      >
                        {isJoined ? 'Joined' : 'Join'}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col gap-4 mt-4">
          <Separator />
          <div className="px-2 flex flex-wrap gap-x-3 gap-y-1">
            {['User Agreement', 'Privacy Policy', 'Content Policy', 'Moderator Code'].map(link => (
              <button
                key={link}
                onClick={() => handleExternal(link)}
                className="text-[11px] font-bold text-muted-foreground hover:text-primary hover:underline transition-colors"
              >
                {link}
              </button>
            ))}
            <p className="text-[11px] font-bold text-muted-foreground mt-3 w-full opacity-50">
              Reddit, Inc. © 2026. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
