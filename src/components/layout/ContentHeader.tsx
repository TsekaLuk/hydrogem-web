import { useTranslation } from 'react-i18next';
import { LayoutDashboard } from 'lucide-react';

export function ContentHeader() {
  const { t } = useTranslation(['common', 'dashboard']);

  return (
    <div className="flex justify-between items-center gap-4 mb-3 py-2 border-b border-border/10">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
          <LayoutDashboard className="h-4 w-4 text-primary/80" />
        </div>
        <h1 className="text-xl font-medium tracking-tight">{t('nav.dashboard')}</h1>
      </div>
    </div>
  );
}