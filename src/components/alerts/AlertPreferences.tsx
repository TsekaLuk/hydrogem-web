import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Bell, Volume2, Mail, Radio } from 'lucide-react';

interface AlertPreferencesProps {
  soundEnabled: boolean;
  onSoundToggle: (enabled: boolean) => void;
}

export function AlertPreferences({ soundEnabled, onSoundToggle }: AlertPreferencesProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-6">Alert Preferences</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="sound">Sound Alerts</Label>
          </div>
          <Switch
            id="sound"
            checked={soundEnabled}
            onCheckedChange={onSoundToggle}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="push">Push Notifications</Label>
          </div>
          <Switch id="push" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="email">Email Notifications</Label>
          </div>
          <Switch id="email" />
        </div>
      </div>
    </Card>
  );
}