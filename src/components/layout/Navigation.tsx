import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Activity, BarChart3, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavigationProps {
  className?: string;
  currentView: 'chat' | 'monitoring' | 'analytics' | 'help';
  onViewChange: (view: 'chat' | 'monitoring' | 'analytics' | 'help') => void;
}

const navItems = [
  { key: 'chat', icon: MessageSquare },
  { key: 'monitoring', icon: Activity },
  { key: 'analytics', icon: BarChart3 },
  { key: 'help', icon: HelpCircle },
] as const;

export function Navigation({ className, currentView, onViewChange }: NavigationProps) {
  const { t } = useTranslation();

  return (
    <div className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {navItems.map(({ key, icon: Icon }) => (
        <Tooltip key={key}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-9 w-9',
                currentView === key ? 'bg-muted' : 'hover:bg-transparent hover:text-foreground'
              )}
              onClick={() => onViewChange(key)}
            >
              <Icon className="h-5 w-5" />
              <span className="sr-only">{t(`nav.${key}`)}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t(`nav.${key}`)}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}