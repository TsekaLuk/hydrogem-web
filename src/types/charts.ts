export interface ChartAxis {
  id: string;
  position: 'left' | 'right';
  domain: [number, number];
  formatter?: (value: number) => string;
  label?: string;
}

export interface ChartSeries {
  dataKey: string;
  name: string;
  color?: string;
  yAxisId: string;
}

export interface ChartConfig {
  xAxis: {
    dataKey: string;
    formatter?: (value: string) => string;
  };
  axes: ChartAxis[];
  series: ChartSeries[];
}

export interface ChartProps {
  data: any[];
  config: ChartConfig;
  className?: string;
}