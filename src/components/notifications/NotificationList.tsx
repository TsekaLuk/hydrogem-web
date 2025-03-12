import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification } from '@/types/notifications';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  loading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

export function NotificationList({ 
  notifications, 
  onMarkAsRead,
  loading = false,
  error = null,
  hasMore = false,
  onLoadMore,
  className 
}: NotificationListProps) {
  const { t } = useTranslation('notifications');

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <p className="text-sm text-destructive mb-2">{error}</p>
        <Button variant="outline" size="sm" onClick={() => onLoadMore?.()}>
          {t('error.tryAgain')}
        </Button>
      </div>
    );
  }

  if (loading && notifications.length === 0) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
        <p>{t('noNotifications')}</p>
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
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-4 flex justify-center pb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onLoadMore?.()} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('messages.loading', { ns: 'common' })}
              </>
            ) : (
              t('loadMore')
            )}
          </Button>
        </div>
      )}
    </ScrollArea>
  );
}
