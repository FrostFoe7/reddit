import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, useCreateCommunity } from '@/hooks';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const communitySchema = z.object({
  name: z
    .string()
    .min(3, 'Community name must be at least 3 characters')
    .max(32, 'Community name must be 32 characters or fewer')
    .regex(/^[A-Za-z0-9_]+$/, 'Only letters, numbers, and underscores are allowed'),
  description: z.string().max(500, 'Description must be 500 characters or fewer').optional(),
});

type CommunityFormValues = z.infer<typeof communitySchema>;

function validateImageFile(file: File): string | null {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images are allowed.';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Image must be 5MB or smaller.';
  }
  return null;
}

export const CommunityCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: createCommunity, isPending } = useCreateCommunity();

  const [iconFile, setIconFile] = React.useState<File | null>(null);
  const [bannerFile, setBannerFile] = React.useState<File | null>(null);
  const [iconPreview, setIconPreview] = React.useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = React.useState<string | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommunityFormValues>({
    resolver: zodResolver(communitySchema),
    defaultValues: { name: '', description: '' },
  });

  React.useEffect(() => {
    return () => {
      if (iconPreview) URL.revokeObjectURL(iconPreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [iconPreview, bannerPreview]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold">Please login to create a community</h2>
      </div>
    );
  }

  const handleFileSelected = (target: 'icon' | 'banner', file?: File) => {
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setFileError(validationError);
      return;
    }

    setFileError(null);
    const url = URL.createObjectURL(file);

    if (target === 'icon') {
      if (iconPreview) URL.revokeObjectURL(iconPreview);
      setIconFile(file);
      setIconPreview(url);
      return;
    }

    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerFile(file);
    setBannerPreview(url);
  };

  const onSubmit = (values: CommunityFormValues) => {
    if (fileError) return;

    createCommunity(
      {
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        iconFile,
        bannerFile,
      },
      {
        onSuccess: created => {
          navigate(`/r/${encodeURIComponent(created.name)}`);
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <h1 className="text-3xl font-bold mb-6">Create Community</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="community-name" className="text-sm font-semibold">
            Name
          </label>
          <Input
            id="community-name"
            {...register('name')}
            placeholder="e.g. webdev"
            required
            aria-describedby="community-name-help"
          />
          <p id="community-name-help" className="text-xs text-muted-foreground">
            Use 3-32 characters: letters, numbers, or underscore.
          </p>
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="community-description" className="text-sm font-semibold">
            Description
          </label>
          <Textarea
            id="community-description"
            {...register('description')}
            placeholder="Tell people what this community is about"
            rows={4}
          />
          {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="community-icon" className="text-sm font-semibold">
              Community Icon
            </label>
            <Input
              id="community-icon"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={event => handleFileSelected('icon', event.target.files?.[0])}
            />
            {iconPreview && (
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                src={iconPreview}
                alt="Community icon preview"
                className="w-16 h-16 rounded-full object-cover border border-border"
              />
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="community-banner" className="text-sm font-semibold">
              Community Banner
            </label>
            <Input
              id="community-banner"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={event => handleFileSelected('banner', event.target.files?.[0])}
            />
            {bannerPreview && (
              <motion.img
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                src={bannerPreview}
                alt="Community banner preview"
                className="w-full h-20 rounded-lg object-cover border border-border"
              />
            )}
          </div>
        </div>

        {fileError && <p className="text-xs text-destructive">{fileError}</p>}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-full">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="rounded-full">
            {isPending ? 'Creating...' : 'Create Community'}
          </Button>
        </div>
      </form>
    </div>
  );
};
