import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, Bell } from 'lucide-react';
import { Notification } from '@/types/notifications';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  className?: string;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  className,
}: NotificationItemProps) {
  const { t, i18n } = useTranslation('notifications');
  
  // 根据当前语言选择日期格式化的区域设置
  const dateLocale = i18n.language === 'zh' ? zhCN : enUS;
  
  // 格式化时间为"几分钟前"、"几小时前"等
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('timeAgo.justNow');
    if (diffInMinutes < 60) return t('timeAgo.minutesAgo', { count: diffInMinutes });
    
    return formatDistanceToNow(date, { addSuffix: false, locale: dateLocale });
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    
    // 如果有动作URL，则导航到该URL
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div
      className={cn(
        'flex items-start gap-4 rounded-md p-3 transition-colors',
        notification.read
          ? 'bg-background hover:bg-muted/30'
          : 'bg-muted/30 hover:bg-muted/50',
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="mt-1 flex-shrink-0">{getIcon()}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">{notification.title}</h4>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(notification.timestamp)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        {notification.actionUrl && (
          <div className="pt-1">
            <span className="text-xs text-primary hover:underline">
              {t('actions.view')}
            </span>
          </div>
        )}
      </div>
      {!notification.read && (
        <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
      )}
    </div>
  );
}