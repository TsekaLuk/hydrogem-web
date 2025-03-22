import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Menu, MessageSquare, GaugeCircle, LineChart, 
  BrainCircuit, HelpCircle, Settings, 
  PlusCircle, X, Home, ChevronRight
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from './Logo';
import { useChat } from '@/hooks/useChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import SearchTrigger from '@/components/search/SearchTrigger';

export function MobileMenu() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'zh' ? zhCN : enUS;
  const {
    sessions,
    currentSessionId,
    createNewSession,
    switchSession,
    deleteSession,
  } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('chats');

  // 导航项配置
  const navItems = [
    {
      id: 'dashboard',
      label: t('nav.dashboard'),
      icon: <Home className="h-5 w-5" />,
      href: '#dashboard'
    },
    {
      id: 'monitoring',
      label: t('nav.monitoring'),
      icon: <GaugeCircle className="h-5 w-5" />,
      href: '#monitoring'
    },
    {
      id: 'analytics',
      label: t('nav.analytics'),
      icon: <LineChart className="h-5 w-5" />,
      href: '#analytics'
    },
    {
      id: 'knowledge',
      label: '璇玑玉衡',
      icon: <BrainCircuit className="h-5 w-5" />,
      href: '#knowledge'
    },
    {
      id: 'help',
      label: t('nav.help'),
      icon: <HelpCircle className="h-5 w-5" />,
      href: '#help'
    }
  ];

  // 导航到聊天会话
  const handleSessionClick = (sessionId: string) => {
    switchSession(sessionId);
    setIsOpen(false);
  };

  // 创建新的聊天会话
  const handleNewChat = () => {
    // 首先创建会话
    createNewSession();
    
    // 强制设置hash并手动触发事件以确保导航
    window.location.hash = 'chat';
    
    // 确保关闭MobileMenu
    setIsOpen(false);

    // 强制触发hashchange事件 - 这是为了确保即使hash没变也能正确导航
    if (window.location.hash === '#chat') {
      // 如果已经在chat页面，手动触发hashchange事件
      const hashChangeEvent = new Event('hashchange');
      window.dispatchEvent(hashChangeEvent);
    }
    
    // 添加日志以便调试
    console.log('新建聊天并导航至: #chat');
  };

  // 处理导航链接点击
  const handleNavigation = (href: string) => {
    window.location.hash = href.replace('#', '');
    setIsOpen(false);
  };

  // 删除会话
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (window.confirm(t('chat.confirmDelete'))) {
      deleteSession(sessionId);
    }
  };

  // 渐变样式类
  const gradientClasses = "bg-gradient-to-r from-cyan-500/50 via-sky-500/50 to-indigo-400/50 hover:from-cyan-500/60 hover:via-sky-500/60 hover:to-indigo-400/60 dark:from-cyan-800/40 dark:via-sky-800/40 dark:to-indigo-700/40 dark:hover:from-cyan-800/50 dark:hover:via-sky-800/50 dark:hover:to-indigo-700/50";

  // 动画变体
  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1] // Material Design ease-out curve
      }
    })
  };

  // 页面过渡动画变体
  const pageTransitionVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1],
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      x: -10,
      transition: {
        duration: 0.3
      }
    }
  };

  // 处理Sheet打开关闭时的副作用
  useEffect(() => {
    if (isOpen) {
      // 当菜单打开时，阻止背景滚动
      document.body.style.overflow = 'hidden';
    } else {
      // 当菜单关闭时，恢复背景滚动
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden relative"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t('actions.menu')}</span>
          {sessions.length > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 h-2 w-2 rounded-full bg-blue-500"
            />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[85vw] sm:w-[350px] p-0 overflow-hidden flex flex-col bg-white dark:bg-gray-950"
      >
        <div className="flex flex-col h-full">
          {/* 标题栏 - 交换Logo和关闭按钮的位置 */}
          <SheetHeader className="px-4 py-3 border-b border-border/30 flex-row items-center justify-between">
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
            <SheetTitle className="flex items-center">
              <Logo variant="compact" />
            </SheetTitle>
          </SheetHeader>
          
          {/* 添加搜索触发器 */}
          <div className="px-4 py-2 border-b">
            <SearchTrigger 
              className="w-full justify-start" 
              variant="outline"
              showKeyboardShortcut={false}
            />
          </div>
          
          {/* 内容区域 */}
          <Tabs 
            defaultValue="chats" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="h-12 w-full justify-start px-2 py-1 bg-transparent border-b border-border/30">
              <TabsTrigger 
                value="chats" 
                className="h-full relative rounded-md data-[state=active]:bg-secondary data-[state=active]:text-primary"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{t('nav.chat')}</span>
                </div>
                {sessions.length > 0 && activeTab !== 'chats' && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-blue-500" />
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="menu" 
                className="h-full rounded-md data-[state=active]:bg-secondary data-[state=active]:text-primary"
              >
                <div className="flex items-center gap-2">
                  <Menu className="h-4 w-4" />
                  <span>{t('nav.menu')}</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            {/* 聊天会话内容 */}
            <TabsContent 
              value="chats" 
              className="flex-1 flex flex-col overflow-hidden p-0 data-[state=inactive]:hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key="chats-tab"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={pageTransitionVariants}
                  className="flex flex-col h-full"
                >
                  <div className="mb-4 mt-2 px-3">
                    <Button
                      className={cn(
                        "w-full justify-start gap-2 py-5 shadow-sm",
                        "hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all",
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
                  
                  <div className="px-3 py-1">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
                      {sessions.length > 0 ? t('chat.recentChats') : t('chat.noChats')}
                    </h3>
                  </div>
                  
                  <ScrollArea className="flex-1 px-3 py-1 hydrogem-scroll-container">
                    <AnimatePresence initial={false}>
                      {sessions.length > 0 ? (
                        <motion.div 
                          className="space-y-2 py-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {sessions.map((session, index) => (
                            <motion.div
                              key={session.id}
                              custom={index}
                              initial="hidden"
                              animate="visible"
                              variants={listItemVariants}
                              className={cn(
                                'group rounded-lg text-sm',
                                'border border-transparent transition-all duration-200',
                                'px-3 py-3 flex items-center gap-2',
                                currentSessionId === session.id
                                  ? 'bg-secondary/80 border-secondary/80 shadow-sm'
                                  : 'hover:bg-secondary/40 hover:border-border/50',
                                'cursor-pointer relative overflow-hidden'
                              )}
                              onClick={() => handleSessionClick(session.id)}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {currentSessionId === session.id && (
                                <motion.div 
                                  className="absolute left-0 top-0 w-1 h-full bg-primary"
                                  layoutId="activeIndicator"
                                />
                              )}
                              
                              <div className={cn(
                                "w-2 h-2 rounded-full flex-shrink-0",
                                currentSessionId === session.id
                                  ? "bg-primary"
                                  : "bg-muted-foreground/40"
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
                                  "h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                                  "hover:bg-destructive/10 hover:text-destructive rounded-full"
                                )}
                                onClick={(e) => handleDeleteSession(session.id, e)}
                                aria-label={t('chat.deleteSession')}
                              >
                                <PlusCircle className="h-3.5 w-3.5 rotate-45" />
                                <span className="sr-only">{t('chat.deleteSession')}</span>
                              </Button>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center justify-center h-[40vh] text-center p-4"
                        >
                          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
                            <MessageSquare className="h-7 w-7 text-primary" />
                          </div>
                          <h3 className="text-base font-medium mb-1">{t('chat.noChatsYet')}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{t('chat.startNewChat')}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ScrollArea>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
            
            {/* 菜单导航内容 */}
            <TabsContent 
              value="menu" 
              className="flex-1 flex flex-col overflow-hidden p-0 data-[state=inactive]:hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key="menu-tab"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={pageTransitionVariants}
                  className="flex flex-col h-full"
                >
                  <ScrollArea className="flex-1 px-3 py-2">
                    <div className="space-y-1">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-2">
                        {t('nav.mainNavigation')}
                      </h3>
                      <AnimatePresence initial={false}>
                        {navItems.map((item, index) => (
                          <motion.div
                            key={item.id}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={listItemVariants}
                          >
                            <Button
                              variant="ghost"
                              className="w-full justify-start items-center h-12 mb-1 rounded-lg group hover:bg-secondary/50 transition-all"
                              onClick={() => handleNavigation(item.href)}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <motion.div 
                                  className="bg-secondary/80 p-2 rounded-md group-hover:bg-secondary/100 transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {item.icon}
                                </motion.div>
                                <span className="font-medium">{item.label}</span>
                              </div>
                              <motion.div
                                initial={{ x: 0 }}
                                whileHover={{ x: 3 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                              >
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </motion.div>
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-border/30">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-2">
                        {t('nav.quickLinks')}
                      </h3>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Button
                            variant="outline"
                            className="h-auto py-4 flex flex-col items-center justify-center gap-2 w-full hover:shadow-sm transition-all duration-200"
                            onClick={() => handleNavigation('#settings')}
                          >
                            <Settings className="h-5 w-5" />
                            <span className="text-xs">{t('settings.title')}</span>
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Button
                            variant="outline"
                            className="h-auto py-4 flex flex-col items-center justify-center gap-2 w-full hover:shadow-sm transition-all duration-200"
                            onClick={() => handleNavigation('#help')}
                          >
                            <HelpCircle className="h-5 w-5" />
                            <span className="text-xs">{t('nav.help')}</span>
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </ScrollArea>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
          
          {/* 底部版权信息 */}
          <div className="px-4 py-3 border-t border-border/30 flex items-center justify-center mt-auto">
            <p className="text-xs text-muted-foreground">
              HydroGem © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}