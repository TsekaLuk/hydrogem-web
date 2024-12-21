import { ArrowUpRight, ArrowDownRight, Activity, Users, Server, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Metric {
  key: 'activeUsers' | 'serverLoad' | 'responseTime' | 'systemHealth';
  value: string;
  change: number;
  icon: typeof Activity;
}

const metrics: Metric[] = [
  {
    key: 'activeUsers',
    value: '1,234',
    change: 12.5,
    icon: Users,
  },
  {
    key: 'serverLoad',
    value: '42%',
    change: -5.2,
    icon: Server,
  },
  {
    key: 'responseTime',
    value: '124ms',
    change: -8.1,
    icon: Clock,
  },
  {
    key: 'systemHealth',
    value: '98.2%',
    change: 2.1,
    icon: Activity,
  },
];

export function DashboardMetrics() {
  const { t } = useTranslation('dashboard');

  return (
    <div className="grid auto-rows-fr gap-[calc(0.5rem+0.5vw)] sm:gap-[calc(0.75rem+0.5vw)] md:gap-[calc(1rem+0.5vw)]
      grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))]
      w-full">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const isPositive = metric.change > 0;
        
        return (
          <Card 
            key={metric.key} 
            className="flex flex-col justify-between p-[calc(0.75rem+0.5vw)] relative overflow-hidden group hover:bg-secondary/50 dark:hover:bg-secondary/50 transition-colors duration-300"
          >
            <div className="flex items-start gap-[calc(0.5rem+0.25vw)]">
              <div className="p-[calc(0.375rem+0.25vw)] rounded-xl bg-secondary dark:bg-secondary">
                <Icon className="w-[calc(1rem+0.5vw)] h-[calc(1rem+0.5vw)] text-secondary-foreground dark:text-secondary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[calc(0.75rem+0.1vw)] font-medium text-muted-foreground truncate">
                  {t(`metrics.${metric.key}.label`)}
                </p>
                <h3 className="text-[calc(1.125rem+0.25vw)] font-bold mt-0.5">
                  {metric.value}
                </h3>
              </div>
            </div>
            <div className={cn(
              'flex items-center gap-[calc(0.25rem+0.1vw)] mt-[calc(0.75rem+0.25vw)]',
              'text-[calc(0.75rem+0.1vw)]',
              isPositive ? 'text-emerald-400 dark:text-emerald-400' : 'text-rose-400 dark:text-rose-400'
            )}>
              {isPositive ? (
                <ArrowUpRight className="w-[calc(0.875rem+0.25vw)] h-[calc(0.875rem+0.25vw)]" />
              ) : (
                <ArrowDownRight className="w-[calc(0.875rem+0.25vw)] h-[calc(0.875rem+0.25vw)]" />
              )}
              <span className="font-medium">{Math.abs(metric.change)}%</span>
              <span className="text-muted-foreground">{t(`metrics.${metric.key}.change`)}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}