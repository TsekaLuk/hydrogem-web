import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface ProfileSettingsProps {
  initialData?: {
    name: string;
    email: string;
    department: string;
  };
}

export function ProfileSettings({ initialData }: ProfileSettingsProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialData || {
    name: '',
    email: '',
    department: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    console.log('Update profile:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('settings.profile.name')}</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={t('settings.profile.name')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">{t('settings.profile.email')}</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder={t('settings.profile.email')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="department">{t('settings.profile.department')}</Label>
        <Input
          id="department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          placeholder={t('settings.profile.department')}
        />
      </div>

      <Button type="submit" className="w-full">
        {t('settings.profile.save')}
      </Button>
    </form>
  );
}