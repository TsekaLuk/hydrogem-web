import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { WaterQualityParameter } from '@/types/parameters';
import { useState } from 'react';
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react';

interface ParameterControlProps {
  onRefreshData: () => void;
  onParameterReference: (param: WaterQualityParameter) => void;
}

export function ParameterControl({ onRefreshData, onParameterReference }: ParameterControlProps) {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [expanded, setExpanded] = useState(false);

  const handleRefreshIntervalChange = (value: number[]) => {
    setRefreshInterval(value[0]);
  };

  return (
    <div className="bg-background/70 rounded-lg p-3 border border-border/30 mb-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">数据控制</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </Button>
      </div>
      
      {expanded && (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
              <Label htmlFor="auto-refresh" className="text-xs">自动刷新</Label>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 text-xs gap-1"
              onClick={onRefreshData}
            >
              <RefreshCw className="h-3 w-3" />
              刷新
            </Button>
          </div>

          <div className="space-y-2 mb-1">
            <div className="flex justify-between items-center">
              <Label htmlFor="refresh-interval" className="text-xs">刷新间隔</Label>
              <span className="text-xs font-medium">{refreshInterval}秒</span>
            </div>
            <Slider
              id="refresh-interval"
              min={5}
              max={60}
              step={5}
              value={[refreshInterval]}
              onValueChange={handleRefreshIntervalChange}
              disabled={!autoRefresh}
              className="my-1"
            />
          </div>
        </>
      )}
    </div>
  );
}

export function ChatParameterActions({ onInsertParameter }: { onInsertParameter: (param: WaterQualityParameter) => void }) {
  return (
    <div className="bg-background/70 rounded-lg p-3 border border-border/30 mt-3 shadow-sm">
      <h3 className="text-sm font-medium mb-2">数据操作</h3>
      <p className="text-xs text-muted-foreground mb-2">点击下方按钮在聊天中引用水质参数数据</p>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-8"
          onClick={() => onInsertParameter({ 
            id: 'ph', 
            key: 'ph', 
            category: 'physical', 
            value: 7.2, 
            unit: 'pH', 
            status: 'normal',
            timestamp: new Date() 
          })}
        >
          参考pH值
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-8"
          onClick={() => onInsertParameter({ 
            id: 'temperature', 
            key: 'temperature', 
            category: 'physical', 
            value: 25.4, 
            unit: '°C', 
            status: 'normal',
            timestamp: new Date() 
          })}
        >
          参考温度
        </Button>
      </div>
    </div>
  );
} 