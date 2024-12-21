import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart } from '@/components/charts/LineChart';
import { ChartConfig } from '@/types/charts';
import { WaterQualityParameter } from '@/types/parameters';

interface ParameterChartProps {
  parameter: WaterQualityParameter;
  data: Array<{
    timestamp: string;
    value: number;
  }>;
}

export function ParameterChart({ parameter, data }: ParameterChartProps) {
  const chartConfig = useMemo<ChartConfig>(() => ({
    xAxis: {
      dataKey: 'timestamp',
      formatter: (value) => new Date(value).toLocaleTimeString([], { 
        hour: '2-digit',
        minute: '2-digit'
      }),
    },
    axes: [
      {
        id: 'value',
        position: 'left',
        domain: [
          Math.min(parameter.criticalThresholds.low, Math.min(...data.map(d => d.value))) * 0.9,
          Math.max(parameter.criticalThresholds.high, Math.max(...data.map(d => d.value))) * 1.1
        ],
        label: parameter.unit,
      }
    ],
    series: [
      {
        dataKey: 'value',
        name: parameter.name,
        yAxisId: 'value',
        color: 'hsl(var(--primary))',
      }
    ],
  }), [parameter, data]);

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Historical Trend</h3>
      <div className="h-[300px]">
        <LineChart 
          data={data}
          config={chartConfig}
        />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-muted-foreground">
        <div>
          <div className="font-medium text-foreground">Normal Range</div>
          <div>{parameter.normalRange.min} - {parameter.normalRange.max} {parameter.unit}</div>
        </div>
        <div>
          <div className="font-medium text-foreground">Warning Range</div>
          <div>{parameter.warningThresholds.low} - {parameter.warningThresholds.high} {parameter.unit}</div>
        </div>
        <div>
          <div className="font-medium text-foreground">Critical Range</div>
          <div>{parameter.criticalThresholds.low} - {parameter.criticalThresholds.high} {parameter.unit}</div>
        </div>
      </div>
    </Card>
  );
}