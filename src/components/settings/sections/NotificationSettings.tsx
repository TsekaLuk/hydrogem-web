import { useSettings } from '@/contexts/SettingsContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, Volume2, Desktop } from 'lucide-react';

export function NotificationSettings() {
  const { settings, updateSettings } = useSettings();

  const toggleNotification = (key: keyof typeof settings.notifications) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  const notificationOptions = [
    { key: 'push', label: 'Push Notifications', icon: Bell },
    { key: 'email', label: 'Email Notifications', icon: Mail },
    { key: 'sound', label: 'Sound Alerts', icon: Volume2 },
    { key: 'desktop', label: 'Desktop Notifications', icon: Desktop },
  ] as const;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {notificationOptions.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor={key}>{label}</Label>
            </div>
            <Switch
              id={key}
              checked={settings.notifications[key]}
              onCheckedChange={() => toggleNotification(key)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}