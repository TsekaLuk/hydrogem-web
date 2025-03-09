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
    <div className="w-full space-y-4 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <ParameterConfig onParameterSelect={handleParameterSelect} />
      </div>
      
      <Alert variant="destructive" className="bg-amber-500/10 border-amber-500/20 my-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertTitle>{t('alerts.title')}</AlertTitle>
        <AlertDescription>
          {t('alerts.phWarning')}
        </AlertDescription>
      </Alert>
      
      <div className="mb-1">
        <h2 className="text-lg font-medium text-muted-foreground mb-2">水质参数</h2>
        <WaterQualityPanel />
      </div>
      
      <Card className="p-4 mt-2">
        <h3 className="font-medium mb-2">{t('system.status')}</h3>
        <div className="text-sm text-muted-foreground">
          {t('system.lastUpdated')}: {lastUpdated.toLocaleTimeString()}
        </div>
      </Card>
    </div>
  );
}