import { AlertSeverity } from '@/types/alerts';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AlertBadgeProps {
  severity: AlertSeverity;
  className?: string;
}

export function AlertBadge({ severity, className }: AlertBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium',
        severity === 'critical' && 'border-red-500/50 text-red-500 dark:text-red-400',
        severity === 'warning' && 'border-amber-500/50 text-amber-500 dark:text-amber-400',
        severity === 'info' && 'border-blue-500/50 text-blue-500 dark:text-blue-400',
        className
      )}
    >
      {severity}
    </Badge>
  );
}