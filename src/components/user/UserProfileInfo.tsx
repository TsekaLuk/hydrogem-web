import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserProfileContext } from '@/contexts/UserProfileContext';
import { Clock, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserProfileInfoProps {
  onEditProfile: () => void;
  onViewActivity: () => void;
}

export function UserProfileInfo({ onEditProfile, onViewActivity }: UserProfileInfoProps) {
  const { profile } = useUserProfileContext();

  if (!profile) return null;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <p className="text-sm text-muted-foreground">
              Manage your account details and preferences
            </p>
          </div>
          <Button onClick={onEditProfile}>Edit Profile</Button>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Last active:</span>
            <span>{formatDistanceToNow(profile.lastActive, { addSuffix: true })}</span>
          </div>
          <Button
            variant="outline"
            className="justify-start"
            onClick={onViewActivity}
          >
            <Activity className="h-4 w-4 mr-2" />
            View Activity History
          </Button>
        </div>
      </div>
    </Card>
  );
}