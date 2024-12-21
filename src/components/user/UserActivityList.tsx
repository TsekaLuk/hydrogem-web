import { ScrollArea } from '@/components/ui/scroll-area';
import { UserActivity } from '@/types/user';
import { formatDistanceToNow } from 'date-fns';
import { Activity, LogIn, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserActivityListProps {
  activities: UserActivity[];
  className?: string;
}

export function UserActivityList({ activities, className }: UserActivityListProps) {
  const getActivityIcon = (type: UserActivity['type']) => {
    switch (type) {
      case 'login':
        return LogIn;
      case 'logout':
        return LogOut;
      case 'settings_change':
        return Settings;
      default:
        return Activity;
    }
  };

  return (
    <ScrollArea className={cn('h-[400px] pr-4', className)}>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="mt-1">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm">{activity.description}</p>
                <time className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </time>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}