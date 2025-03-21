import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, MinusCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Tooltip, TooltipTrigger, TooltipContent } from "./tooltip";

const statusVariants = cva(
  "flex items-center justify-center rounded-full transition-all duration-200", 
  {
    variants: {
      variant: {
        default: "",
        filled: "",
        outlined: "border-2",
        subtle: "",
      },
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-10 w-10",
      },
      status: {
        critical: "",
        warning: "",
        good: "",
        inactive: "",
      },
    },
    compoundVariants: [
      // Filled variants
      {
        variant: "filled",
        status: "critical",
        className: "bg-red-500 text-white",
      },
      {
        variant: "filled",
        status: "warning",
        className: "bg-amber-500 text-white",
      },
      {
        variant: "filled",
        status: "good",
        className: "bg-emerald-500 text-white",
      },
      {
        variant: "filled",
        status: "inactive",
        className: "bg-gray-400 text-white",
      },
      // Outlined variants
      {
        variant: "outlined",
        status: "critical",
        className: "border-red-500 text-red-500",
      },
      {
        variant: "outlined",
        status: "warning",
        className: "border-amber-500 text-amber-500",
      },
      {
        variant: "outlined",
        status: "good",
        className: "border-emerald-500 text-emerald-500",
      },
      {
        variant: "outlined",
        status: "inactive",
        className: "border-gray-400 text-gray-400",
      },
      // Subtle variants
      {
        variant: "subtle",
        status: "critical",
        className: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      },
      {
        variant: "subtle",
        status: "warning",
        className: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      },
      {
        variant: "subtle",
        status: "good",
        className: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      },
      {
        variant: "subtle",
        status: "inactive",
        className: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
      },
      // Default variants
      {
        variant: "default",
        status: "critical",
        className: "text-red-500 dark:text-red-400",
      },
      {
        variant: "default",
        status: "warning",
        className: "text-amber-500 dark:text-amber-400",
      },
      {
        variant: "default",
        status: "good",
        className: "text-emerald-500 dark:text-emerald-400",
      },
      {
        variant: "default",
        status: "inactive",
        className: "text-gray-400 dark:text-gray-500",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      status: "good",
    },
  }
);

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>, 
    VariantProps<typeof statusVariants> {
  /** 指示器状态 */
  status?: "critical" | "warning" | "good" | "inactive";
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 是否添加脉冲动画效果 */
  animated?: boolean;
  /** 显示状态文本 */
  showText?: boolean;
  /** 自定义状态文本 */
  statusText?: Record<string, string>;
  /** 提示文本 */
  tooltip?: string;
  /** 是否显示状态图标 */
  showIcon?: boolean;
}

/**
 * 状态指示器组件
 * 用于显示各种状态：critical、warning、good、inactive
 * 支持多种视觉样式、大小和交互效果
 */
export const StatusIndicator = React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  ({
    status = "good",
    loading = false,
    animated = false,
    showText = false,
    statusText,
    tooltip,
    showIcon = true,
    variant,
    size,
    className,
    ...props
  }, ref) => {
    const defaultStatusText = {
      critical: "严重异常",
      warning: "警告",
      good: "正常",
      inactive: "未启用",
    };

    const finalStatusText = { ...defaultStatusText, ...statusText };
    
    const getStatusIcon = () => {
      if (loading) {
        return <Loader2 className="animate-spin" />;
      }
      
      switch (status) {
        case "critical":
          return <AlertCircle />;
        case "warning":
          return <AlertTriangle />;
        case "good":
          return <CheckCircle2 />;
        case "inactive":
          return <MinusCircle />;
        default:
          return <CheckCircle2 />;
      }
    };

    const indicator = (
      <span
        ref={ref}
        className={cn(
          statusVariants({ variant, size, status }),
          animated && !loading && "animate-pulse", 
          className
        )}
        {...props}
      >
        {showIcon && getStatusIcon()}
        {showText && (
          <span className="ml-1.5 text-xs font-medium">
            {finalStatusText[status]}
          </span>
        )}
      </span>
    );

    if (tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {indicator}
          </TooltipTrigger>
          <TooltipContent>
            {tooltip}
          </TooltipContent>
        </Tooltip>
      );
    }

    return indicator;
  }
);

StatusIndicator.displayName = "StatusIndicator";

export default StatusIndicator; 