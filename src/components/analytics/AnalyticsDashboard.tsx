import { Card } from '@/components/ui/card';
import { AnalyticsChart } from './AnalyticsChart';
import { cn } from '@/lib/utils';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';

export function AnalyticsDashboard() {
  const { data } = useAnalyticsData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Water Quality Analytics</h2>
        <p className="text-muted-foreground">
          30-day historical data analysis and trends
        </p>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-6">Parameter Trends</h3>
        <div className="h-[400px] w-full">
          <AnalyticsChart data={data} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Key Insights</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• pH levels have remained stable within optimal range</li>
            <li>• Temperature shows normal daily fluctuations</li>
            <li>• Dissolved oxygen levels indicate good aeration</li>
          </ul>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Recommendations</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Continue current maintenance schedule</li>
            <li>• Monitor temperature during peak hours</li>
            <li>• Consider optimizing aeration system</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}