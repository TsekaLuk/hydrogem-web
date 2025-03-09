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
    <div className="w-64 h-full flex flex-col bg-background/30 backdrop-blur-md border-r border-border/20">
      <div className="p-3">
        <Button
          className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm py-5"
          onClick={onNewChat}
        >
          <MessageSquarePlus className="h-4 w-4" />
          {t('chat.newChat')}
        </Button>
      </div>

      <div className="px-3 py-2">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
          {sessions.length > 0 ? t('chat.recentChats') : t('chat.noChats')}
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 px-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
                'hover:bg-accent/40 cursor-pointer transition-all duration-200',
                'border border-transparent',
                currentSessionId === session.id 
                  ? 'bg-accent text-accent-foreground font-medium shadow-sm border-accent/30' 
                  : 'text-foreground/80',
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
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="sr-only">{t('chat.deleteSession')}</span>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}