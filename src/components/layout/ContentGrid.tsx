import { cn } from '@/lib/utils';

interface ContentGridProps {
  className?: string;
  children?: React.ReactNode;
}

export function ContentGrid({ className, children }: ContentGridProps) {
  return (
    <div className={cn(
      'grid gap-4 md:gap-6',
      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      'auto-rows-min',
      className
    )}>
      {children}
    </div>
  );
}