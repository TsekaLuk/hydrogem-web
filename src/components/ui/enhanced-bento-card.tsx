import React from "react";
import { motion } from "framer-motion";
import { AnimatedGradient } from "./animated-gradient";
import { cn } from "../../lib/utils";
import { TrendingUp, TrendingDown, Minus, AlertCircle, Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./tooltip";

export interface EnhancedBentoCardProps {
  title: React.ReactNode;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  colors: string[];
  delay?: number;
  className?: string;
  importance?: 'critical' | 'important' | 'standard';
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number | string;
  status?: 'good' | 'warning' | 'critical' | 'inactive';
  infoTooltip?: string;
  children?: React.ReactNode;
}

export const EnhancedBentoCard: React.FC<EnhancedBentoCardProps> = ({
  title,
  value,
  subtitle,
  colors,
  delay = 0,
  className,
  importance = 'standard',
  trend,
  trendValue,
  status,
  infoTooltip,
  children
}) => {
  // 获取重要性的样式
  const getImportanceStyle = () => {
    switch (importance) {
      case 'critical':
        return 'ring-2 ring-red-400 dark:ring-red-500';
      case 'important':
        return 'ring-2 ring-amber-400 dark:ring-amber-500';
      default:
        return '';
    }
  };
  
  // 渲染趋势指示器
  const renderTrend = () => {
    if (!trend) return null;
    
    const getTrendColor = () => {
      switch (trend) {
        case 'up':
          return 'text-emerald-500 dark:text-emerald-400';
        case 'down':
          return 'text-red-500 dark:text-red-400';
        case 'stable':
          return 'text-gray-500 dark:text-gray-400';
        default:
          return '';
      }
    };
    
    return (
      <div className={`flex items-center ${getTrendColor()}`}>
        {trend === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
        {trend === 'down' && <TrendingDown className="h-4 w-4 mr-1" />}
        {trend === 'stable' && <Minus className="h-4 w-4 mr-1" />}
        {trendValue && <span className="text-xs font-medium">{trendValue}</span>}
      </div>
    );
  };
  
  // 获取状态徽章
  const renderStatusBadge = () => {
    if (!status) return null;
    
    // 定义状态样式
    const statusStyles = {
      good: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300',
      warning: 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-300',
      critical: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300',
      inactive: 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900/30 dark:border-gray-800 dark:text-gray-300'
    };
    
    return (
      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
        {status === 'critical' && <AlertCircle className="h-3 w-3 mr-1" />}
        {status === 'good' ? '正常' : 
         status === 'warning' ? '警告' : 
         status === 'critical' ? '异常' : '离线'}
      </div>
    );
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden bg-background dark:bg-background/50 rounded-xl shadow-sm",
        getImportanceStyle(),
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <AnimatedGradient 
        colors={colors}
        className="opacity-20 dark:opacity-10"
      />
      
      <div className="relative z-10 p-4 h-full">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <h3 className="text-sm font-medium mr-1">{title}</h3>
            {infoTooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">{infoTooltip}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          
          {status && renderStatusBadge()}
        </div>
        
        <div className="mb-1 flex justify-between items-baseline">
          <div className="text-xl font-semibold">{value}</div>
          {trend && renderTrend()}
        </div>
        
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        
        {children}
      </div>
    </motion.div>
  );
}; 