import type { Community } from "@/types";
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSearchPosts, useCommunities, useUserMemberships, useJoinCommunity, useLeaveCommunity } from "@/hooks";
import { PostCard } from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/useStore";

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const qLower = query.toLowerCase();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<"posts" | "communities">("posts");

  const { data: posts = [], isLoading: postsLoading } = useSearchPosts(query);
  const { data: communities = [] } = useCommunities();
  const { data: memberships = [] } = useUserMemberships();
  const { mutate: joinMutate } = useJoinCommunity();
  const { mutate: leaveMutate } = useLeaveCommunity();

  const filteredCommunities = communities.filter(
    (c: Community) =>
      c.name.toLowerCase().includes(qLower) ||
      (c.description || c.desc || "").toLowerCase().includes(qLower),
  );

  const handleJoinLeave = (e: React.MouseEvent, subId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
        navigate("/login");
        return;
    }
    if (memberships.includes(subId)) {
        leaveMutate(subId);
    } else {
        joinMutate(subId);
    }
  };

  return (
    <div
      id="view-search"
      className="view-section active animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="px-4 sm:px-0 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-5">
          Results for <span className="text-primary">"{query}"</span>
        </h1>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("posts")}
            className={cn(
                "px-6 py-2 rounded-full text-sm font-bold shadow-md transition-all",
                activeTab === "posts" ? "bg-foreground text-background" : "bg-muted text-foreground"
            )}
          >
            Posts
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("communities")}
            className={cn(
                "px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap shadow-md transition-all active:scale-95",
                activeTab === "communities" ? "bg-foreground text-background" : "bg-muted text-foreground"
            )}
          >
            Communities
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {activeTab === "communities" && (
          <div className="bg-card border-y sm:border border-border sm:rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border bg-muted/20">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-widest opacity-70">
                Communities
              </h3>
            </div>
            <div className="divide-y divide-border/50">
              {filteredCommunities.length > 0 ? filteredCommunities.map((community) => {
                const isJoined = memberships.includes(community.id);
                return (
                    <Link
                    key={community.id}
                    to={`/r/${community.name}`}
                    className="flex items-center justify-between p-4 sm:p-5 hover:bg-muted/50 transition-all group"
                    >
                    <div className="flex items-center gap-4">
                        <div
                        className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm tracking-tighter transition-transform group-hover:scale-110",
                            community.icon_url || community.icon || "bg-primary",
                        )}
                        >
                        r/
                        </div>
                        <div className="flex flex-col">
                        <div className="font-bold text-foreground group-hover:text-primary transition-colors text-base">
                            r/{community.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                            {community.members || 0} members
                        </div>
                        </div>
                    </div>
                    <Button
                        onClick={(e) => handleJoinLeave(e, community.id)}
                        variant={isJoined ? "secondary" : "outline"}
                        className={cn(
                            "rounded-full h-9 px-6 font-bold shadow-sm transition-all active:scale-95",
                            !isJoined && "border-primary text-primary hover:bg-primary/5"
                        )}
                    >
                        {isJoined ? "Joined" : "Join"}
                    </Button>
                    </Link>
                );
              }) : (
                  <div className="p-12 text-center text-muted-foreground">No communities found.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "posts" && (
            <div
            id="search-results-container"
            className="flex flex-col"
            >
            {posts.map((post, index) => (
                <React.Fragment key={post.id}>
                <PostCard post={post} />
                {index < posts.length - 1 && (
                    <Separator className="my-4 opacity-50" />
                )}
                </React.Fragment>
            ))}
            {!postsLoading && posts.length === 0 && (
                <div className="p-16 text-center text-muted-foreground font-medium bg-card rounded-3xl border border-border shadow-sm flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground">
                    <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-8 h-8 opacity-40"
                    >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-foreground">
                    No results found for "{query}"
                    </h3>
                    <p className="text-sm">
                    Try searching for something else or check your spelling.
                    </p>
                </div>
                </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
};
