import { cn } from '@/lib/utils';
import { ContentHeader } from './ContentHeader';
import { ContentGrid } from './ContentGrid';

interface MainContentProps {
  className?: string;
  children?: React.ReactNode;
  sidebarCollapsed?: boolean;
}

export function MainContent({ className, children, sidebarCollapsed = false }: MainContentProps) {
  return (
    <main className={cn(
      'flex-1 p-2 sm:p-4 md:p-6',
      'transition-all duration-300',
      sidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[240px]',
      'w-full max-w-full overflow-x-hidden overflow-y-auto',
      className
    )}>
      <div className="max-w-[1200px] mx-auto w-full">
        <ContentHeader />
        <div className="w-full mt-4">
          {children}
        </div>
      </div>
    </main>
  );
}