import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ChatHeaderProps {
  onClearChat: () => void;
}

export function ChatHeader({ onClearChat }: ChatHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-semibold">{t('chat.title')}</h2>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onClearChat}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">{t('chat.clear')}</span>
      </Button>
    </div>
  );
}