import { Parameter, ParameterStatus } from '@/types/monitoring';

export function calculateParameterStatus(param: Parameter): ParameterStatus {
  const { value, warningThreshold, criticalThreshold, minValue, maxValue } = param;
  const isWarning = value <= warningThreshold;
  const isCritical = value <= criticalThreshold;

  return {
    color: getStatusColor(value, warningThreshold, criticalThreshold),
    progressColor: getProgressColor(value, warningThreshold, criticalThreshold),
    progress: ((value - minValue) / (maxValue - minValue)) * 100,
    isWarning,
    isCritical,
  };
}

function getStatusColor(value: number, warningThreshold: number, criticalThreshold: number): string {
  if (value <= criticalThreshold) return 'text-red-500 dark:text-red-400';
  if (value <= warningThreshold) return 'text-amber-500 dark:text-amber-400';
  return 'text-emerald-500 dark:text-emerald-400';
}

function getProgressColor(value: number, warningThreshold: number, criticalThreshold: number): string {
  if (value <= criticalThreshold) return 'bg-red-500';
  if (value <= warningThreshold) return 'bg-amber-500';
  return 'bg-emerald-500';
}