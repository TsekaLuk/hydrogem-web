import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ContentHeader() {
  const { t } = useTranslation(['common', 'dashboard']);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('nav.dashboard')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('messages.welcome')}
        </p>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common:search.placeholder')}
            className="pl-8 w-full sm:w-[250px] bg-background"
          />
        </div>
      </div>
    </div>
  );
}