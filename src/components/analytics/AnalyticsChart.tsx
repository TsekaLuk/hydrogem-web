import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AnalyticsData } from '@/types/analytics';
import { cn } from '@/lib/utils';

interface AnalyticsChartProps {
  data: AnalyticsData[];
}

const axisStyle = {
  stroke: '#6B7280',
  fontSize: 12,
  tickLine: false,
} as const;

const tooltipStyle = {
  backgroundColor: 'hsl(var(--background))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
} as const;

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis
          stroke={axisStyle.stroke}
          fontSize={axisStyle.fontSize}
          tickLine={axisStyle.tickLine}
          dataKey="date"
          tickFormatter={formatDate}
        />
        <YAxis
          stroke={axisStyle.stroke}
          fontSize={axisStyle.fontSize}
          tickLine={axisStyle.tickLine}
          yAxisId="left"
          domain={[0, 14]}
          label={{ value: 'pH & DO (mg/L)', angle: -90, position: 'insideLeft' }}
        />
        <YAxis
          stroke={axisStyle.stroke}
          fontSize={axisStyle.fontSize}
          tickLine={axisStyle.tickLine}
          yAxisId="right"
          orientation="right"
          domain={[0, 40]}
          label={{ value: 'Temperature (°C)', angle: 90, position: 'insideRight' }}
        />
        <Tooltip
          contentStyle={tooltipStyle}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="ph"
          stroke={cn('hsl(var(--chart-1))')}
          strokeWidth={2}
          dot={false}
          yAxisId="left"
          name="pH Level"
        />
        <Line
          type="monotone"
          dataKey="oxygen"
          stroke={cn('hsl(var(--chart-2))')}
          strokeWidth={2}
          dot={false}
          yAxisId="left"
          name="Dissolved Oxygen"
        />
        <Line
          type="monotone"
          dataKey="temperature"
          stroke={cn('hsl(var(--chart-3))')}
          strokeWidth={2}
          dot={false}
          yAxisId="right"
          name="Temperature"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}