import { WaterQualityParameter, ParameterSource } from '@/types/parameters';

export function validateParameterValue(
  parameter: WaterQualityParameter,
  value: number
): { isValid: boolean; message?: string } {
  const { normalRange, criticalThresholds } = parameter;

  if (value < criticalThresholds.low) {
    return {
      isValid: false,
      message: `Value below critical minimum of ${criticalThresholds.low} ${parameter.unit}`,
    };
  }

  if (value > criticalThresholds.high) {
    return {
      isValid: false,
      message: `Value exceeds critical maximum of ${criticalThresholds.high} ${parameter.unit}`,
    };
  }

  if (value < normalRange.min || value > normalRange.max) {
    return {
      isValid: true,
      message: 'Value outside normal range but within critical limits',
    };
  }

  return { isValid: true };
}

export function getParameterStatus(
  parameter: WaterQualityParameter,
  value: number
): 'normal' | 'warning' | 'critical' {
  const { warningThresholds, criticalThresholds } = parameter;

  if (value <= criticalThresholds.low || value >= criticalThresholds.high) {
    return 'critical';
  }

  if (value <= warningThresholds.low || value >= warningThresholds.high) {
    return 'warning';
  }

  return 'normal';
}

export function checkSourceCompliance(
  parameter: WaterQualityParameter,
  value: number,
  source: ParameterSource
): boolean {
  return value <= source.limit;
}

export function calculateTrend(
  parameter: WaterQualityParameter,
  values: number[]
): 'increasing' | 'decreasing' | 'stable' {
  if (values.length < 2) return 'stable';

  const recentValues = values.slice(-5); // Look at last 5 values
  const average = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
  const latestValue = recentValues[recentValues.length - 1];
  const difference = Math.abs(latestValue - average);
  const threshold = (parameter.normalRange.max - parameter.normalRange.min) * 0.1;

  if (difference < threshold) return 'stable';
  return latestValue > average ? 'increasing' : 'decreasing';
}