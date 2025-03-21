import { Menu, MessageSquare, GaugeCircle, LineChart, BrainCircuit, HelpCircle, Type, Settings, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';
import { useChat } from '@/hooks/useChat';
import { useSidebar } from '@/hooks/useSidebar';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export function MobileMenu() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'zh' ? zhCN : enUS;
  const { toggle: toggleSidebar } = useSidebar();
  const {
    sessions,
    currentSessionId,
    createNewSession,
    switchSession,
    deleteSession,
  } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  // 导航到聊天会话
  const handleSessionClick = (sessionId: string) => {
    switchSession(sessionId);
    setIsOpen(false);
  };

  // 创建新的聊天会话
  const handleNewChat = () => {
    createNewSession();
    setIsOpen(false);
  };

  // 处理导航链接
  const handleMenuToggle = () => {
    toggleSidebar();
  };

  // 删除会话
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('chat.confirmDelete'))) {
      deleteSession(sessionId);
    }
  };

  // 渐变样式类
  const gradientClasses = "bg-gradient-to-r from-cyan-500/50 via-sky-500/50 to-indigo-400/50 hover:from-cyan-500/60 hover:via-sky-500/60 hover:to-indigo-400/60 dark:from-cyan-800/40 dark:via-sky-800/40 dark:to-indigo-700/40 dark:hover:from-cyan-800/50 dark:hover:via-sky-800/50 dark:hover:to-indigo-700/50";

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden"
          onClick={handleMenuToggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t('actions.menu')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] sm:w-[350px] py-6">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center">
            <Logo variant="compact" />
          </SheetTitle>
        </SheetHeader>
        
        {/* 聊天会话区域 */}
        <div className="mb-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            {sessions.length > 0 ? t('chat.recentChats') : t('chat.noChats')}
          </h3>
          
          <ScrollArea className="h-[40vh] px-1">
            {sessions.length > 0 ? (
              <div className="space-y-2 py-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      'group rounded-lg text-sm',
                      'border border-transparent transition-all duration-200',
                      'px-3 py-2.5 flex items-center gap-2',
                      currentSessionId === session.id
                        ? 'bg-gradient-to-r from-sky-500/10 to-indigo-400/10 border-sky-500/20 shadow-sm'
                        : 'hover:bg-accent/50 hover:border-border/50',
                      'cursor-pointer'
                    )}
                    onClick={() => handleSessionClick(session.id)}
                  >
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full flex-shrink-0",
                      currentSessionId === session.id
                        ? "bg-sky-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    )} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {session.title || t('chat.newChat')}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                        <span className="truncate">
                          {formatDistanceToNow(new Date(session.timestamp), { 
                            addSuffix: true,
                            locale: locale 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-6 w-6 opacity-70 hover:opacity-100",
                        "hover:bg-red-500/10 hover:text-red-500"
                      )}
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      aria-label={t('chat.deleteSession')}
                    >
                      <PlusCircle className="h-3.5 w-3.5 rotate-45" />
                      <span className="sr-only">{t('chat.deleteSession')}</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-indigo-400/20 dark:from-cyan-800/15 dark:via-sky-800/15 dark:to-indigo-700/15 flex items-center justify-center mb-3">
                  <MessageSquare className="h-6 w-6 text-sky-500 dark:text-sky-600" />
                </div>
                <h3 className="text-base font-medium mb-1">{t('chat.newChat')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('chat.noChats')}</p>
              </div>
            )}
          </ScrollArea>
        </div>
        
        <div className="space-y-3 mt-6">
          <Button
            className={cn(
              "w-full justify-start gap-2 py-5 shadow-sm",
              "hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
              gradientClasses,
              "text-white/90 dark:text-white/80 backdrop-blur-sm"
            )}
            onClick={handleNewChat}
            aria-label={t('chat.newChat')}
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t('chat.newChat')}</span>
          </Button>
        </div>
        
        <SheetFooter className="mt-auto pt-4">
          <div className="space-y-2 w-full">
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsOpen(false)}>
              <Settings className="mr-2 h-4 w-4" />
              {t('settings.title')}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}