import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Activity,
  LineChart,
  HelpCircle,
  type LucideIcon 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

interface SidebarNavProps {
  isCollapsed: boolean;
  onViewChange: (view: 'chat' | 'monitoring' | 'analytics' | 'help') => void;
  currentView: string;
}

type NavItem = {
  titleKey: string;
  icon: LucideIcon;
  view: 'chat' | 'monitoring' | 'analytics' | 'help';
  disabled?: boolean;
};

const navItems: NavItem[] = [
  {
    titleKey: 'nav.chat',
    icon: MessageSquare,
    view: 'chat',
  },
  {
    titleKey: 'nav.monitoring',
    icon: Activity,
    view: 'monitoring',
  },
  {
    titleKey: 'nav.analytics',
    icon: LineChart,
    view: 'analytics',
  },
  {
    titleKey: 'nav.help',
    icon: HelpCircle,
    view: 'help',
  },
];

export function SidebarNav({ isCollapsed, onViewChange, currentView }: SidebarNavProps) {
  const { t } = useTranslation();

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const title = t(item.titleKey);
          return isCollapsed ? (
            <Tooltip key={item.view} delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewChange(item.view)}
                  className={cn(
                    'h-10 w-10',
                    currentView === item.view && 'bg-accent',
                    item.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={item.disabled}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{title}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {title}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              key={item.view}
              variant="ghost"
              onClick={() => onViewChange(item.view)}
              className={cn(
                'w-full justify-start gap-4',
                currentView === item.view && 'bg-accent',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
              disabled={item.disabled}
            >
              <Icon className="h-5 w-5" />
              {title}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}