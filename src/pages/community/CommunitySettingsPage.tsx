import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/useStore';
import { useCommunity, useUpdateCommunity } from '@/hooks';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function validateImageFile(file: File): string | null {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images are allowed.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Image must be 5MB or smaller.';
  }
  return null;
}

export const CommunitySettingsPage: React.FC = () => {
  const params = useParams<{ subreddit?: string; communityName?: string }>();
  const communityName = params.subreddit ?? params.communityName;
  const user = useAuthStore(state => state.user);
  const { data: community, isLoading, error } = useCommunity(communityName);
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

  if (error) {
    return <div className="p-8 text-center text-destructive">Failed to load community settings.</div>;
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
  const [description, setDescription] = React.useState(community.description || '');
  const [iconUrl, setIconUrl] = React.useState(community.icon_url || '');
  const [bannerUrl, setBannerUrl] = React.useState(community.banner_url || '');
  const [iconFile, setIconFile] = React.useState<File | null>(null);
  const [bannerFile, setBannerFile] = React.useState<File | null>(null);
  const [iconPreview, setIconPreview] = React.useState<string | null>(community.icon_url || null);
  const [bannerPreview, setBannerPreview] = React.useState<string | null>(community.banner_url || null);
  const [fileError, setFileError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setDescription(community.description || '');
    setIconUrl(community.icon_url || '');
    setBannerUrl(community.banner_url || '');
    setIconPreview(community.icon_url || null);
    setBannerPreview(community.banner_url || null);
    setIconFile(null);
    setBannerFile(null);
  }, [community]);

  const handleLocalFile = (target: 'icon' | 'banner', file?: File) => {
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setFileError(validationError);
      return;
    }

    setFileError(null);
    const previewUrl = URL.createObjectURL(file);

    if (target === 'icon') {
      setIconFile(file);
      setIconPreview(previewUrl);
      setIconUrl('');
      return;
    }

    setBannerFile(file);
    setBannerPreview(previewUrl);
    setBannerUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileError) return;

    onSubmit(
      {
        id: community.id,
        updates: {
          description,
          icon_url: iconUrl || undefined,
          banner_url: bannerUrl || undefined,
          iconFile,
          bannerFile,
        },
      },
      {
        onSuccess: updated => {
          navigate(`/r/${encodeURIComponent(updated.name)}`);
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
            Icon URL (optional)
          </label>
          <Input
            id="community-icon-url"
            value={iconUrl}
            onChange={e => setIconUrl(e.target.value)}
            placeholder="https://example.com/icon.webp"
          />
          <Input
            id="community-icon-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={event => handleLocalFile('icon', event.target.files?.[0])}
          />
          {iconPreview && (
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={iconPreview}
              alt="Community icon preview"
              className="w-20 h-20 rounded-full object-cover border border-border"
            />
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="community-banner-url" className="text-sm font-semibold">
            Banner URL (optional)
          </label>
          <Input
            id="community-banner-url"
            value={bannerUrl}
            onChange={e => setBannerUrl(e.target.value)}
            placeholder="https://example.com/banner.webp"
          />
          <Input
            id="community-banner-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={event => handleLocalFile('banner', event.target.files?.[0])}
          />
          {bannerPreview && (
            <motion.img
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              src={bannerPreview}
              alt="Community banner preview"
              className="w-full h-24 rounded-lg object-cover border border-border"
            />
          )}
        </div>

        {fileError && <p className="text-xs text-destructive">{fileError}</p>}

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
