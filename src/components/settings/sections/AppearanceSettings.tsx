import { useSettings } from '@/contexts/SettingsContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Monitor, Moon, Sun } from 'lucide-react';

export function AppearanceSettings() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Theme</h3>
        <p className="text-sm text-muted-foreground">
          Choose how the application looks to you
        </p>
        <RadioGroup
          defaultValue={settings.theme}
          onValueChange={(value) => 
            updateSettings({ theme: value as 'light' | 'dark' | 'system' })
          }
          className="grid grid-cols-3 gap-4 mt-4"
        >
          {[
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'system', label: 'System', icon: Monitor },
          ].map(({ value, label, icon: Icon }) => (
            <Label
              key={value}
              className="cursor-pointer"
              htmlFor={value}
            >
              <Card className={`p-4 flex flex-col items-center gap-2 ${
                settings.theme === value ? 'border-primary' : ''
              }`}>
                <RadioGroupItem value={value} id={value} className="sr-only" />
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{label}</span>
              </Card>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Reduce motion effects
              </p>
            </div>
            <Switch
              checked={settings.accessibility.reducedMotion}
              onCheckedChange={(checked) =>
                updateSettings({
                  accessibility: { ...settings.accessibility, reducedMotion: checked }
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>High Contrast</Label>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              checked={settings.accessibility.highContrast}
              onCheckedChange={(checked) =>
                updateSettings({
                  accessibility: { ...settings.accessibility, highContrast: checked }
                })
              }
            />
          </div>
        </div>
      </Card>
    </div>
  );
}