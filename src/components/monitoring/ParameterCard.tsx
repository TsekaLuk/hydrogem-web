import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle } from 'lucide-react';
import { Parameter } from '@/types/monitoring';
import { calculateParameterStatus } from '@/lib/monitoring-utils';
import { cn } from '@/lib/utils';

interface ParameterCardProps {
  parameter: Parameter;
  className?: string;
}

export function ParameterCard({ parameter, className }: ParameterCardProps) {
  const Icon = parameter.icon;
  const status = calculateParameterStatus(parameter);

  return (
    <Card className={cn(
      'p-6 relative overflow-hidden group',
      'w-full flex flex-col',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-lg transition-all duration-300',
            'bg-gradient-to-br from-sky-500/20 via-cyan-500/20 to-blue-500/20'
          )}>
            <Icon className={cn('h-5 w-5', status.color)} />
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">
              {parameter.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {parameter.value}
              </span>
              <span className="text-sm text-muted-foreground">
                {parameter.unit}
              </span>
            </div>
          </div>
        </div>
        {status.isWarning && (
          <AlertTriangle className={cn(
            'h-5 w-5 animate-pulse',
            status.isCritical ? 'text-red-500' : 'text-amber-500'
          )} />
        )}
      </div>

      <div className="flex-1 space-y-2">
        <Progress value={status.progress} className={cn('h-2', status.progressColor)} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{parameter.minValue}{parameter.unit}</span>
          <span>{parameter.maxValue}{parameter.unit}</span>
        </div>
      </div>
    </Card>
  );
}