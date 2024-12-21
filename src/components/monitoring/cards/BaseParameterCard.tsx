import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle } from 'lucide-react';
import { WaterQualityParameter, ParameterTranslation } from '@/types/parameters';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface BaseParameterCardProps {
  parameter: WaterQualityParameter;
  translation: ParameterTranslation;
  className?: string;
  gradient?: string;
}

export function BaseParameterCard({ 
  parameter, 
  translation,
  className,
  gradient = 'from-sky-500/20 via-cyan-500/20 to-blue-500/20'
}: BaseParameterCardProps) {
  const { t } = useTranslation(['monitoring']);

  const getStatusColor = () => {
    switch (parameter.status) {
      case 'normal':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'offline':
        return 'bg-muted/50 text-muted-foreground border-muted';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getProgressColor = () => {
    // Special handling for pH
    if (parameter.key === 'ph') {
      const value = parameter.value;
      if (value < 6.5) return 'bg-red-500'; // 酸性
      if (value > 8.5) return 'bg-red-500'; // 碱性
      if (value >= 7.2 && value <= 7.8) return 'bg-green-500'; // 理想范围
      return 'bg-amber-500'; // 可接受但不理想
    }

    // For other parameters
    switch (parameter.status) {
      case 'normal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'error':
        return 'bg-red-500';
      case 'offline':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  const calculateProgress = () => {
    if (!parameter.range) return 0;
    const value = parameter.value;
    
    // Special handling for pH
    if (parameter.key === 'ph') {
      // pH的完整范围是0-14
      const phMin = 0;
      const phMax = 14;
      const phRange = phMax - phMin;
      return ((value - phMin) / phRange) * 100;
    }
    
    // Special handling for turbidity
    if (parameter.key === 'turbidity') {
      // Turbidity range is 0-1
      const turbidityMax = 1.0;
      return Math.min((value / turbidityMax) * 100, 100);
    }
    
    // For other parameters, use range from parameter
    const { min, max } = parameter.range;
    const percentage = ((value - min) / (max - min)) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  const getTrendIcon = () => {
    if (!parameter.trend) return null;
    switch (parameter.trend.direction) {
      case 'up':
        return <span className="text-destructive">↑</span>;
      case 'down':
        return <span className="text-primary">↓</span>;
      default:
        return <span>→</span>;
    }
  };

  const renderPHScale = () => {
    if (parameter.key !== 'ph') return null;
    
    return (
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{t('parameters.ph.acidic')}</span>
        <span>{t('parameters.ph.neutral')}</span>
        <span>{t('parameters.ph.alkaline')}</span>
      </div>
    );
  };

  return (
    <Card className={cn(
      'p-6 relative overflow-hidden group h-full transition-all duration-300',
      'hover:shadow-lg hover-lift',
      'animate-fade-in',
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br opacity-50" />
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-20 transition-opacity duration-300',
        'group-hover:opacity-30',
        gradient
      )} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold">{translation.name}</h3>
            <Tooltip>
              <TooltipTrigger>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {translation.description}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{translation.description}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          {parameter.status === 'warning' || parameter.status === 'error' ? (
            <AlertTriangle className={cn(
              'h-4 w-4',
              parameter.status === 'error' ? 'text-red-500' : 'text-amber-500'
            )} />
          ) : null}
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {parameter.value}
            </span>
            <span className="text-sm text-muted-foreground">
              {translation.unit}
            </span>
            {getTrendIcon()}
            {parameter.trend && (
              <span className="text-sm text-muted-foreground">
                {parameter.trend.percentage}%
              </span>
            )}
          </div>
          <div className="space-y-2 mt-4">
            <div className="w-full bg-black h-2 rounded-full">
              <Progress 
                value={calculateProgress()} 
                className={cn('h-2', getProgressColor())} 
              />
            </div>
            {renderPHScale()}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('parameters.range')}: {t(`parameters.${parameter.key}.range`)}</span>
            </div>
          </div>
          <div className={cn("mt-2 text-xs px-2 py-1 rounded-md inline-block", getStatusColor())}>
            {t(`status.${parameter.status}`)}
          </div>
        </div>
      </div>
    </Card>
  );
}