import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WaterQualityParameter } from '@/types/parameters';
import { cn } from '@/lib/utils';

interface ParameterDetailsProps {
  parameter: WaterQualityParameter;
  currentValue: number;
}

export function ParameterDetails({ parameter, currentValue }: ParameterDetailsProps) {
  const { normalRange, warningThresholds, criticalThresholds } = parameter;
  const progress = ((currentValue - normalRange.min) / (normalRange.max - normalRange.min)) * 100;

  const getStatusColor = () => {
    if (
      currentValue <= criticalThresholds.low ||
      currentValue >= criticalThresholds.high
    ) {
      return 'text-red-500';
    }
    if (
      currentValue <= warningThresholds.low ||
      currentValue >= warningThresholds.high
    ) {
      return 'text-amber-500';
    }
    return 'text-emerald-500';
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold">{parameter.name}</h3>
          <p className="text-sm text-muted-foreground">{parameter.description}</p>
        </div>
        <div className={cn('text-2xl font-bold', getStatusColor())}>
          {currentValue} {parameter.unit}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{normalRange.min} {parameter.unit}</span>
            <span>{normalRange.max} {parameter.unit}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Warning Thresholds</p>
            <p className="text-muted-foreground">
              {warningThresholds.low} - {warningThresholds.high} {parameter.unit}
            </p>
          </div>
          <div>
            <p className="font-medium">Critical Thresholds</p>
            <p className="text-muted-foreground">
              {criticalThresholds.low} - {criticalThresholds.high} {parameter.unit}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}