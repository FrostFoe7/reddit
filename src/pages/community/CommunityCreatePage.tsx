import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/useStore';
import { useCreateCommunity } from '@/hooks';

export const CommunityCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const { mutate: createCommunity, isPending } = useCreateCommunity();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold">Please login to create a community</h2>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCommunity(
      {
        name,
        description,
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
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="community-name" className="text-sm font-semibold">
            Name
          </label>
          <Input
            id="community-name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. webdev"
            required
            aria-describedby="community-name-help"
          />
          <p id="community-name-help" className="text-xs text-muted-foreground">
            Use 3-21 characters: letters, numbers, or underscore.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="community-description" className="text-sm font-semibold">
            Description
          </label>
          <Textarea
            id="community-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Tell people what this community is about"
            rows={4}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="rounded-full">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || !name.trim()}
            className="rounded-full"
          >
            {isPending ? 'Creating...' : 'Create Community'}
          </Button>
        </div>
      </form>
    </div>
  );
};