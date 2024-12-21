import { useState, useEffect } from 'react';
import { DataSummary } from '@/types/summary';
import { useMonitoringData } from '@/hooks/useMonitoringData';

export function useSummaryData() {
  const { parameters } = useMonitoringData();
  const [summaries, setSummaries] = useState<DataSummary[]>(() => 
    parameters.map(param => ({
      id: param.id,
      name: param.key,
      value: param.value,
      unit: param.unit,
      trend: param.trend?.direction || 'stable',
      changePercentage: param.trend?.percentage || 0,
      status: param.status,
      category: param.category,
      lastUpdated: param.timestamp,
    }))
  );

  useEffect(() => {
    setSummaries(
      parameters.map(param => ({
        id: param.id,
        name: param.key,
        value: param.value,
        unit: param.unit,
        trend: param.trend?.direction || 'stable',
        changePercentage: param.trend?.percentage || 0,
        status: param.status,
        category: param.category,
        lastUpdated: param.timestamp,
      }))
    );
  }, [parameters]);

  return { summaries };
}