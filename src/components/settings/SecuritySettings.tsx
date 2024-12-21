import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';

export function SecuritySettings() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">{t('settings.security.currentPassword')}</Label>
          <Input
            id="current-password"
            type="password"
            placeholder={t('settings.security.currentPassword')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password">{t('settings.security.newPassword')}</Label>
          <Input
            id="new-password"
            type="password"
            placeholder={t('settings.security.newPassword')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">{t('settings.security.confirmPassword')}</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder={t('settings.security.confirmPassword')}
          />
        </div>

        <Button type="submit" className="w-full">
          {t('settings.security.changePassword')}
        </Button>
      </form>

      <div className="flex items-center justify-between pt-4">
        <Label htmlFor="two-factor" className="flex flex-col space-y-1">
          <span>{t('settings.security.twoFactor')}</span>
        </Label>
        <Switch id="two-factor" />
      </div>
    </div>
  );
}