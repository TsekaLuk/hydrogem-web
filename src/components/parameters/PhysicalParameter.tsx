import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Gauge, Waves, Thermometer } from 'lucide-react';
import { Parameter } from '@/types/parameters';
import { cn } from '@/lib/utils';

interface PhysicalParameterProps {
  parameter: Parameter;
  className?: string;
}

export function PhysicalParameter({ parameter, className }: PhysicalParameterProps) {
  const { currentValue, thresholds } = parameter;
  const normalRange = thresholds.normal;
  
  const progress = ((currentValue - normalRange.min) / (normalRange.max - normalRange.min)) * 100;

  const getIcon = () => {
    switch (parameter.id) {
      case 'temperature':
        return Thermometer;
      case 'turbidity':
        return Waves;
      default:
        return Gauge;
    }
  };

  const Icon = getIcon();

  return (
    <Card className={cn(
      'p-4 relative overflow-hidden',
      'flex-1 w-full',
      'bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-slate-900',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            'bg-purple-500/10 dark:bg-purple-500/20'
          )}>
            <Icon className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-medium">{parameter.name}</h3>
            <p className="text-sm text-muted-foreground">
              Current Reading
            </p>
          </div>
        </div>
        <div className="text-2xl font-bold">
          {currentValue}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {parameter.unit}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Range</span>
          <span>
            {normalRange.min} - {normalRange.max} {parameter.unit}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {parameter.metadata?.interferingFactors && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Interfering Factors:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {parameter.metadata.interferingFactors.map((factor, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}