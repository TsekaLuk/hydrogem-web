import React from "react";
import { Button } from "./button";
import { Download } from "lucide-react";
import { ExcelExportService, ExcelExportOptions } from "@/services/export";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export interface ExportButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 要导出的数据 */
  data: Record<string, any>[];
  /** 导出选项 */
  options?: ExcelExportOptions;
  /** 显示的按钮文本，默认为 "导出数据" */
  exportText?: string;
  /** 导出前的回调函数 */
  onBeforeExport?: () => void;
  /** 导出后的回调函数 */
  onAfterExport?: () => void;
  /** 导出错误时的回调函数 */
  onError?: (error: Error) => void;
  /** 是否显示提示文本 */
  showTooltip?: boolean;
  /** 提示文本 */
  tooltipText?: string;
  /** 按钮尺寸 */
  size?: "default" | "sm" | "lg" | "icon";
  /** 按钮变体 */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

/**
 * 导出按钮组件
 * 提供了一个简单的方式来导出数据为Excel文件
 */
export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  options,
  exportText = "导出数据",
  onBeforeExport,
  onAfterExport,
  onError,
  showTooltip = true,
  tooltipText = "将数据导出为Excel文件",
  size = "default",
  variant = "outline",
  className,
  ...props
}) => {
  const handleExport = async () => {
    try {
      onBeforeExport?.();
      await ExcelExportService.exportToExcel(data, options);
      onAfterExport?.();
    } catch (error) {
      console.error("Export failed:", error);
      onError?.(error as Error);
    }
  };

  const button = (
    <Button
      onClick={handleExport}
      size={size}
      variant={variant}
      className={className}
      disabled={!data || data.length === 0}
      {...props}
    >
      <Download className="mr-2 h-4 w-4" />
      {exportText}
    </Button>
  );

  if (showTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    );
  }

  return button;
};

export default ExportButton; 