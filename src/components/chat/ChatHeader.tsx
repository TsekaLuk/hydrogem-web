import { Trash2, MessagesSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  onClearChat: () => void;
}

export function ChatHeader({ onClearChat }: ChatHeaderProps) {
  const { t } = useTranslation('monitoring');

  return (
    <div className={cn(
      "flex items-center justify-between px-2 px-4 py-2 py-3",
      "border-b border-border/20 bg-muted/30 backdrop-blur-sm"
    )}>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="flex items-center justify-center h-6 sm:h-7 w-6 sm:w-7 rounded-full bg-primary/10 text-primary">
          <MessagesSquare className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
        </div>
        <h2 className="text-sm sm:text-base font-medium">{t('chat.title')}</h2>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm"
        className="text-muted-foreground hover:text-destructive transition-colors h-7 sm:h-9 px-2 sm:px-3"
        onClick={onClearChat}
      >
        <Trash2 className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1 sm:mr-1.5" />
        <span className="text-xs">{t('chat.clear')}</span>
      </Button>
    </div>
  );
}