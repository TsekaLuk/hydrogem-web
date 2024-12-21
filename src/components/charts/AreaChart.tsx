import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { ChartTooltip } from './ChartTooltip';
import { ChartProps } from '@/types/charts';

export function AreaChart({ data, config, className }: ChartProps) {
  const { axes, series } = config;

  return (
    <div className={cn('w-full h-full min-h-[300px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.dataKey} id={`gradient-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color || `hsl(var(--${s.dataKey}))`} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={s.color || `hsl(var(--${s.dataKey}))`} stopOpacity={0}/>
              </linearGradient>
            ))}
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          
          <XAxis
            dataKey={config.xAxis.dataKey}
            tickFormatter={config.xAxis.formatter}
            stroke="currentColor"
            fontSize={12}
            tickLine={false}
            scale="auto"
          />
          
          {axes.map((axis) => (
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
              label={axis.label}
            />
          ))}
          
          <Tooltip content={<ChartTooltip />} />
          <Legend />
          
          {series.map((s) => (
            <Area
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              stroke={s.color || `hsl(var(--${s.dataKey}))`}
              fill={`url(#gradient-${s.dataKey})`}
              strokeWidth={2}
              dot={false}
              yAxisId={s.yAxisId}
              name={s.name}
              connectNulls
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}