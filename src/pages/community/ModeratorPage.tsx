import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useCommunity, usePosts } from '@/hooks';

export const ModeratorPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { data: community, isLoading } = useCommunity(name);
  const { data: posts = [] } = usePosts('new', community?.id);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading moderator tools...</div>;
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

      <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <Link className="block text-primary hover:underline" to={`/r/settings/${community.name}`}>
          Open community settings
        </Link>
        <Link className="block text-primary hover:underline" to={`/r/${community.name}`}>
          View public community page
        </Link>
      </div>
    </div>
  );
};