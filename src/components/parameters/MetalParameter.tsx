import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Atom, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Parameter } from '@/types/parameters';
import { cn } from '@/lib/utils';

interface MetalParameterProps {
  parameter: Parameter;
  className?: string;
}

export function MetalParameter({ parameter, className }: MetalParameterProps) {
  const { currentValue, thresholds } = parameter;
  const normalRange = thresholds.normal;
  
  const progress = ((currentValue - normalRange.min) / (normalRange.max - normalRange.min)) * 100;
  const isWarning = currentValue > thresholds.warning.min;
  const isCritical = currentValue > thresholds.critical.min;

  return (
    <Card className={cn(
      'p-4 relative overflow-hidden',
      'flex-1 w-full',
      'bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            'p-2 rounded-lg',
            'bg-blue-500/10 dark:bg-blue-500/20'
          )}>
            <Atom className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium">{parameter.name}</h3>
            <p className="text-sm text-muted-foreground">
              {parameter.unit}
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

      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">
            {currentValue}
          </span>
          <div className="flex items-center gap-1 text-sm">
            {currentValue > normalRange.max ? (
              <ArrowUpRight className="h-4 w-4 text-red-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-emerald-500" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Progress 
            value={progress} 
            className={cn(
              'h-2',
              isCritical ? 'bg-red-500' : 
              isWarning ? 'bg-amber-500' : 
              'bg-blue-500'
            )} 
          />
          <div className="grid grid-cols-3 text-xs">
            <div>
              <div className="text-muted-foreground">Min</div>
              <div>{normalRange.min}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Current</div>
              <div>{currentValue}</div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground">Max</div>
              <div>{normalRange.max}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}