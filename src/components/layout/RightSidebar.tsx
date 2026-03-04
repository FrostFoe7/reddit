import { useLocation, Link, useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCommunities, usePosts } from "@/hooks";
import type { Community, Post } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const RightSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: communities = [] } = useCommunities();
  const { data: posts = [] } = usePosts();

  const isSubredditPage =
    location.pathname.startsWith("/r/") &&
    !location.pathname.includes("/r/popular");
  const isPostPage = location.pathname.startsWith("/post/");
  const isProfilePage = location.pathname.startsWith("/u/");

  let communityContext: Community | null = null;
  let userContext = null;

  if (isSubredditPage) {
    const subName = location.pathname.split("/")[2];
    communityContext =
      communities.find(
        (c: Community) => c.id === subName || c.name === subName,
      ) || null;
  } else if (isPostPage) {
    const postId = location.pathname.split("/")[2];
    const post = posts.find((p: Post) => p.id === postId);
    if (post) {
      const subName = post.subreddit_name || post.sub;
      communityContext =
        communities.find(
          (c: Community) => c.id === subName || c.name === subName,
        ) || null;
    }
  } else if (isProfilePage) {
    userContext = location.pathname.split("/")[2];
  }

  const isCreatePage = location.pathname === "/create";
  const showCommunityInfo = isSubredditPage || isPostPage;

  const handleAction = (label: string) => {
    toast.success(`${label} action performed!`, {
      description: "This is a demo action.",
    });
  };

  const handleExternal = (label: string) => {
    toast.info(`Opening ${label}...`, {
      description: "Redirecting to external Reddit resource.",
    });
  };

  const contextIcon = communityContext?.icon_url || communityContext?.icon;
  const contextDesc = communityContext?.description || communityContext?.desc;
  const contextMembers = communityContext?.members || "1.2m";

  return (
    <aside
      id="right-sidebar"
      className="hidden xl:flex flex-col w-[312px] shrink-0 border-l border-border sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto pb-8 styled-scrollbars no-scrollbar transition-colors duration-400"
    >
      <div className="flex flex-col p-4 space-y-6">
        {isCreatePage && (
          <div className="flex flex-col space-y-4">
            <div className="bg-card border border-border rounded-[16px] p-4 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-[20px]">📝</span>
                </div>
                <h3 className="text-[16px] font-bold text-foreground">
                  Posting to Reddit
                </h3>
              </div>
              <ol className="flex flex-col space-y-3 pt-2">
                {[
                  "Remember the human",
                  "Behave like you would in real life",
                  "Look for the original source of content",
                  "Search for duplicates before posting",
                  "Read the community's rules",
                ].map((rule, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-[14px] font-medium border-b border-border/50 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-muted-foreground whitespace-nowrap font-bold opacity-50">
                      {i + 1}.
                    </span>
                    <span className="text-foreground leading-snug">{rule}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="text-[12px] text-muted-foreground px-2 leading-relaxed">
              Please be mindful of Reddit's{" "}
              <button
                onClick={() => handleExternal("Content Policy")}
                className="text-primary hover:underline font-bold"
              >
                Content Policy
              </button>{" "}
              and practice good{" "}
              <button
                onClick={() => handleExternal("Reddiquette")}
                className="text-primary hover:underline font-bold"
              >
                reddiquette
              </button>
              .
            </div>
          </div>
        )}

        {isProfilePage && userContext && (
          <div className="flex flex-col space-y-3">
            <div className="bg-secondary-background/50 rounded-[16px] p-4 flex flex-col gap-4 border border-border shadow-sm">
              <div className="flex flex-col gap-1">
                <h3 className="text-[16px] font-bold text-foreground capitalize">
                  {userContext}
                </h3>
                <p className="text-[12px] text-muted-foreground font-medium">
                  u/{userContext}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[14px] text-foreground leading-normal italic">
                  "Bull | Couple | Dhaka |"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-border/50 py-3">
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold">1,245</span>
                  <span className="text-[12px] text-muted-foreground font-medium uppercase tracking-wider">
                    Karma
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold">Aug 12, 2023</span>
                  <span className="text-[12px] text-muted-foreground font-medium uppercase tracking-wider">
                    Cake Day
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleAction("Follow")}
                  className="w-full rounded-full font-bold h-10 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Follow
                </Button>
                <Button
                  onClick={() => handleAction("Chat")}
                  variant="outline"
                  className="w-full rounded-full font-bold h-10 border-primary text-primary hover:bg-primary/5"
                >
                  Chat
                </Button>
              </div>
            </div>

            <div className="bg-secondary-background/50 rounded-[16px] p-4 flex flex-col gap-3 border border-border shadow-sm">
              <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                Achievements
              </h3>
              <div className="flex gap-2 px-1">
                <div
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-[20px] shadow-sm"
                  title="Banana Aficionado"
                >
                  🍌
                </div>
                <div
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-[20px] shadow-sm"
                  title="Detective Doggo"
                >
                  🐶
                </div>
                <div
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-[20px] shadow-sm"
                  title="Banana Enthusiast"
                >
                  🍌
                </div>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-[14px] font-bold text-muted-foreground shadow-sm">
                  +8
                </div>
              </div>
              <Button
                onClick={() => handleAction("View Achievements")}
                variant="ghost"
                className="w-full text-primary font-bold text-[12px] py-1 justify-start px-1 h-auto hover:bg-transparent hover:underline"
              >
                View your achievements
              </Button>
            </div>
          </div>
        )}

        {showCommunityInfo && communityContext && (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">
                About Community
              </h3>
            </div>
            <div className="bg-secondary-background/50 rounded-[16px] p-4 flex flex-col gap-4 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white shadow-sm",
                    contextIcon,
                  )}
                >
                  r/
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[16px]">
                    r/{communityContext.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-[12px] text-green-500 font-medium">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>{" "}
                    Online
                  </div>
                </div>
              </div>
              <p className="text-[14px] text-foreground leading-normal">
                {contextDesc ||
                  "A community for creators, developers, entrepreneurs, and makers to openly share their journey."}
              </p>
              <div className="flex gap-6 border-y border-border/50 py-3">
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold">
                    {contextMembers}
                  </span>
                  <span className="text-[12px] text-muted-foreground font-medium">
                    Members
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold">4.5k</span>
                  <span className="text-[12px] text-muted-foreground font-medium">
                    Online
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleAction("Join")}
                  className="w-full rounded-full font-bold h-10 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Join
                </Button>
                <Button
                  onClick={() => navigate("/create")}
                  variant="outline"
                  className="w-full rounded-full font-bold h-10 border-primary text-primary hover:bg-primary/5"
                >
                  Create Post
                </Button>
              </div>
            </div>
          </div>
        )}

        {showCommunityInfo && (
          <div className="flex flex-col space-y-3">
            <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest px-2">
              r/{communityContext?.name || "community"} Rules
            </h3>
            <div className="space-y-1">
              {[
                "Be Respectful",
                "Stay on Topic",
                "No Self-Promotion Without Context",
                "No Spam",
              ].map((rule, i) => (
                <div
                  key={i}
                  onClick={() => handleAction(`Rule ${i + 1}`)}
                  className="flex items-start gap-3 p-2 hover:bg-muted rounded-[12px] cursor-pointer transition-colors group"
                >
                  <span className="text-[12px] font-bold text-muted-foreground mt-0.5 opacity-50">
                    {i + 1}
                  </span>
                  <span className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">
                    {rule}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showCommunityInfo && (
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">
                Moderators
              </h3>
              <Button
                onClick={() => handleAction("Message Mods")}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-primary/10"
              >
                <MessageSquare size={16} className="text-primary" />
              </Button>
            </div>
            <div className="flex flex-col space-y-1 px-1">
              {["doctor-_-atomic", "mod-person", "stuckyfeet"].map((mod) => (
                <Link
                  key={mod}
                  to={`/u/${mod}`}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded-[12px] transition-colors group"
                >
                  <Avatar className="h-7 w-7 border border-border/50">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mod}`}
                    />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <span className="text-[13px] font-bold group-hover:text-primary transition-colors">
                    u/{mod}
                  </span>
                </Link>
              ))}
              <Button
                onClick={() => handleAction("View All Moderators")}
                variant="ghost"
                className="w-full text-primary font-bold text-[12px] py-2.5 rounded-[12px] h-auto hover:bg-primary/5 mt-1 border border-transparent hover:border-primary/20"
              >
                View All Moderators
              </Button>
            </div>
          </div>
        )}

        {!showCommunityInfo && !isCreatePage && !isProfilePage && (
          <>
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">
                  Recent Posts
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80 hover:bg-transparent h-auto p-0 font-bold text-[12px]"
                >
                  Clear
                </Button>
              </div>
              <div className="flex flex-col space-y-1">
                {posts.slice(0, 4).map((post: Post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="px-2 py-2.5 hover:bg-muted rounded-[12px] transition-colors flex flex-col gap-1 group"
                  >
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Avatar className="w-4 h-4">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.subreddit_name || post.sub}&backgroundColor=ff4500`}
                        />
                        <AvatarFallback
                          className={cn(
                            "text-[10px] font-bold text-white",
                            post.subreddit_icon || post.subIcon,
                          )}
                        >
                          r/
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-foreground/80 group-hover:underline">
                        r/{post.subreddit_name || post.sub}
                      </span>
                      <span>•</span>
                      <span>3d ago</span>
                    </div>
                    <h4 className="text-[13px] font-semibold leading-snug text-foreground group-hover:underline line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="text-[11px] text-muted-foreground font-medium">
                      {post.upvotes} upvotes •{" "}
                      {post.comment_count || post.comments || 0} comments
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <h3 className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest px-2">
                Top Communities
              </h3>
              <div className="flex flex-col space-y-1">
                {communities
                  .slice(0, 5)
                  .map((community: Community, i: number) => (
                    <Link
                      key={community.id}
                      to={`/r/${community.id}`}
                      className="flex items-center justify-between px-2 py-2 hover:bg-muted rounded-[12px] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] font-bold text-muted-foreground w-4 opacity-50">
                          {i + 1}
                        </span>
                        <div
                          className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-sm transition-transform group-hover:scale-110",
                            community.icon_url || community.icon,
                          )}
                        >
                          r/
                        </div>
                        <span className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">
                          r/{community.name}
                        </span>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAction("Join");
                        }}
                        variant="outline"
                        size="sm"
                        className="rounded-full h-7 px-3 font-bold border-primary text-primary hover:bg-primary/5 text-[11px] shadow-sm"
                      >
                        Join
                      </Button>
                    </Link>
                  ))}
                <Button
                  onClick={() => navigate("/explore")}
                  variant="ghost"
                  className="w-full text-primary font-bold text-[12px] py-2.5 rounded-[12px] h-auto hover:bg-primary/5 mt-1 border border-transparent hover:border-primary/20"
                >
                  View All
                </Button>
              </div>
            </div>
          </>
        )}

        <div className="px-2 pt-4 flex flex-wrap gap-x-3 gap-y-1 border-t border-border mt-4">
          {[
            "User Agreement",
            "Privacy Policy",
            "Content Policy",
            "Moderator Code",
          ].map((link) => (
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
    </aside>
  );
};
