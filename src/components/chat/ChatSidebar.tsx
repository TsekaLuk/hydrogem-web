import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatSession } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { MessageSquarePlus, Trash2, Menu, Search, PlusCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

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
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'zh' ? zhCN : enUS;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

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
    // 收起侧边栏时自动隐藏搜索
    if (!isCollapsed) {
      setIsSearchVisible(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      // 使用 setTimeout 确保动画开始后再聚焦
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  };

  const filteredSessions = sessions.filter(session => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 使用原生confirm替代AlertDialog组件
    if (window.confirm(t('chat.confirmDelete'))) {
      onDeleteSession(sessionId);
    }
  };

  // 滚动到当前会话
  useEffect(() => {
    if (currentSessionId && scrollRef.current) {
      const element = document.getElementById(`chat-session-${currentSessionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentSessionId]);

  // 侧边栏动画变体
  const sidebarVariants = {
    expanded: {
      width: isMobile ? "100%" : "18rem",
      transition: { 
        width: {
          duration: 0.4, 
          ease: [0.4, 0.0, 0.2, 1] // Material Design ease-out curve
        }
      }
    },
    collapsed: {
      width: "3.5rem",
      transition: { 
        width: {
          duration: 0.4, 
          ease: [0.4, 0.0, 0.2, 1] // Material Design ease-out curve
        }
      }
    }
  };

  // 内容子元素的动画变体
  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.3, 
        ease: "easeOut",
        delay: 0.1
      }
    },
    collapsed: {
      opacity: 0,
      x: -10,
      transition: { 
        duration: 0.2, 
        ease: "easeIn" 
      }
    }
  };

  // 新建按钮动画变体
  const newChatButtonVariants = {
    expanded: {
      width: "100%",
      borderRadius: "0.5rem",
      transition: { 
        duration: 0.4, 
        ease: [0.4, 0.0, 0.2, 1]
      }
    },
    collapsed: {
      width: "2.5rem",
      borderRadius: "0.5rem",
      transition: { 
        duration: 0.4, 
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  // 搜索框动画变体
  const searchVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      marginBottom: 0,
      transition: { 
        opacity: { duration: 0.2 },
        height: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }
      }
    },
    visible: { 
      opacity: 1, 
      height: "auto",
      marginBottom: 8,
      transition: { 
        opacity: { duration: 0.4, delay: 0.1 },
        height: { duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }
      }
    }
  };

  // 更柔和的渐变配色
  const gradientClasses = "bg-gradient-to-r from-cyan-500/50 via-sky-500/50 to-indigo-400/50 hover:from-cyan-500/60 hover:via-sky-500/60 hover:to-indigo-400/60 dark:from-cyan-800/40 dark:via-sky-800/40 dark:to-indigo-700/40 dark:hover:from-cyan-800/50 dark:hover:via-sky-800/50 dark:hover:to-indigo-700/50";

  return (
    <motion.div 
      ref={sidebarRef}
      className="h-full flex flex-col bg-background/30 backdrop-blur-md border-r border-border/20 relative chat-sidebar overflow-hidden"
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
    >
      {/* 优雅的侧边栏收缩控制区 */}
      <div 
        className={cn(
          "absolute top-0 bottom-0 -right-px h-full w-px cursor-col-resize transition-all duration-300 group z-10",
          "after:absolute after:top-0 after:bottom-0 after:w-3 after:-right-1 after:z-0 after:content-['']",
          "hover:bg-sky-500/40 active:bg-sky-500/60"
        )}
        onClick={toggleSidebar}
        aria-label={isCollapsed ? t('actions.expand') : t('actions.collapse')}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={isCollapsed ? "collapsed" : "expanded"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute flex items-center justify-center",
              isCollapsed ? "-right-3" : "-right-2",
              "top-1/2 -translate-y-1/2 z-10"
            )}
          >
            <div className={cn(
              "h-5 w-5 rounded-full shadow-sm bg-background/90 backdrop-blur-sm border border-border/40",
              "flex items-center justify-center",
              "group-hover:border-sky-500/40 group-hover:shadow-md transition-all duration-300",
              "group-active:scale-95"
            )}>
              <ChevronLeft 
                className={cn(
                  "h-3 w-3 text-muted-foreground transition-all duration-300",
                  "group-hover:text-sky-500",
                  isCollapsed && "rotate-180"
                )} 
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden self-end m-2"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? t('actions.expand') : t('actions.collapse')}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}
      
      <div className={cn(
        "p-3 flex items-center gap-2", 
        isCollapsed && "justify-center"
      )}>
        <motion.div 
          className="w-full"
          initial={false}
          animate={isCollapsed ? "collapsed" : "expanded"}
          variants={newChatButtonVariants}
        >
          <Button
            className={cn(
              "w-full justify-start gap-2 transition-all shadow-sm py-5 chat-new-button",
              "hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
              gradientClasses,
              "text-white/90 dark:text-white/80 backdrop-blur-sm",
              isCollapsed && "px-0 flex justify-center"
            )}
            onClick={onNewChat}
            aria-label={t('chat.newChat')}
          >
            <MessageSquarePlus className="h-4 w-4" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="truncate"
                >
                  {t('chat.newChat')}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
        
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 border-border/30 hover:bg-accent/50"
                    onClick={toggleSearch}
                    aria-label={t('actions.search')}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('chat.searchChats')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isSearchVisible && !isCollapsed && (
          <motion.div 
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={searchVariants}
            className="px-3"
          >
            <div className="relative">
              <Input
                ref={searchInputRef}
                id="chat-search"
                placeholder={t('chat.searchChats')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 text-sm chat-search-input pr-8"
                aria-label={t('chat.searchChats')}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 absolute right-1 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
                  onClick={() => setSearchQuery('')}
                  aria-label={t('actions.clear')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="px-3 py-2 flex items-center justify-between"
          >
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
              {filteredSessions.length > 0 
                ? searchQuery 
                  ? `${t('chat.searchChats')} (${filteredSessions.length})` 
                  : t('chat.recentChats')
                : t('chat.noChats')}
            </h3>
            {filteredSessions.length > 0 && searchQuery && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={() => setSearchQuery('')}
                aria-label={t('actions.clear')}
              >
                {t('actions.clear')}
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollArea 
        className={cn("flex-1", isCollapsed ? "px-0" : "px-2")}
        ref={scrollRef}
      >
        <AnimatePresence>
          {filteredSessions.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={cn("space-y-2 py-1", isCollapsed && "px-1.5")}
            >
              {filteredSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  id={`chat-session-${session.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.03 }
                  }}
                  className={cn(
                    'group rounded-lg text-sm chat-session-item',
                    'border border-transparent transition-all duration-200',
                    currentSessionId === session.id
                      ? 'bg-gradient-to-r from-sky-500/10 to-indigo-400/10 border-sky-500/20 shadow-sm active'
                      : 'hover:bg-accent/50 hover:border-border/50',
                    'cursor-pointer',
                    isCollapsed ? "px-0 py-2.5 flex justify-center" : "px-3 py-2.5 flex items-center gap-2"
                  )}
                  onClick={() => onSelectSession(session.id)}
                >
                  {isCollapsed ? (
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full flex-shrink-0 chat-session-indicator",
                      currentSessionId === session.id
                        ? "bg-sky-500 ring-2 ring-sky-500/20 ring-offset-1 ring-offset-background"
                        : "bg-gray-300 dark:bg-gray-600"
                    )} />
                  ) : (
                    <>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full flex-shrink-0 chat-session-indicator",
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
                          "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
                          "hover:bg-red-500/10 hover:text-red-500"
                        )}
                        onClick={(e) => handleDeleteClick(session.id, e)}
                        aria-label={t('chat.deleteSession')}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">{t('chat.deleteSession')}</span>
                      </Button>
                    </>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            !isCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center h-full text-center p-4 chat-empty-state"
              >
                {searchQuery ? (
                  <>
                    <Search className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground mb-1">{t('messages.noData')}</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => setSearchQuery('')}
                      aria-label={t('actions.clear')}
                    >
                      {t('actions.clear')}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-indigo-400/20 dark:from-cyan-800/15 dark:via-sky-800/15 dark:to-indigo-700/15 flex items-center justify-center mb-3">
                      <MessageSquarePlus className="h-8 w-8 text-sky-500 dark:text-sky-600" />
                    </div>
                    <h3 className="text-base font-medium mb-1">{t('chat.newChat')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{t('chat.noChats')}</p>
                    <Button
                      size="sm"
                      className={cn(
                        "gap-2 text-white/90 dark:text-white/80 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all",
                        gradientClasses
                      )}
                      onClick={onNewChat}
                      aria-label={t('chat.newChat')}
                    >
                      <PlusCircle className="h-4 w-4" />
                      {t('chat.newChat')}
                    </Button>
                  </>
                )}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </ScrollArea>
      
      {/* 浮动新建按钮 - 仅在有会话且不处于折叠状态时显示 */}
      {sessions.length > 0 && !isCollapsed && !isMobile && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="absolute bottom-4 right-4"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-full shadow-md hover:shadow-lg transition-all chat-floating-button text-white/90 dark:text-white/80",
                    gradientClasses
                  )}
                  onClick={onNewChat}
                  aria-label={t('chat.newChat')}
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{t('chat.newChat')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      )}
    </motion.div>
  );
}