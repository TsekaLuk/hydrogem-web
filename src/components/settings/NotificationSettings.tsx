import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

export function NotificationSettings() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
          <span>{t('settings.notifications.email')}</span>
        </Label>
        <Switch id="email-notifications" />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
          <span>{t('settings.notifications.push')}</span>
        </Label>
        <Switch id="push-notifications" />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="update-notifications" className="flex flex-col space-y-1">
          <span>{t('settings.notifications.updates')}</span>
        </Label>
        <Switch id="update-notifications" />
      </div>
    </div>
  );
}