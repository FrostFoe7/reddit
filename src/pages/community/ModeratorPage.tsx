import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/useStore';
import {
  useBanCommunityMember,
  useCommunity,
  useDeletePost,
  usePosts,
  useRemoveCommunityMember,
} from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const ModeratorPage: React.FC = () => {
  const { subreddit } = useParams<{ subreddit: string }>();
  const decodedName = subreddit ? decodeURIComponent(subreddit) : undefined;
  const currentUser = useAuthStore(state => state.user);
  const { data: community, isLoading, error } = useCommunity(decodedName);
  const { data: posts = [] } = usePosts('new', community?.id);
  const { mutate: removeMember, isPending: isRemovingMember } = useRemoveCommunityMember();
  const { mutate: banMember, isPending: isBanningMember } = useBanCommunityMember();
  const { mutate: removePost, isPending: isRemovingPost } = useDeletePost();
  const [banReason, setBanReason] = React.useState('');

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading moderator tools...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-destructive">Failed to load moderator tools.</div>;
  }

  if (!community) {
    return <div className="p-8 text-center text-muted-foreground">Community not found.</div>;
  }

  if (!community.can_manage) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        You do not have moderator permissions for this community.
      </div>
    );
  }

  const members = community.members_list || [];

  return (
    <div className="space-y-6 px-4 sm:px-0">
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-primary" />
        <h1 className="text-3xl font-bold">Moderator Tools</h1>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Community Snapshot</h2>
        <p className="text-sm text-muted-foreground">r/{community.name}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-border p-3">
            <p className="text-muted-foreground">Members</p>
            <p className="text-lg font-bold">{community.members || 0}</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-muted-foreground">Posts</p>
            <p className="text-lg font-bold">{posts.length}</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="text-muted-foreground">Your role</p>
            <p className="text-lg font-bold capitalize">{community.current_user_role || 'member'}</p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Moderation</h2>
        <Input
          value={banReason}
          onChange={event => setBanReason(event.target.value)}
          placeholder="Optional ban reason"
        />

        <div className="space-y-3">
          {members.length === 0 && <p className="text-sm text-muted-foreground">No members to moderate.</p>}
          {members.map(member => {
            const isSelf = currentUser?.id === member.id;
            const isProtected = member.role === 'admin' || member.id === community.creator_id;

            return (
              <div key={member.id} className="rounded-xl border border-border p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">u/{member.username}</p>
                  <p className="text-xs text-muted-foreground">Role: {member.role || 'member'}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isSelf || isProtected || isRemovingMember}
                    onClick={() =>
                      removeMember({ subredditId: community.id, targetUserId: member.id })
                    }
                  >
                    Remove
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={isSelf || isProtected || isBanningMember}
                    onClick={() =>
                      banMember({
                        subredditId: community.id,
                        targetUserId: member.id,
                        reason: banReason || undefined,
                      })
                    }
                  >
                    Ban
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Post Actions</h2>
        {posts.length === 0 && <p className="text-sm text-muted-foreground">No posts to moderate.</p>}
        <div className="space-y-3">
          {posts.slice(0, 15).map(post => (
            <div key={post.id} className="rounded-xl border border-border p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold truncate">{post.title}</p>
                <p className="text-xs text-muted-foreground truncate">u/{post.author_username || post.author_id}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={isRemovingPost}
                onClick={() => removePost(post.id)}
              >
                Remove Post
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <Link className="block text-primary hover:underline" to={`/r/settings/${encodeURIComponent(community.name)}`}>
          Open community settings
        </Link>
        <Link className="block text-primary hover:underline" to={`/r/${encodeURIComponent(community.name)}`}>
          View public community page
        </Link>
      </div>
    </div>
  );
};
