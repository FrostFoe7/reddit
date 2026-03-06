import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/useStore';
import { useCommunity, useUpdateCommunity } from '@/hooks';

export const CommunitySettingsPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const user = useAuthStore(state => state.user);
  const { data: community, isLoading } = useCommunity(name);
  const { mutate: updateCommunity, isPending } = useUpdateCommunity();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold">Please login to manage community settings</h2>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading community...</div>;
  }

  if (!community) {
    return <div className="p-8 text-center text-muted-foreground">Community not found.</div>;
  }

  if (!community.can_manage) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold">You do not have permission to manage this community</h2>
      </div>
    );
  }

  return <CommunitySettingsForm community={community} isPending={isPending} onSubmit={updateCommunity} />;
};

const CommunitySettingsForm: React.FC<{
  community: NonNullable<ReturnType<typeof useCommunity>['data']>;
  isPending: boolean;
  onSubmit: ReturnType<typeof useUpdateCommunity>['mutate'];
}> = ({ community, isPending, onSubmit }) => {
  const navigate = useNavigate();
  const [description, setDescription] = useState(community.description || '');
  const [iconUrl, setIconUrl] = useState(community.icon_url || '');
  const [bannerUrl, setBannerUrl] = useState(community.banner_url || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      {
        id: community.id,
        updates: {
          description,
          icon_url: iconUrl,
          banner_url: bannerUrl,
        },
      },
      {
        onSuccess: updated => {
          navigate(`/r/${updated.name}`);
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <h1 className="text-3xl font-bold mb-6">Community Settings</h1>
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="community-description" className="text-sm font-semibold">
            Description
          </label>
          <Textarea
            id="community-description"
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your community"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="community-icon-url" className="text-sm font-semibold">
            Icon CSS Class or URL
          </label>
          <Input
            id="community-icon-url"
            value={iconUrl}
            onChange={e => setIconUrl(e.target.value)}
            placeholder="bg-primary or https://example.com/icon.png"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="community-banner-url" className="text-sm font-semibold">
            Banner URL
          </label>
          <Input
            id="community-banner-url"
            value={bannerUrl}
            onChange={e => setBannerUrl(e.target.value)}
            placeholder="https://example.com/banner.png"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-full">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="rounded-full">
            {isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};