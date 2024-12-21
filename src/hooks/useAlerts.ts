import { useState, useEffect, useCallback } from 'react';
import { Alert, AlertSeverity } from '@/types/alerts';
import { useToast } from '@/hooks/use-toast';
import { useSound } from '@/hooks/useSound';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { toast } = useToast();
  const { playAlertSound } = useSound();

  const addAlert = useCallback((alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => {
    const newAlert: Alert = {
      ...alert,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      acknowledged: false,
    };

    setAlerts(prev => [newAlert, ...prev]);

    // Show toast notification
    toast({
      title: alert.title,
      description: alert.message,
      variant: alert.severity === 'critical' ? 'destructive' : 'default',
    });

    // Play sound if enabled and alert is critical
    if (soundEnabled && alert.severity === 'critical') {
      playAlertSound();
    }
  }, [soundEnabled, toast, playAlertSound]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
  }, []);

  const clearAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    addAlert,
    acknowledgeAlert,
    clearAlert,
    clearAllAlerts,
    soundEnabled,
    setSoundEnabled,
  };
}