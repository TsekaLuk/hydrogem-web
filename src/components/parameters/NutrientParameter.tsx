import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Leaf, TrendingUp, AlertTriangle } from 'lucide-react';
import { Parameter } from '@/types/parameters';
import { cn } from '@/lib/utils';

interface NutrientParameterProps {
  parameter: Parameter;
  className?: string;
}

export function NutrientParameter({ parameter, className }: NutrientParameterProps) {
  const { currentValue, thresholds } = parameter;
  const normalRange = thresholds.normal;
  
  const progress = ((currentValue - normalRange.min) / (normalRange.max - normalRange.min)) * 100;
  const isWarning = currentValue > thresholds.warning.min;
  const isCritical = currentValue > thresholds.critical.min;

  return (
    <Card className={cn(
      'p-4 relative overflow-hidden',
      'flex-1 w-full',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-500" />
            <h3 className="font-medium">{parameter.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{parameter.description}</p>
        </div>
        {(isWarning || isCritical) && (
          <AlertTriangle className={cn(
            'h-5 w-5',
            isCritical ? 'text-red-500' : 'text-amber-500'
          )} />
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">
            {currentValue} {parameter.unit}
          </span>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-emerald-500">+2.5%</span>
          </div>
        </div>

        <Progress 
          value={progress} 
          className={cn(
            'h-2',
            isCritical ? 'bg-red-500' : 
            isWarning ? 'bg-amber-500' : 
            'bg-emerald-500'
          )} 
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{normalRange.min} {parameter.unit}</span>
          <span>{normalRange.max} {parameter.unit}</span>
        </div>
      </div>

      {parameter.metadata && (
        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          <div>Sensor: {parameter.metadata.sensorType}</div>
          {parameter.metadata.calibrationDate && (
            <div>Last Calibrated: {parameter.metadata.calibrationDate.toLocaleDateString()}</div>
          )}
        </div>
      )}
    </Card>
  );
}