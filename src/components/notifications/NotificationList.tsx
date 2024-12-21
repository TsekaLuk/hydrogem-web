import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification } from '@/types/notifications';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';

interface NotificationListProps {
  notifications: Notification[];
  className?: string;
}

export function NotificationList({ notifications, className }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
        <p>No notifications</p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn('h-[400px] pr-4', className)}>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
          />
        ))}
      </div>
    </ScrollArea>
  );
}