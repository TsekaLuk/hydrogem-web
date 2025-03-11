export type ParameterCategory = 
  | 'temperature'
  | 'chemical'
  | 'mineral'
  | 'biological'
  | 'physical'
  | 'metal'     // 重金属类
  | 'organic'   // 有机物类
  | 'other';

export type ParameterStatus = 
  | 'critical'  // 严重异常
  | 'warning'   // 警告状态
  | 'good'      // 正常状态
  | 'inactive'; // 未活动

export interface WaterQualityParameter {
  id: string;
  name: string;
  category: ParameterCategory;
  current: number;
  unit?: string;
  range?: [number, number]; // 允许的范围
  optimal?: [number, number]; // 最佳范围
  status: ParameterStatus;
  importance?: 'high' | 'medium' | 'low'; // 参数重要性
}

export interface ParameterTranslation {
  name: string;
  description: string;
  unit: string;
  range: string;
}