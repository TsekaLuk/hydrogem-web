import { ParameterCategory, ParameterStatus } from './parameters';

export type TrendDirection = 'up' | 'down' | 'stable';

export interface DataSummary {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: TrendDirection;
  changePercentage: number;
  status: ParameterStatus;
  category: ParameterCategory;
  lastUpdated: Date;
}

export interface SummaryCardConfig {
  showTrend?: boolean;
  showStatus?: boolean;
  showLastUpdated?: boolean;
  expandable?: boolean;
  className?: string;
}