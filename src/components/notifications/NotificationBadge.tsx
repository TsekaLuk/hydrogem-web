import { cn } from '@/lib/utils';
import { NotificationType } from '@/types/notifications';

interface NotificationBadgeProps {
  type: NotificationType;
  className?: string;
}

export function NotificationBadge({ type, className }: NotificationBadgeProps) {
  return (
    <span className={cn(
      'px-2 py-0.5 text-xs font-medium rounded-full',
      type === 'success' && 'bg-emerald-500/10 text-emerald-500',
      type === 'error' && 'bg-red-500/10 text-red-500',
      type === 'warning' && 'bg-amber-500/10 text-amber-500',
      type === 'info' && 'bg-blue-500/10 text-blue-500',
      className
    )}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}