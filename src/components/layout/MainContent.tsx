import { cn } from '@/lib/utils';
import { ContentHeader } from './ContentHeader';
import { ContentGrid } from './ContentGrid';

interface MainContentProps {
  className?: string;
  children?: React.ReactNode;
}

export function MainContent({ className, children }: MainContentProps) {
  return (
    <main className={cn(
      'flex-1 p-2 sm:p-4 md:p-6',
      'transition-all duration-300',
      'md:ml-[240px]',
      'container mx-auto',
      className
    )}>
      <ContentHeader />
      <div className="w-full mt-6">
        {children}
      </div>
    </main>
  );
}