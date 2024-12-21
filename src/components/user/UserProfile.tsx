import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Settings, Clock, Activity } from 'lucide-react';
import { UserProfile as IUserProfile } from '@/types/user';
import { UserAvatar } from './UserAvatar';
import { UserBadge } from './UserBadge';
import { cn } from '@/lib/utils';

interface UserProfileProps {
  user: IUserProfile;
  onEditProfile?: () => void;
  onViewActivity?: () => void;
  className?: string;
}

export function UserProfile({ user, onEditProfile, onViewActivity, className }: UserProfileProps) {
  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <UserAvatar user={user} size="lg" showStatus />
          <div>
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <UserBadge role={user.role} />
              {user.department && (
                <span className="text-sm text-muted-foreground">
                  {user.department}
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onEditProfile}
          className="shrink-0"
        >
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <Separator className="my-6" />

      <div className="grid gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Last active:</span>
          <span>{user.lastActive.toLocaleString()}</span>
        </div>
        <Button
          variant="ghost"
          className="justify-start px-2"
          onClick={onViewActivity}
        >
          <Activity className="h-4 w-4 mr-2" />
          View Activity History
        </Button>
      </div>
    </Card>
  );
}