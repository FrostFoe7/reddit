import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, useCreateCommunity } from '@/hooks';

const communitySchema = z.object({
  name: z
    .string()
    .min(3, 'Community name must be at least 3 characters')
    .max(32, 'Community name must be 32 characters or fewer')
    .regex(/^[A-Za-z0-9_]+$/, 'Only letters, numbers, and underscores are allowed'),
  description: z.string().max(500, 'Description must be 500 characters or fewer').optional(),
});

type CommunityFormValues = z.infer<typeof communitySchema>;

export const CommunityCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: createCommunity, isPending } = useCreateCommunity();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommunityFormValues>({
    resolver: zodResolver(communitySchema),
    defaultValues: { name: '', description: '' },
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold">Please login to create a community</h2>
      </div>
    );
  }

  const onSubmit = (values: CommunityFormValues) => {
    createCommunity(
      {
        name: values.name,
        description: values.description,
      },
      {
        onSuccess: created => {
          navigate(`/r/${created.name}`);
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
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-full">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-full"
          >
            {isPending ? 'Creating...' : 'Create Community'}
          </Button>
        </div>
      </form>
    </div>
  );
};