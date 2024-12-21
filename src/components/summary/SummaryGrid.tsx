import { SummaryCard } from './SummaryCard';
import { DataSummary, SummaryCardConfig } from '@/types/summary';
import { cn } from '@/lib/utils';

interface SummaryGridProps {
  data: DataSummary[];
  config?: SummaryCardConfig;
  className?: string;
  onCardExpand?: (data: DataSummary) => void;
}

export function SummaryGrid({ data, config, className, onCardExpand }: SummaryGridProps) {
  return (
    <div className={cn(
      'grid gap-4',
      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      className
    )}>
      {data.map((summary) => (
        <SummaryCard
          key={summary.id}
          data={summary}
          config={config}
          onExpand={onCardExpand}
        />
      ))}
    </div>
  );
}