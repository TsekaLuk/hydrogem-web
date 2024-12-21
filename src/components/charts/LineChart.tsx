import { useMemo } from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { ChartTooltip } from './ChartTooltip';
import { ChartProps } from '@/types/charts';

export function LineChart({ data, config, className }: ChartProps) {
  const { axes, series } = config;
  
  const yAxes = useMemo(() => {
    return axes.filter(axis => axis.position === 'left' || axis.position === 'right');
  }, [axes]);

  return (
    <div className={cn('w-full h-full min-h-[300px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          
          <XAxis 
            dataKey={config.xAxis.dataKey}
            tickFormatter={config.xAxis.formatter}
            stroke="currentColor"
            fontSize={12}
            tickLine={false}
            scale="auto"
          />
          
          {yAxes.map((axis) => (
            <YAxis
              key={axis.id}
              yAxisId={axis.id}
              orientation={axis.position}
              domain={axis.domain}
              tickFormatter={axis.formatter}
              stroke="currentColor"
              fontSize={12}
              tickLine={false}
              scale="auto"
              label={axis.label && {
                value: axis.label,
                angle: axis.position === 'left' ? -90 : 90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'currentColor' }
              }}
            />
          ))}
          
          <Tooltip content={<ChartTooltip />} />
          <Legend />
          
          {series.map((s) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              stroke={s.color || `hsl(var(--${s.dataKey}))`}
              strokeWidth={2}
              dot={false}
              yAxisId={s.yAxisId}
              name={s.name}
              connectNulls
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}