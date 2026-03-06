import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { User } from '@/types';

interface ProfileInfoProps {
  user: User;
  isSelf: boolean;
  onEdit: () => void;
}

export function ProfileInfo({ user, isSelf, onEdit }: ProfileInfoProps) {
  return (
    <div className="px-5 sm:px-10 pb-8 relative flex flex-col items-center sm:items-start text-center sm:text-left">
      <div className="relative -mt-[52px] sm:-mt-[60px] mb-4">
        <Avatar className="w-[104px] h-[104px] sm:w-[130px] sm:h-[130px] border-[5px] border-card shadow-lg">
          <AvatarImage src={user.avatar_url} />
          <AvatarFallback className="text-2xl font-bold">{user.username?.[0]}</AvatarFallback>
        </Avatar>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-none tracking-tight">{user.username}</h1>
      {isSelf ? (
        <Button onClick={onEdit} variant="outline" className="rounded-full mt-4">
          Edit profile
        </Button>
      ) : null}
    </div>
  );
}
