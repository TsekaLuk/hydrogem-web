import { useState, useEffect } from 'react';
import { AnalyticsData } from '@/types/analytics';

export function useAnalyticsData() {
  const [data, setData] = useState<AnalyticsData[]>(() => generateInitialData());

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        const lastEntry = newData[newData.length - 1];
        const date = new Date();
        
        newData.shift();
        newData.push({
          date: date.toISOString(),
          ph: Number((lastEntry.ph + (Math.random() - 0.5) * 0.1).toFixed(2)),
          temperature: Number((lastEntry.temperature + (Math.random() - 0.5) * 0.2).toFixed(1)),
          oxygen: Number((lastEntry.oxygen + (Math.random() - 0.5) * 0.1).toFixed(2)),
        });
        
        return newData;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return { data };
}

function generateInitialData(): AnalyticsData[] {
  const data: AnalyticsData[] = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 3600000);
    data.push({
      date: date.toISOString(),
      ph: Number((7 + Math.sin(i * 0.2) + Math.random() * 0.5).toFixed(2)),
      temperature: Number((25 + Math.cos(i * 0.2) * 3 + Math.random()).toFixed(1)),
      oxygen: Number((8 + Math.sin(i * 0.3) * 2 + Math.random() * 0.5).toFixed(2)),
    });
  }
  
  return data;
}