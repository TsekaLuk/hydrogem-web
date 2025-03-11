import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatSession } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquarePlus, Trash2, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

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
  const { t } = useTranslation('monitoring');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 检测屏幕尺寸变化
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // 在移动设备上自动折叠侧边栏
      if (mobile && !isCollapsed) {
        setIsCollapsed(true);
      }
    };

    // 初始检查
    checkScreenSize();

    // 监听窗口大小变化
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      "h-full flex flex-col bg-background/30 backdrop-blur-md border-r border-border/20 transition-all duration-300",
      isCollapsed ? "w-12" : "w-64",
      "md:w-64 md:min-w-[16rem]"
    )}>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden self-end m-2"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}
      
      <div className={cn("p-3", isCollapsed && isMobile ? "hidden" : "block")}>
        <Button
          className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm py-5"
          onClick={onNewChat}
        >
          <MessageSquarePlus className="h-4 w-4" />
          {!isCollapsed && t('chat.newChat')}
        </Button>
      </div>

      <div className={cn("px-3 py-2", isCollapsed && isMobile ? "hidden" : "block")}>
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
          {sessions.length > 0 ? t('chat.recentChats') : t('chat.noChats')}
        </h3>
      </div>

      <ScrollArea className={cn("flex-1", isCollapsed && isMobile ? "hidden" : "block")}>
        <div className="space-y-1 px-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm',
                currentSessionId === session.id
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/50 hover:text-accent-foreground',
                'cursor-pointer transition-colors'
              )}
              onClick={() => onSelectSession(session.id)}
            >
              <div className="flex-1 truncate">
                {session.title || t('chat.newChat')}
                <p className="text-xs text-muted-foreground truncate">
                  {formatDistanceToNow(new Date(session.lastMessageAt), { addSuffix: true })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}