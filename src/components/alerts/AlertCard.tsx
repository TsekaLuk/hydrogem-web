import { Alert } from '@/types/alerts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertBadge } from './AlertBadge';
import { Bell, BellOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertCardProps {
  alert: Alert;
  onAcknowledge: (id: string) => void;
  onClear: (id: string) => void;
}

export function AlertCard({ alert, onAcknowledge, onClear }: AlertCardProps) {
  const formattedTime = new Date(alert.timestamp).toLocaleTimeString();

  return (
    <Card className={cn(
      'p-4 transition-all duration-300',
      'hover:shadow-lg',
      alert.severity === 'critical' && 'border-red-500/20 bg-red-500/5',
      alert.severity === 'warning' && 'border-amber-500/20 bg-amber-500/5',
      alert.severity === 'info' && 'border-blue-500/20 bg-blue-500/5',
      alert.acknowledged && 'opacity-75'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertBadge severity={alert.severity} />
            <span className="text-sm text-muted-foreground">{formattedTime}</span>
          </div>
          <h4 className="font-medium mb-1">{alert.title}</h4>
          <p className="text-sm text-muted-foreground">{alert.message}</p>
        </div>
        <div className="flex items-center gap-2">
          {!alert.acknowledged && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAcknowledge(alert.id)}
              className="h-8 w-8"
            >
              <BellOff className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onClear(alert.id)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}