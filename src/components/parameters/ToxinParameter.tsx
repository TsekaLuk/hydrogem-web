import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skull, AlertTriangle, Shield } from 'lucide-react';
import { Parameter } from '@/types/parameters';
import { cn } from '@/lib/utils';

interface ToxinParameterProps {
  parameter: Parameter;
  className?: string;
}

export function ToxinParameter({ parameter, className }: ToxinParameterProps) {
  const { currentValue, thresholds } = parameter;
  const normalRange = thresholds.normal;
  
  const progress = ((currentValue - normalRange.min) / (normalRange.max - normalRange.min)) * 100;
  const isWarning = currentValue > thresholds.warning.min;
  const isCritical = currentValue > thresholds.critical.min;

  return (
    <Card className={cn(
      'p-4 relative overflow-hidden',
      'flex-1 w-full',
      'bg-gradient-to-br from-rose-50 to-white dark:from-rose-950 dark:to-slate-900',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            'bg-rose-500/10 dark:bg-rose-500/20'
          )}>
            <Skull className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-medium">{parameter.name}</h3>
            <p className="text-sm text-muted-foreground">
              Toxicity Level
            </p>
          </div>
        </div>
        <Shield className={cn(
          'h-5 w-5',
          isCritical ? 'text-red-500 animate-pulse' : 
          isWarning ? 'text-amber-500' : 
          'text-emerald-500'
        )} />
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {currentValue}
            <span className="text-sm ml-1 text-muted-foreground">
              {parameter.unit}
            </span>
          </span>
          {(isWarning || isCritical) && (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className={cn(
                'h-4 w-4',
                isCritical ? 'text-red-500' : 'text-amber-500'
              )} />
              <span className={cn(
                isCritical ? 'text-red-500' : 'text-amber-500'
              )}>
                {isCritical ? 'Critical Level' : 'Warning Level'}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Progress 
            value={progress} 
            className={cn(
              'h-2',
              isCritical ? 'bg-red-500' : 
              isWarning ? 'bg-amber-500' : 
              'bg-emerald-500'
            )} 
          />
          <div className="flex justify-between text-xs">
            <span className="text-emerald-500">Safe</span>
            <span className="text-amber-500">Warning</span>
            <span className="text-red-500">Critical</span>
          </div>
        </div>
      </div>
    </Card>
  );
}