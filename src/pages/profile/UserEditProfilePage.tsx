import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/useStore';
import { useUpdateUser, useUser } from '@/hooks';

export const UserEditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const currentUser = useAuthStore(state => state.user);
  const { data: profile } = useUser(username);
  const { mutate: updateUser, isPending } = useUpdateUser();

  const targetUser = profile || currentUser;
  const canEdit = Boolean(currentUser && targetUser && currentUser.id === targetUser.id);

  const initial = useMemo(
    () => ({
      email: targetUser?.email || '',
      avatar_url: targetUser?.avatar_url || '',
      banner_url: targetUser?.banner_url || '',
      bio: targetUser?.bio || '',
    }),
    [targetUser],
  );

  const [email, setEmail] = useState(initial.email);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatar_url);
  const [bannerUrl, setBannerUrl] = useState(initial.banner_url);
  const [bio, setBio] = useState(initial.bio);

  React.useEffect(() => {
    setEmail(initial.email);
    setAvatarUrl(initial.avatar_url);
    setBannerUrl(initial.banner_url);
    setBio(initial.bio);
  }, [initial]);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold">Please login to edit your profile</h2>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold">You can only edit your own profile</h2>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(
      {
        email,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
        bio,
      },
      {
        onSuccess: updated => {
          navigate(`/profile/${updated.username}`);
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="profile-email" className="text-sm font-semibold">
            Email
          </label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="profile-avatar" className="text-sm font-semibold">
            Avatar URL
          </label>
          <Input
            id="profile-avatar"
            value={avatarUrl}
            onChange={e => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="profile-banner" className="text-sm font-semibold">
            Banner URL
          </label>
          <Input
            id="profile-banner"
            value={bannerUrl}
            onChange={e => setBannerUrl(e.target.value)}
            placeholder="https://example.com/banner.jpg"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="profile-bio" className="text-sm font-semibold">
            Bio
          </label>
          <Textarea
            id="profile-bio"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            placeholder="Tell the community a bit about yourself"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-full">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="rounded-full">
            {isPending ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
};