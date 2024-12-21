import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatSession } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquarePlus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: ChatSidebarProps) {
  const { t } = useTranslation();

  return (
    <div className="w-72 h-full flex flex-col bg-background/50 backdrop-blur-sm">
      <div className="p-4">
        <Button
          className="w-full justify-start gap-2 bg-black/90 text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90 transition-colors duration-200"
          onClick={onNewChat}
        >
          <MessageSquarePlus className="h-4 w-4" />
          {t('chat.newChat')}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                'group flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm',
                'hover:bg-accent/50 cursor-pointer transition-all duration-300',
                'border border-transparent',
                currentSessionId === session.id && 'bg-accent/50 border-border',
                'animate-slide-in'
              )}
              onClick={() => onSelectSession(session.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{session.title}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {formatDistanceToNow(session.timestamp, { addSuffix: true })}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">{t('chat.deleteSession')}</span>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}