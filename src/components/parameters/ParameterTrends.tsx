import { Card } from '@/components/ui/card';
import { WaterQualityParameter } from '@/types/parameters';
import { calculateTrend } from '@/lib/parameter-utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParameterTrendsProps {
  parameter: WaterQualityParameter;
  historicalValues: number[];
}

export function ParameterTrends({ parameter, historicalValues }: ParameterTrendsProps) {
  const trend = calculateTrend(parameter, historicalValues);
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'increasing':
        return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
      case 'decreasing':
        return <ArrowDownRight className="h-4 w-4 text-amber-500" />;
      default:
        return <Minus className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendDescription = () => {
    switch (trend) {
      case 'increasing':
        return 'Values showing upward trend';
      case 'decreasing':
        return 'Values showing downward trend';
      default:
        return 'Values remaining stable';
    }
  };

  return (
    <Card className="p-4">
      <h4 className="text-sm font-medium mb-2">Trend Analysis</h4>
      <div className="flex items-center gap-2">
        {getTrendIcon()}
        <span className="text-sm text-muted-foreground">
          {getTrendDescription()}
        </span>
      </div>
    </Card>
  );
}