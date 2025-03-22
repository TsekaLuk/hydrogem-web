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
  PlusCircle, X, Home, ChevronRight, Search
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from './Logo';
import { useChat } from '@/hooks/useChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import SearchTrigger from '@/components/search/SearchTrigger';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/contexts/search-context';
import SearchResults from '@/components/search/SearchResults';

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
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // 使用搜索上下文
  const { 
    searchQuery, 
    setSearchQuery, 
    search, 
    clearSearch, 
    hasResults 
  } = useSearch();

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
    
    // 关闭菜单
    setIsOpen(false);
  };

  // 导航到指定路径
  const handleNavigation = (path: string) => {
    window.location.hash = path.replace('#', '');
    setIsOpen(false);
  };

  // 删除会话
  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    deleteSession(sessionId);
  };

  // 处理搜索输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      setShowSearchResults(true);
      search();
    } else {
      setShowSearchResults(false);
      clearSearch();
    }
  };
  
  // 清除搜索
  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
    clearSearch();
  };

  // 自定义动画变体
  const pageTransitionVariants = {
    hidden: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.3
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        delay: 0.1
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

  // 当抽屉关闭时清除搜索
  useEffect(() => {
    if (!isOpen) {
      setShowSearchResults(false);
      clearSearch();
    }
  }, [isOpen, clearSearch]);

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
          
          {/* 添加搜索输入框 */}
          <div className="px-4 py-2 border-b border-border/30">
            <div className="relative flex items-center w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t('search.searchPlaceholder')}
                className="pl-9 pr-9 py-2 h-10 w-full border-border/50 focus:border-primary/70"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          </div>
          
          {/* 搜索结果区域 */}
          {showSearchResults ? (
            <div className="flex-1 overflow-hidden">
              <div className="px-4 py-2 border-b border-border/30 flex justify-between items-center">
                <h2 className="text-sm font-medium">{t('search.results')}</h2>
                <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                  {t('actions.cancel')}
                </Button>
              </div>
              <div className="p-4 overflow-auto flex-1 custom-scrollbar max-h-[calc(100vh-200px)]">
                <SearchResults />
              </div>
            </div>
          ) : (
            /* 内容区域 - 当不显示搜索结果时 */
            <Tabs 
              defaultValue="chats" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <TabsList className="px-4 py-2 justify-start border-b border-border/30 bg-background">
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
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <div className="mb-4 mt-2 px-3">
                      <Button
                        className={cn(
                          "w-full justify-start gap-2 py-5 shadow-sm",
                          "hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all",
                          "bg-gradient-to-r from-blue-600 to-indigo-600",
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
                                variants={{
                                  hidden: { opacity: 0, y: 10 },
                                  visible: (i) => ({
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                      delay: i * 0.05,
                                      duration: 0.2
                                    }
                                  })
                                }}
                                className="relative group"
                              >
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    "w-full justify-start py-3 pl-3 pr-10 h-auto text-left font-normal",
                                    "hover:bg-muted/50 transition-colors duration-200",
                                    "border border-transparent",
                                    session.id === currentSessionId && "bg-muted/70 font-medium"
                                  )}
                                  onClick={() => handleSessionClick(session.id)}
                                >
                                  <div className="flex flex-col w-full overflow-hidden">
                                    <div className="flex items-center mb-1 justify-between">
                                      <span className="truncate mr-2 text-sm">
                                        {session.title || t('chat.untitledChat')}
                                      </span>
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <span>
                                        {formatDistanceToNow(new Date(session.timestamp), {
                                          addSuffix: true,
                                          locale
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </Button>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    "absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7",
                                    session.id === currentSessionId && "opacity-100"
                                  )}
                                  onClick={(e) => handleDelete(e, session.id)}
                                >
                                  <X className="h-3 w-3" />
                                  <span className="sr-only">{t('actions.delete')}</span>
                                </Button>
                              </motion.div>
                            ))}
                          </motion.div>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-10 px-4 text-center"
                          >
                            <MessageSquare className="h-8 w-8 mb-2 text-muted-foreground/50" />
                            <p className="text-muted-foreground mb-4">
                              {t('chat.noChatsYet')}
                            </p>
                            <Button
                              size="sm"
                              onClick={handleNewChat}
                              className="gap-2"
                            >
                              <PlusCircle className="h-4 w-4" />
                              <span>{t('chat.startNewChat')}</span>
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </ScrollArea>
                    
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
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
              
              {/* 菜单内容 */}
              <TabsContent 
                value="menu" 
                className="flex-1 overflow-hidden p-0 data-[state=inactive]:hidden"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key="menu-tab"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={pageTransitionVariants}
                    className="h-full"
                  >
                    <ScrollArea className="h-full px-4 py-2">
                      <div className="space-y-4 py-2">
                        {navItems.map((item) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant="ghost"
                              className="w-full justify-between items-center py-3 px-4"
                              onClick={() => handleNavigation(item.href)}
                            >
                              <div className="flex items-center">
                                {item.icon}
                                <span className="ml-3">{item.label}</span>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          )}
          
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