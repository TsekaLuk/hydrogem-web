import { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();

  // 检测屏幕尺寸变化
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      // 在移动设备上自动折叠侧边栏
      if (window.innerWidth < 768 && !isCollapsed) {
        setIsCollapsed(true);
        if (onToggleCollapse) {
          onToggleCollapse(true);
        }
      }
    };

    // 初始检查
    checkScreenSize();

    // 监听窗口大小变化
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [onToggleCollapse, isCollapsed]);

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
      'border-r border-border/50 bg-background/95 backdrop-blur-xl z-[100]',
      'transition-all duration-300 ease-in-out shadow-sm',
      isCollapsed ? 'w-[60px]' : 'w-[240px]',
      isMobile ? 'transform translate-x-0' : '',
      className
    )}>
      <div className="flex h-full flex-col relative">
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/30">
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
            'absolute -right-3 top-4 h-6 w-6',
            'rounded-full border bg-background shadow-sm z-[101]',
            'hover:bg-accent hover:text-accent-foreground'
          )}
          onClick={handleToggleCollapse}
        >
          <ChevronLeft className={cn(
            "h-3 w-3 transition-transform",
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