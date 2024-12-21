import { Card } from '@/components/ui/card';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

interface LoadingCardProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingCard({ title, description, className }: LoadingCardProps) {
  return (
    <Card className={cn('p-6', className)}>
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <LoadingSpinner size="lg" />
        {title && (
          <h3 className="mt-4 font-medium text-lg animate-pulse">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-2 text-sm text-muted-foreground animate-pulse">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}