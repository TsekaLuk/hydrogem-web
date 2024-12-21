import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const generateData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 12; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cpu: Math.floor(Math.random() * 30 + 40),
      memory: Math.floor(Math.random() * 20 + 60),
      network: Math.floor(Math.random() * 40 + 30),
    });
  }
  return data;
};

export function SystemChart() {
  const { t } = useTranslation('dashboard');
  const data = useMemo(() => generateData(), []);

  return (
    <Card className="flex flex-col p-[calc(0.75rem+0.5vw)] w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[calc(0.5rem+0.25vw)] mb-[calc(1rem+0.5vw)]">
        <h3 className="font-semibold text-[calc(1rem+0.25vw)]">{t('chart.title')}</h3>
        <div className="flex flex-wrap items-center gap-x-[calc(0.75rem+0.25vw)] gap-y-[calc(0.375rem+0.25vw)] text-[calc(0.875rem+0.1vw)] text-muted-foreground">
          <div className="flex items-center gap-[calc(0.375rem+0.1vw)]">
            <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))]" />
            <span>{t('chart.metrics.cpu')}</span>
          </div>
          <div className="flex items-center gap-[calc(0.375rem+0.1vw)]">
            <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]" />
            <span>{t('chart.metrics.memory')}</span>
          </div>
          <div className="flex items-center gap-[calc(0.375rem+0.1vw)]">
            <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-3))]" />
            <span>{t('chart.metrics.network')}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[250px] h-[calc(40vh+5vw)] max-h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--muted-foreground))" 
              opacity={0.1} 
            />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={Math.max(10, Math.min(12, window.innerWidth / 100))}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={Math.max(10, Math.min(12, window.innerWidth / 100))}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'calc(0.375rem + 0.1vw)',
                boxShadow: 'hsl(var(--shadow)) 0px 4px 12px',
                fontSize: 'calc(0.75rem + 0.1vw)',
                padding: 'calc(0.5rem + 0.25vw) calc(0.75rem + 0.25vw)'
              }}
              labelStyle={{
                color: 'hsl(var(--foreground))',
                fontWeight: 500,
                marginBottom: 'calc(0.25rem + 0.1vw)'
              }}
              itemStyle={{
                color: 'hsl(var(--muted-foreground))',
                fontSize: 'calc(0.75rem + 0.1vw)'
              }}
            />
            <Line
              type="monotone"
              dataKey="cpu"
              stroke="hsl(var(--chart-1))"
              strokeWidth={Math.max(1.5, Math.min(2.5, window.innerWidth / 1000))}
              dot={false}
              name={t('chart.metrics.cpu')}
              activeDot={{ r: Math.max(3, Math.min(5, window.innerWidth / 400)), strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="memory"
              stroke="hsl(var(--chart-2))"
              strokeWidth={Math.max(1.5, Math.min(2.5, window.innerWidth / 1000))}
              dot={false}
              name={t('chart.metrics.memory')}
              activeDot={{ r: Math.max(3, Math.min(5, window.innerWidth / 400)), strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="network"
              stroke="hsl(var(--chart-3))"
              strokeWidth={Math.max(1.5, Math.min(2.5, window.innerWidth / 1000))}
              dot={false}
              name={t('chart.metrics.network')}
              activeDot={{ r: Math.max(3, Math.min(5, window.innerWidth / 400)), strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}