import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SidebarNav } from './SidebarNav';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  className?: string;
  onViewChange: (view: 'chat' | 'monitoring' | 'analytics' | 'help') => void;
  currentView: string;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ className, onViewChange, currentView, onToggleCollapse }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggleCollapse) {
      onToggleCollapse(newCollapsedState);
    }
  };

  return (
    <aside className={cn(
      'fixed left-0 top-14 h-[calc(100vh-3.5rem)]',
      'border-r border-border/50 bg-background/95 backdrop-blur-xl z-50',
      'transition-all duration-300 ease-in-out shadow-sm',
      isCollapsed ? 'w-[60px]' : 'w-[240px]',
      'md:block',
      className
    )}>
      <div className="flex h-full flex-col relative">
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav 
            isCollapsed={isCollapsed}
            onViewChange={onViewChange}
            currentView={currentView}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute -right-4 top-4 h-8 w-8',
            'rounded-full border bg-background shadow-sm z-50',
            'hover:bg-accent hover:text-accent-foreground'
          )}
          onClick={handleToggleCollapse}
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed && "rotate-180"
          )} />
          <span className="sr-only">
            {isCollapsed ? t('actions.expand') : t('actions.collapse')}
          </span>
        </Button>
      </div>
    </aside>
  );
}