import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { DataSummary, SummaryCardConfig } from '@/types/summary';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SummaryCardProps {
  data: DataSummary;
  config?: SummaryCardConfig;
  onExpand?: (data: DataSummary) => void;
}

export function SummaryCard({ data, config, onExpand }: SummaryCardProps) {
  const { t } = useTranslation(['monitoring']);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-amber-500" />;
      default:
        return <Minus className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'error':
        return 'text-red-500 dark:text-red-400';
      case 'warning':
        return 'text-amber-500 dark:text-amber-400';
      case 'offline':
        return 'text-muted-foreground';
      default:
        return 'text-emerald-500 dark:text-emerald-400';
    }
  };

  const getProgressColor = () => {
    switch (data.status) {
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-amber-500';
      case 'offline':
        return 'bg-muted';
      default:
        return 'bg-emerald-500';
    }
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (onExpand) onExpand(data);
  };

  return (
    <Card className={cn(
      'p-6 transition-all duration-300',
      'hover:shadow-lg',
      config?.className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            {t(`parameters.${data.name}.name`)}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {data.value}
            </span>
            <span className="text-sm text-muted-foreground">
              {data.unit}
            </span>
          </div>
        </div>
        {config?.showTrend && (
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={cn(
              'text-sm font-medium',
              data.trend === 'up' ? 'text-emerald-500' : 
              data.trend === 'down' ? 'text-amber-500' : 
              'text-blue-500'
            )}>
              {Math.abs(data.changePercentage)}%
            </span>
          </div>
        )}
      </div>

      {config?.showStatus && (
        <div className="space-y-2">
          <Progress 
            value={70} 
            className={cn('h-2', getProgressColor())} 
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Status: </span>
            <span className={getStatusColor()}>
              {t(`status.${data.status}`)}
            </span>
          </div>
        </div>
      )}

      {config?.showLastUpdated && (
        <div className="mt-4 text-xs text-muted-foreground">
          {t('system.lastUpdated')}: {data.lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {config?.expandable && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExpand}
          className="w-full mt-4"
        >
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform",
            isExpanded && "rotate-180"
          )} />
        </Button>
      )}
    </Card>
  );
}