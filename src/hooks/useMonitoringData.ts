import { useState, useEffect } from 'react';
import { WaterQualityParameter } from '@/types/parameters';

const INITIAL_PARAMETERS: WaterQualityParameter[] = [
  // 有机物参数
  {
    id: 'total-nitrogen',
    key: 'totalNitrogen',
    category: 'organic',
    value: 0.5,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0.2, max: 1.0 },
    trend: { direction: 'up', percentage: 0.5 }
  },
  {
    id: 'total-phosphorus',
    key: 'totalPhosphorus',
    category: 'organic',
    value: 0.1,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0.02, max: 0.2 },
    trend: { direction: 'up', percentage: 3.6 }
  },
  {
    id: 'ammonia-nitrogen',
    key: 'ammoniaNitrogen',
    category: 'organic',
    value: 0.91,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0.5, max: 2.0 },
    trend: { direction: 'up', percentage: 3.7 }
  },
  {
    id: 'nitrate',
    key: 'nitrate',
    category: 'organic',
    value: 5.0,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 10.0 },
    trend: { direction: 'up', percentage: 2.1 }
  },
  {
    id: 'nitrite',
    key: 'nitrite',
    category: 'organic',
    value: 0.5,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 1.0 },
    trend: { direction: 'up', percentage: 1.8 }
  },
  {
    id: 'phosphate',
    key: 'phosphate',
    category: 'organic',
    value: 0.15,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 0.3 },
    trend: { direction: 'up', percentage: 2.3 }
  },
  {
    id: 'dissolved-organic-carbon',
    key: 'dissolvedOrganicCarbon',
    category: 'organic',
    value: 2.38,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 5.0 },
    trend: { direction: 'up', percentage: 1.7 }
  },
  {
    id: 'total-carbon',
    key: 'totalCarbon',
    category: 'organic',
    value: 20,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 10, max: 30 },
    trend: { direction: 'up', percentage: 2.5 }
  },
  {
    id: 'inorganic-carbon',
    key: 'inorganicCarbon',
    category: 'organic',
    value: 15,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 5, max: 25 },
    trend: { direction: 'up', percentage: 1.9 }
  },
  {
    id: 'total-organic-carbon',
    key: 'totalOrganicCarbon',
    category: 'organic',
    value: 1.5,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 3.0 },
    trend: { direction: 'up', percentage: 2.2 }
  },
  {
    id: 'chemical-oxygen-demand',
    key: 'chemicalOxygenDemand',
    category: 'organic',
    value: 20.07,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 15, max: 40 },
    trend: { direction: 'up', percentage: 4.4 }
  },
  // 物理参数
  {
    id: 'ph',
    key: 'ph',
    category: 'physical',
    value: 7.06,
    unit: '',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 6.5, max: 8.5 },
    trend: { direction: 'up', percentage: 3.4 }
  },
  {
    id: 'turbidity',
    key: 'turbidity',
    category: 'physical',
    value: 0.48,
    unit: 'NTU',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 1.0 },
    trend: { direction: 'up', percentage: 0.4 }
  },
  {
    id: 'conductivity',
    key: 'conductivity',
    category: 'physical',
    value: 1250,
    unit: 'μS/cm',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 2500 },
    trend: { direction: 'up', percentage: 1.5 }
  },
  {
    id: 'resistivity',
    key: 'resistivity',
    category: 'physical',
    value: 2000,
    unit: 'Ω·m',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 1800, max: 3000 },
    trend: { direction: 'up', percentage: 1.2 }
  },
  {
    id: 'salinity',
    key: 'salinity',
    category: 'physical',
    value: 500,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 1000 },
    trend: { direction: 'up', percentage: 2.1 }
  },
  {
    id: 'total-dissolved-solids',
    key: 'totalDissolvedSolids',
    category: 'physical',
    value: 500,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 1000 },
    trend: { direction: 'up', percentage: 1.8 }
  },
  // 金属离子
  {
    id: 'zinc',
    key: 'zinc',
    category: 'metals',
    value: 0.5,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 1.0 },
    trend: { direction: 'up', percentage: 4.0 }
  },
  {
    id: 'copper',
    key: 'copper',
    category: 'metals',
    value: 0.5,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 1.0 },
    trend: { direction: 'up', percentage: 2.7 }
  },
  {
    id: 'cadmium',
    key: 'cadmium',
    category: 'metals',
    value: 0.002,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 0.005 },
    trend: { direction: 'up', percentage: 1.5 }
  },
  {
    id: 'manganese',
    key: 'manganese',
    category: 'metals',
    value: 0.05,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 0.1 },
    trend: { direction: 'up', percentage: 2.3 }
  },
  {
    id: 'aluminum',
    key: 'aluminum',
    category: 'metals',
    value: 0.1,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 0.2 },
    trend: { direction: 'up', percentage: 1.9 }
  },
  {
    id: 'iron',
    key: 'iron',
    category: 'metals',
    value: 0.15,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 0.3 },
    trend: { direction: 'up', percentage: 2.4 }
  },
  {
    id: 'chromium',
    key: 'chromium',
    category: 'metals',
    value: 0.025,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 0.05 },
    trend: { direction: 'up', percentage: 1.7 }
  },
  {
    id: 'ferrous-iron',
    key: 'ferrousIron',
    category: 'metals',
    value: 0.15,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 0.3 },
    trend: { direction: 'up', percentage: 2.1 }
  },
  {
    id: 'arsenic',
    key: 'arsenic',
    category: 'metals',
    value: 0.005,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 0.01 },
    trend: { direction: 'up', percentage: 1.8 }
  },
  // 离子成分
  {
    id: 'total-hardness',
    key: 'totalHardness',
    category: 'ions',
    value: 320.68,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 150, max: 450 },
    trend: { direction: 'up', percentage: 4.3 }
  },
  {
    id: 'chloride',
    key: 'chloride',
    category: 'ions',
    value: 130.25,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 250 },
    trend: { direction: 'up', percentage: 0.7 }
  },
  {
    id: 'sulfate',
    key: 'sulfate',
    category: 'ions',
    value: 125,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 250 },
    trend: { direction: 'up', percentage: 1.9 }
  },
  {
    id: 'residual-chlorine',
    key: 'residualChlorine',
    category: 'ions',
    value: 0.4,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0.3, max: 0.5 },
    trend: { direction: 'up', percentage: 2.2 }
  },
  {
    id: 'fluoride',
    key: 'fluoride',
    category: 'ions',
    value: 0.5,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 1.0 },
    trend: { direction: 'up', percentage: 1.5 }
  },
  {
    id: 'sulfide',
    key: 'sulfide',
    category: 'ions',
    value: 0.01,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 0.02 },
    trend: { direction: 'up', percentage: 2.3 }
  },
  {
    id: 'potassium',
    key: 'potassium',
    category: 'ions',
    value: 6,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 12 },
    trend: { direction: 'up', percentage: 1.7 }
  },
  // 有毒物质
  {
    id: 'phenols',
    key: 'phenols',
    category: 'toxins',
    value: 0.001,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 0.002 },
    trend: { direction: 'up', percentage: 4.9 }
  },
  {
    id: 'methanol',
    key: 'methanol',
    category: 'toxins',
    value: 5,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 10 },
    trend: { direction: 'up', percentage: 2.1 }
  },
  // 生物指标
  {
    id: 'chlorophyll',
    key: 'chlorophyll',
    category: 'biological',
    value: 15.3,
    unit: 'μg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 0, max: 30 },
    trend: { direction: 'up', percentage: 4.3 }
  },
  {
    id: 'dissolved-oxygen',
    key: 'dissolvedOxygen',
    category: 'biological',
    value: 7.5,
    unit: 'mg/L',
    status: 'normal',
    timestamp: new Date(),
    range: { min: 5, max: 10 },
    trend: { direction: 'up', percentage: 2.1 }
  }
];

export function useMonitoringData() {
  const [parameters, setParameters] = useState<WaterQualityParameter[]>(INITIAL_PARAMETERS);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setParameters(prev => prev.map(param => ({
        ...param,
        value: Number((param.value + (Math.random() - 0.5) * 0.2).toFixed(2)),
        timestamp: new Date(),
        trend: {
          direction: Math.random() > 0.5 ? 'up' : 'down',
          percentage: Number((Math.random() * 5).toFixed(1))
        }
      })));
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    parameters,
    lastUpdated,
  };
}