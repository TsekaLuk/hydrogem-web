export type ParameterCategory = 'physical' | 'organic' | 'metals' | 'toxins' | 'ions' | 'biological';

export type ParameterStatus = 'normal' | 'warning' | 'error' | 'offline';

export interface WaterQualityParameter {
  id: string;
  key: string;
  category: ParameterCategory;
  value: number;
  unit: string;
  status: ParameterStatus;
  timestamp: Date;
  range?: {
    min: number;
    max: number;
  };
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
}

export interface ParameterTranslation {
  name: string;
  description: string;
  unit: string;
  range: string;
}