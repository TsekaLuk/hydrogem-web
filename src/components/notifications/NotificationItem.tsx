import { Card } from '@/components/ui/card';
import { Notification } from '@/types/notifications';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  className?: string;
}

export function NotificationItem({ notification, className }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card 
      className={cn(
        'p-4 transition-all duration-300',
        'hover:shadow-md hover-lift',
        !notification.read && 'bg-muted/50',
        'animate-fade-in',
        className
      )}
    >
      <div className="flex gap-4">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium">{notification.title}</p>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
          <time className="text-xs text-muted-foreground">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </time>
        </div>
      </div>
    </Card>
  );
}