export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
  parameterId: string;
  value: number;
  threshold: number;
  acknowledged: boolean;
  soundEnabled?: boolean;
}

export interface AlertThreshold {
  parameterId: string;
  warning: {
    min: number;
    max: number;
  };
  critical: {
    min: number;
    max: number;
  };
}

export interface AlertPreferences {
  soundEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  alertThresholds: AlertThreshold[];
}