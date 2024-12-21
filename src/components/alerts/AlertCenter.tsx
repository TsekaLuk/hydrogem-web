import { useAlerts } from '@/hooks/useAlerts';
import { AlertList } from './AlertList';
import { AlertPreferences } from './AlertPreferences';

export function AlertCenter() {
  const {
    alerts,
    acknowledgeAlert,
    clearAlert,
    clearAllAlerts,
    soundEnabled,
    setSoundEnabled,
  } = useAlerts();

  return (
    <div className="space-y-6">
      <AlertList
        alerts={alerts}
        onAcknowledge={acknowledgeAlert}
        onClear={clearAlert}
        onClearAll={clearAllAlerts}
      />
      <AlertPreferences
        soundEnabled={soundEnabled}
        onSoundToggle={setSoundEnabled}
      />
    </div>
  );
}