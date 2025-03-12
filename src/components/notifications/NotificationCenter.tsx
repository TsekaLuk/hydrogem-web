import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { NotificationList } from './NotificationList';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

// 精简版通知中心，移除所有可能导致无限渲染的useEffect
export function NotificationCenter() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    loading, 
    error,
    hasMore,
    loadMore,
    refreshNotifications
  } = useNotifications();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('notifications');

  // 优化后的打开通知面板处理
  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    
    // 只在打开面板时刷新通知
    if (newOpen && !loading) {
      refreshNotifications();
    }
  }, [loading, refreshNotifications]);

  // 处理刷新按钮点击
  const handleRefresh = useCallback(() => {
    if (!loading) {
      refreshNotifications();
    }
  }, [loading, refreshNotifications]);

  // 标记所有通知为已读
  const handleMarkAllAsRead = useCallback(() => {
    if (!loading && unreadCount > 0) {
      markAllAsRead();
    }
  }, [loading, markAllAsRead, unreadCount]);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative hover:bg-accent/50"
          aria-label={t('title')}
        >
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={cn(
                  'absolute -top-1 -right-1 h-4 w-4',
                  'bg-primary text-primary-foreground',
                  'rounded-full text-xs flex items-center justify-center',
                  'font-medium'
                )}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="border-b pb-3">
          <SheetTitle>{t('title')}</SheetTitle>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs text-muted-foreground"
              disabled={loading}
            >
              {t('markAllAsRead')}
            </Button>
          )}
        </SheetHeader>
        <div className="my-4">
          <NotificationList 
            notifications={notifications}
            onMarkAsRead={markAsRead}
            loading={loading}
            error={error}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        </div>
        <SheetFooter className="mt-auto border-t pt-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            className="w-full justify-center text-xs text-muted-foreground"
            disabled={loading}
          >
            {t('actions.refresh', { ns: 'common' })}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
