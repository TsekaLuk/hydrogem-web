import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Volume2, Bell, Mail } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export function NotificationPreferences() {
  const { settings, updateSettings } = useSettings();

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-6">Notification Preferences</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="sound">Sound Alerts</Label>
          </div>
          <Switch
            id="sound"
            checked={settings.notifications.sound}
            onCheckedChange={(checked) => 
              updateSettings({ 
                notifications: { ...settings.notifications, sound: checked } 
              })
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="push">Push Notifications</Label>
          </div>
          <Switch
            id="push"
            checked={settings.notifications.push}
            onCheckedChange={(checked) => 
              updateSettings({ 
                notifications: { ...settings.notifications, push: checked } 
              })
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="email">Email Notifications</Label>
          </div>
          <Switch
            id="email"
            checked={settings.notifications.email}
            onCheckedChange={(checked) => 
              updateSettings({ 
                notifications: { ...settings.notifications, email: checked } 
              })
            }
          />
        </div>
      </div>
    </Card>
  );
}