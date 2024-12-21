import { Alert } from '@/types/alerts';
import { AlertCard } from './AlertCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface AlertListProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onClear: (id: string) => void;
  onClearAll: () => void;
}

export function AlertList({ alerts, onAcknowledge, onClear, onClearAll }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No alerts to display
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Active Alerts</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={onClearAll}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={onAcknowledge}
              onClear={onClear}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}