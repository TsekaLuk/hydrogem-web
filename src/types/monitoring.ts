import { LucideIcon } from 'lucide-react';

export type ParameterCategory = 
  | 'physical'
  | 'organic'
  | 'metals'
  | 'minerals'
  | 'ions'
  | 'toxins'
  | 'biological'
  | 'nutrients';

export interface Parameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  minValue: number;
  maxValue: number;
  warningThreshold: number;
  criticalThreshold: number;
  category: ParameterCategory;
}

export interface ParameterStatus {
  color: string;
  progressColor: string;
  progress: number;
  isWarning: boolean;
  isCritical: boolean;
}