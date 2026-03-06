import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/useStore';
import { useUpdateUser, useUploadImage, useUser } from '@/hooks';
import { toast } from 'sonner';

export const UserEditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const currentUser = useAuthStore(state => state.user);
  const { data: profile } = useUser(username);
  const { mutate: updateUser, isPending } = useUpdateUser();
  const { mutateAsync: uploadImage, isPending: isUploadingImage } = useUploadImage();

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
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    target: 'avatar' | 'banner',
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      const uploaded = await uploadImage(file);
      if (target === 'avatar') {
        setAvatarUrl(uploaded);
        toast.success('Avatar uploaded');
      } else {
        setBannerUrl(uploaded);
        toast.success('Banner uploaded');
      }
    } catch {
      // onError toast is already handled by hook.
    }
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
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={event => handleUpload(event, 'avatar')}
          />
          <label htmlFor="profile-avatar" className="text-sm font-semibold">
            Avatar URL
          </label>
          <div className="flex gap-2">
            <Input
              id="profile-avatar"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingImage}
            >
              Upload
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={event => handleUpload(event, 'banner')}
          />
          <label htmlFor="profile-banner" className="text-sm font-semibold">
            Banner URL
          </label>
          <div className="flex gap-2">
            <Input
              id="profile-banner"
              value={bannerUrl}
              onChange={e => setBannerUrl(e.target.value)}
              placeholder="https://example.com/banner.jpg"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => bannerInputRef.current?.click()}
              disabled={isUploadingImage}
            >
              Upload
            </Button>
          </div>
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