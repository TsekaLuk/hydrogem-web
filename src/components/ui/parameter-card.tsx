import React from 'react';
import { WaterQualityParameter } from '../../types/parameters';
import { ParameterTrend } from '../../hooks/useParameterTrends';
import { Sparkline } from './sparkline';
import { cn } from '../../lib/utils';
import { Badge } from './badge';
import { BentoCard } from './bento-card';
import { ArrowDown, ArrowUp, Minus, AlertCircle, Droplet, Thermometer } from 'lucide-react';
import { getParameterIconUrl } from '../../lib/parameter-icons';

interface ParameterCardProps {
  parameter: WaterQualityParameter;
  trend?: ParameterTrend;
  className?: string;
  onClick?: (param: WaterQualityParameter) => void;
}

export const ParameterCard: React.FC<ParameterCardProps> = ({
  parameter,
  trend,
  className,
  onClick,
}) => {
  const { id, name, unit, current, status, category, optimal, range } = parameter;
  
  // 确定参数的颜色主题
  const getThemeColor = () => {
    switch (status) {
      case 'critical':
        return 'text-red-500 dark:text-red-400';
      case 'warning':
        return 'text-amber-500 dark:text-amber-400';
      case 'good':
        return 'text-emerald-500 dark:text-emerald-400';
      default:
        return 'text-blue-500 dark:text-blue-400';
    }
  };

  // 获取背景渐变色
  const getBackgroundGradient = () => {
    switch (status) {
      case 'critical':
        return 'from-red-400/20 to-red-50/5 dark:from-red-900/20 dark:to-red-900/5';
      case 'warning':
        return 'from-amber-400/20 to-amber-50/5 dark:from-amber-900/20 dark:to-amber-900/5';
      case 'good':
        return 'from-emerald-400/20 to-emerald-50/5 dark:from-emerald-900/20 dark:to-emerald-900/5';
      default:
        return 'from-blue-400/20 to-blue-50/5 dark:from-blue-900/20 dark:to-blue-900/5';
    }
  };

  // 渲染背景图标
  const renderBackgroundIcon = () => {
    // 获取自定义图标的URL
    const iconUrl = getParameterIconUrl(id);
    
    if (iconUrl) {
      return (
        <div className="absolute right-0 bottom-0 opacity-[0.25] dark:opacity-[0.4] w-full h-full flex justify-end items-end overflow-hidden pointer-events-none">
          <div className="w-[150px] h-[150px] transform translate-x-[20px] translate-y-[20px]">
            <img 
              key={`icon-${id}`}
              src={iconUrl}
              alt=""
              className="w-full h-full object-contain filter contrast-[1.3] saturate-[1.3]"
              onError={(e) => {
                console.error(`Failed to load icon for ${id}: ${iconUrl}`);
                // 隐藏加载失败的图片
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  // 获取趋势图标和颜色
  const getTrendIcon = () => {
    if (!trend) return null;

    switch (trend.trend) {
      case 'up':
        return (
          <span className="flex items-center text-xs font-medium text-emerald-500 dark:text-emerald-400">
            <ArrowUp className="h-3 w-3 mr-0.5" />
            {trend.changePct > 0 ? `+${trend.changePct}%` : `${trend.changePct}%`}
          </span>
        );
      case 'down':
        return (
          <span className="flex items-center text-xs font-medium text-red-500 dark:text-red-400">
            <ArrowDown className="h-3 w-3 mr-0.5" />
            {trend.changePct}%
          </span>
        );
      case 'stable':
        return (
          <span className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
            <Minus className="h-3 w-3 mr-0.5" />
            稳定
          </span>
        );
      default:
        return null;
    }
  };

  // 判断参数是否在最佳范围内
  const isOptimal = optimal && current >= optimal[0] && current <= optimal[1];

  // 获取小图标（用于标题旁边）
  const getSmallIcon = () => {
    switch (category) {
      case 'temperature':
        return <Thermometer className="h-4 w-4 mr-1" />;
      case 'chemical':
      case 'mineral':
        return <Droplet className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <BentoCard 
      className={cn(
        "group relative text-center flex flex-col p-4 h-full bg-background backdrop-blur-lg border-background/50",
        "hover:bg-background/90 transition-colors duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:border-primary/50",
        className
      )}
      gradientClassName={`bg-gradient-to-br ${getBackgroundGradient()}`}
      onClick={onClick ? () => onClick(parameter) : undefined}
    >
      {/* 渲染背景图标 */}
      {renderBackgroundIcon()}
      
      <div className="flex flex-col h-full p-3 sm:p-4 relative z-10">
        <div className="space-y-2 flex-grow">
          <div className="flex items-center flex-wrap">
            {getSmallIcon()}
            <h3 className="text-sm font-medium mr-1">{name}</h3>
            {status === 'critical' && (
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
            )}
          </div>
          
          <div className="flex items-baseline flex-wrap gap-1">
            <span className={cn("text-xl font-bold", getThemeColor())}>
              {typeof current === 'number' ? current.toFixed(1) : current}
            </span>
            {unit && <span className="text-xs text-gray-500 dark:text-gray-400">{unit}</span>}
          </div>
          
          <div className="flex items-center flex-wrap gap-1">
            {getTrendIcon()}
            
            {isOptimal && (
              <Badge variant="outline" className="text-xs py-0 px-1.5 border-green-200 text-green-700 dark:border-green-700 dark:text-green-400">
                最佳
              </Badge>
            )}
          </div>

          {range && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              范围: {range[0]}-{range[1]} {unit}
            </div>
          )}
        </div>

        {/* 趋势图 */}
        {trend && trend.values.length > 1 && (
          <div className="mt-2 relative z-10">
            <Sparkline 
              data={trend.values} 
              color={
                status === 'critical' ? '#ef4444' : 
                status === 'warning' ? '#f59e0b' : 
                status === 'good' ? '#10b981' : 
                '#3b82f6'
              }
              showArea={true}
              height={24}
            />
          </div>
        )}
      </div>
    </BentoCard>
  );
}; 