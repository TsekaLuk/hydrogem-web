import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/user';
import { UserAvatar } from './UserAvatar';
import { UserBadge } from './UserBadge';
import { Settings, Activity, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfileCardProps {
  user: UserProfile;
  onEditProfile?: () => void;
  onViewActivity?: () => void;
  className?: string;
}

export function UserProfileCard({ user, onEditProfile, onViewActivity, className }: UserProfileCardProps) {
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
                  • {user.department}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEditProfile}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Recent Activity</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Last active: {user.lastActive.toLocaleString()}
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full"
            onClick={onViewActivity}
          >
            View Activity History
          </Button>
        </Card>

        <Card className="p-4 bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Notifications</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {user.preferences.notifications ? 'Enabled' : 'Disabled'}
            {user.preferences.notifications && ' • Push, Email'}
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full"
            onClick={onEditProfile}
          >
            Configure Notifications
          </Button>
        </Card>
      </div>
    </Card>
  );
}