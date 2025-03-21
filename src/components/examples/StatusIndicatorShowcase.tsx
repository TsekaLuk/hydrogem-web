import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import StatusIndicator from "../ui/status-indicator";
import { Separator } from "../ui/separator";

export function StatusIndicatorShowcase() {
  const statuses = ["critical", "warning", "good", "inactive"] as const;
  const variants = ["default", "filled", "outlined", "subtle"] as const;
  const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>状态指示器</CardTitle>
        <CardDescription>展示不同状态、变体和大小的状态指示器组件</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* 基本状态展示 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">基本状态</h3>
          <div className="flex flex-wrap gap-8">
            {statuses.map((status) => (
              <div key={status} className="flex flex-col items-center gap-2">
                <StatusIndicator 
                  status={status} 
                  size="md"
                  variant="default"
                />
                <span className="text-sm text-muted-foreground capitalize">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* 变体展示 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">不同变体</h3>
          {variants.map((variant) => (
            <div key={variant} className="space-y-2">
              <h4 className="text-sm font-medium capitalize text-muted-foreground">
                {variant}
              </h4>
              <div className="flex flex-wrap gap-8">
                {statuses.map((status) => (
                  <div key={`${variant}-${status}`} className="flex flex-col items-center gap-2">
                    <StatusIndicator 
                      status={status} 
                      variant={variant}
                      size="md"
                    />
                    <span className="text-xs text-muted-foreground capitalize">
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* 大小展示 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">不同尺寸</h3>
          <div className="space-y-8">
            {statuses.map((status) => (
              <div key={`sizes-${status}`} className="space-y-2">
                <h4 className="text-sm font-medium capitalize text-muted-foreground">
                  {status}
                </h4>
                <div className="flex items-center gap-8">
                  {sizes.map((size) => (
                    <div key={`${status}-${size}`} className="flex flex-col items-center gap-2">
                      <StatusIndicator 
                        status={status}
                        size={size}
                        variant="subtle"
                      />
                      <span className="text-xs text-muted-foreground">
                        {size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* 特殊效果展示 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">特殊效果</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
              <h4 className="text-sm font-medium mb-4">带文本</h4>
              <StatusIndicator 
                status="critical"
                variant="subtle"
                showText
                size="sm"
              />
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
              <h4 className="text-sm font-medium mb-4">带动画</h4>
              <StatusIndicator 
                status="warning"
                variant="outlined"
                animated
                size="md"
              />
            </div>
            <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
              <h4 className="text-sm font-medium mb-4">加载状态</h4>
              <StatusIndicator 
                status="good"
                variant="filled"
                loading
                size="md"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* 工具提示展示 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">工具提示</h3>
          <div className="flex justify-center gap-8">
            {statuses.map((status) => (
              <div key={`tooltip-${status}`} className="flex flex-col items-center gap-2">
                <StatusIndicator 
                  status={status}
                  variant="subtle"
                  size="md"
                  tooltip={`这是${status === 'critical' ? '严重异常' : 
                            status === 'warning' ? '警告' : 
                            status === 'good' ? '正常' : '非活动'}状态`}
                />
                <span className="text-xs text-muted-foreground capitalize">
                  悬停查看提示
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatusIndicatorShowcase; 