import { WaterQualityPanel } from './WaterQualityPanel';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { ParameterConfig } from './ParameterConfig';
import { useMonitoringData } from '@/hooks/useMonitoringData';
import { WaterQualityParameter } from '@/types/parameters';
import { useTranslation } from 'react-i18next';

export function MonitoringDashboard() {
  const { t } = useTranslation(['monitoring']);
  const { lastUpdated, parameters } = useMonitoringData();
  
  const handleParameterSelect = (parameter: WaterQualityParameter) => {
    // TODO: Implement parameter configuration logic
    console.log('Selected parameter:', parameter);
  };

  if (!parameters || parameters.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">{t('loading')}</h2>
          <p className="text-muted-foreground">{t('messages.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{t('title')}</h2>
        <ParameterConfig onParameterSelect={handleParameterSelect} />
      </div>
      <div className="flex flex-col gap-4">
        <Alert variant="destructive" className="bg-amber-500/10 border-amber-500/20">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle>{t('alerts.title')}</AlertTitle>
          <AlertDescription>
            {t('alerts.phWarning')}
          </AlertDescription>
        </Alert>
      </div>
      <WaterQualityPanel />
      <Card className="p-6">
        <h3 className="font-semibold mb-4">{t('system.status')}</h3>
        <div className="text-sm text-muted-foreground">
          {t('system.lastUpdated')}: {lastUpdated.toLocaleTimeString()}
        </div>
      </Card>
    </div>
  );
}