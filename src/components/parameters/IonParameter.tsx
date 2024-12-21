import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, Activity, Sparkles } from 'lucide-react';
import { Parameter } from '@/types/parameters';
import { cn } from '@/lib/utils';

interface IonParameterProps {
  parameter: Parameter;
  className?: string;
}

export function IonParameter({ parameter, className }: IonParameterProps) {
  const { currentValue, thresholds } = parameter;
  const normalRange = thresholds.normal;
  
  const progress = ((currentValue - normalRange.min) / (normalRange.max - normalRange.min)) * 100;
  const isWarning = currentValue > thresholds.warning.min;
  const isCritical = currentValue > thresholds.critical.min;

  return (
    <Card className={cn(
      'p-4 relative overflow-hidden',
      'flex-1 w-full',
      'bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950 dark:to-slate-900',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            'bg-cyan-500/10 dark:bg-cyan-500/20'
          )}>
            <Zap className="h-5 w-5 text-cyan-500" />
          </div>
          <div>
            <h3 className="font-medium">{parameter.name}</h3>
            <p className="text-sm text-muted-foreground">
              Ionic Concentration
            </p>
          </div>
        </div>
        <Sparkles className={cn(
          'h-5 w-5',
          isWarning ? 'text-amber-500' :
          'text-cyan-500'
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
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-500" />
            <span className="text-sm text-muted-foreground">
              Activity Level
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
              'bg-cyan-500'
            )} 
          />
          <div className="grid grid-cols-3 text-xs text-muted-foreground">
            <div>
              <div>Low</div>
              <div>{normalRange.min}</div>
            </div>
            <div className="text-center">
              <div>Optimal</div>
              <div>{(normalRange.min + normalRange.max) / 2}</div>
            </div>
            <div className="text-right">
              <div>High</div>
              <div>{normalRange.max}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}