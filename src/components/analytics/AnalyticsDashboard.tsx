import { Card } from '@/components/ui/card';
import { AnalyticsChart } from './AnalyticsChart';
import { cn } from '@/lib/utils';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { useTranslation } from 'react-i18next';

export function AnalyticsDashboard() {
  const { data } = useAnalyticsData();
  const { t } = useTranslation('monitoring');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">{t('analytics.title')}</h2>
        <p className="text-muted-foreground">
          {t('analytics.description')}
        </p>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-6">{t('analytics.parameterTrends')}</h3>
        <div className="h-[400px] w-full">
          <AnalyticsChart data={data} />
        </div>
      </Card>
    </div>
  );
}

export default AnalyticsDashboard;