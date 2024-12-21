import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserProfile, UserStatus } from '@/types/user';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface UserAvatarProps {
  user: UserProfile;
  showStatus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ user, showStatus = true, size = 'md', className }: UserAvatarProps) {
  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500';
      case 'away':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <div className="relative inline-block">
      <Avatar className={cn(sizeClasses[size], className)}>
        {user.avatar ? (
          <AvatarImage src={user.avatar} alt={user.name} />
        ) : (
          <AvatarFallback className="bg-primary/10">
            <User className="h-1/2 w-1/2 text-muted-foreground" />
          </AvatarFallback>
        )}
      </Avatar>
      {showStatus && (
        <span className={cn(
          'absolute bottom-0 right-0 rounded-full',
          'h-3 w-3 border-2 border-background',
          getStatusColor(user.status)
        )} />
      )}
    </div>
  );
}