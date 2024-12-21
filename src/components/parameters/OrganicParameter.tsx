import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FlaskConical, Droplets, AlertTriangle } from 'lucide-react';
import { Parameter } from '@/types/parameters';
import { cn } from '@/lib/utils';

interface OrganicParameterProps {
  parameter: Parameter;
  className?: string;
}

export function OrganicParameter({ parameter, className }: OrganicParameterProps) {
  const { currentValue, thresholds } = parameter;
  const normalRange = thresholds.normal;
  
  const progress = ((currentValue - normalRange.min) / (normalRange.max - normalRange.min)) * 100;
  const isWarning = currentValue > thresholds.warning.min;
  const isCritical = currentValue > thresholds.critical.min;

  return (
    <Card className={cn(
      'p-4 relative overflow-hidden',
      'flex-1 w-full',
      'bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950 dark:to-slate-900',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            'bg-indigo-500/10 dark:bg-indigo-500/20'
          )}>
            <FlaskConical className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="font-medium">{parameter.name}</h3>
            <p className="text-sm text-muted-foreground">
              Organic Compound
            </p>
          </div>
        </div>
        {(isWarning || isCritical) && (
          <AlertTriangle className={cn(
            'h-5 w-5 animate-pulse',
            isCritical ? 'text-red-500' : 'text-amber-500'
          )} />
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {currentValue}
            <span className="text-sm ml-1 text-muted-foreground">
              {parameter.unit}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <Droplets className={cn(
              'h-4 w-4',
              isCritical ? 'text-red-500' :
              isWarning ? 'text-amber-500' :
              'text-indigo-500'
            )} />
            <span className="text-sm text-muted-foreground">
              Concentration
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Progress 
            value={progress} 
            className={cn(
              'h-2',
              isCritical ? 'bg-red-500' : 
              isWarning ? 'bg-amber-500' : 
              'bg-indigo-500'
            )} 
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{normalRange.min}</span>
            <span>Acceptable Range</span>
            <span>{normalRange.max}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}