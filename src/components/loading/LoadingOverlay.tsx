import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ message, className }: LoadingOverlayProps) {
  return (
    <div className={cn(
      'absolute inset-0 flex flex-col items-center justify-center',
      'bg-background/80 backdrop-blur-sm z-50',
      'transition-all duration-200',
      className
    )}>
      <LoadingSpinner size="lg" className="text-primary" />
      {message && (
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}