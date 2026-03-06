import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MemberListProps {
  members: Array<{ id: string; username: string; avatar_url?: string }>;
}

export function MemberList({ members }: MemberListProps) {
  if (members.length === 0) {
    return <p className="text-sm text-muted-foreground">No moderators listed.</p>;
  }

  return (
    <div className="space-y-2">
      {members.map(member => (
        <div key={member.id} className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={member.avatar_url} />
            <AvatarFallback>{member.username[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">u/{member.username}</span>
        </div>
      ))}
    </div>
  );
}
