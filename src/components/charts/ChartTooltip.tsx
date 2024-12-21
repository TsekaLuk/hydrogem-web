import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload) return null;

  return (
    <Card className={cn(
      'bg-background/95 backdrop-blur-sm border shadow-lg',
      'p-3 !border-border/50'
    )}>
      <div className="text-xs font-medium mb-1">{label}</div>
      <div className="space-y-1">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">
              {item.name}:
            </span>
            <span className="text-xs font-medium">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}