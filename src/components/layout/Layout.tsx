import { useChat } from '@/hooks/useChat';
import ChatContainer from '@/components/chat/ChatContainer';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { PermissionProvider } from '@/contexts/PermissionContext';
import { TooltipProvider} from '@/components/ui/tooltip';
import { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { 
  MessageSquare, 
  GaugeCircle, 
  LineChart, 
  HelpCircle, 
  Settings, 
  BrainCircuit,
  Type
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { Routes, Route} from 'react-router-dom';
import NineDotGridRandom from '@/components/ui/NineDotGridRandom';

// 简化懒加载导入，因为组件现在有默认导出
const MonitoringDashboard = lazy(() => import('@/components/monitoring/MonitoringDashboard'));
const AnalyticsDashboard = lazy(() => import('@/components/analytics/AnalyticsDashboard'));
const HelpCenter = lazy(() => import('@/components/help/HelpCenter'));
const KnowledgeGraph = lazy(() => import('@/components/knowledge/KnowledgeGraph'));
const FontShowcase = lazy(() => import('../FontShowcase'));
const MathTest = lazy(() => import('../MathTest'));
const StatusIndicatorShowcase = lazy(() => import('../examples/StatusIndicatorShowcase'));

export function Layout() {
  const {
    messages,
    sessions,
    currentSessionId,
    isLoading,
    sendMessage,
    clearChat,
    streamingMessage,
    error,
    createNewSession,
    switchSession,
    deleteSession,
    regenerateResponse,
  } = useChat();
  const [currentView, setCurrentView] = useState<'chat' | 'monitoring' | 'analytics' | 'help' | 'knowledge' | 'fonts'>('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const handleLanguageChange = () => {
      console.log('Language changed event received');
      // 强制组件重新渲染以更新翻译
      setCurrentView(prev => prev);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  useEffect(() => {
    const handleLayoutAdjust = () => {
      console.log('Layout adjustment event received');
      // 强制重新计算布局
      setSidebarCollapsed(prev => {
        // 触发状态更新以重新渲染
        return prev;
      });
    };

    window.addEventListener('layoutAdjust', handleLayoutAdjust);
    return () => window.removeEventListener('layoutAdjust', handleLayoutAdjust);
  }, []);

  useEffect(() => {
    console.log('App mounted');
    console.log('Current language:', i18n.language);
  }, [i18n]);

  useEffect(() => {
    console.log('Sidebar state:', sidebarCollapsed ? 'collapsed' : 'expanded');
  }, [sidebarCollapsed]);

  // 监听和清理body的pointer-events样式，防止页面卡死
  useEffect(() => {
    // 立即检查并清理当前body上的pointer-events样式
    if (document.body.style.pointerEvents === 'none') {
      document.body.style.removeProperty('pointer-events');
    }

    // 创建MutationObserver来监视body样式变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          const body = mutation.target as HTMLBodyElement;
          if (body.style.pointerEvents === 'none') {
            // 如果发现pointer-events: none，设置一个短暂延时后清除它
            // 这是为了让原始事件完成处理，但不至于让整个页面长时间无法交互
            setTimeout(() => {
              body.style.removeProperty('pointer-events');
            }, 500);
          }
        }
      });
    });

    // 开始观察body元素的style属性变化
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    // 清理函数
    return () => {
      observer.disconnect();
      // 确保在组件卸载时也移除样式
      document.body.style.removeProperty('pointer-events');
    };
  }, []);

  const handleRegenerateResponse = () => {
    regenerateResponse();
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  // 移除未使用的函数
  // const refreshMonitoringData = () => {
  //   console.log(t('monitoring.refreshing'));
  //   // 这里实际上应该调用API或重新获取数据
  // };

  // 根据 HydroGem logo 添加的品牌颜色
  const brandColor = "text-blue-500";
  const brandActiveColor = "text-blue-600";

  // 导航链接
  const navLinks = useMemo(() => [
    {
      label: t('nav.chat'),
      href: "#chat",
      icon: (
        <MessageSquare className="h-5 w-5 flex-shrink-0 transition-transform duration-380 group-hover:scale-110" />
      ),
    },
    {
      label: t('nav.monitoring'),
      href: "#monitoring",
      icon: (
        <GaugeCircle className="h-5 w-5 flex-shrink-0 transition-transform duration-380 group-hover:scale-110" />
      ),
    },
    {
      label: t('nav.analytics'),
      href: "#analytics",
      icon: (
        <LineChart className="h-5 w-5 flex-shrink-0 transition-transform duration-380 group-hover:scale-110" />
      ),
    },
    {
      label: "璇玑玉衡",
      href: "#knowledge",
      icon: (
        <BrainCircuit className="h-5 w-5 flex-shrink-0 transition-transform duration-380 group-hover:scale-110" />
      ),
    },
    {
      label: t('nav.help'),
      href: "#help",
      icon: (
        <HelpCircle className="h-5 w-5 flex-shrink-0 transition-transform duration-380 group-hover:scale-110" />
      ),
    },
    {
      label: "字体展示",
      href: "#fonts",
      icon: (
        <Type className="h-5 w-5 flex-shrink-0 transition-transform duration-380 group-hover:scale-110" />
      ),
    },
  ], [t]); // 只在t函数变化时重新计算

  const handleNavLinkClick = (view: 'chat' | 'monitoring' | 'analytics' | 'knowledge' | 'help' | 'fonts', e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'chat':
        return (
          <div className="flex flex-col h-full w-full overflow-hidden">
            <div className="flex flex-1 gap-4 h-full">
              {/* 中间聊天界面 */}
              <div className="flex-1 flex flex-col md:flex-row bg-background/50 rounded-xl overflow-hidden shadow-md backdrop-blur-sm border border-border/20 dark:bg-[#141a1a]/80 dark:border-[#1e2626]/50">
                <ChatSidebar
                  sessions={sessions}
                  currentSessionId={currentSessionId}
                  onNewChat={createNewSession}
                  onSelectSession={switchSession}
                  onDeleteSession={deleteSession}
                />
                <div className="flex-1 flex flex-col border-l border-border/40 overflow-hidden dark:border-[#1e2626]/50 max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-8rem)] max-h-[calc(100vh-7rem)]">
                  <ChatHeader onClearChat={clearChat} />
                  <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    <div className={cn("flex-1 overflow-y-auto mb-0", "hydrogem-scroll-container")}>
                    <ChatContainer 
                      messages={messages} 
                      streamingMessage={streamingMessage}
                      isLoading={isLoading}
                      onReply={handleRegenerateResponse}
                      className="px-1 sm:px-2 md:px-4" // Add responsive padding
                    />
                    </div>
                  </div>
                  {error && <div className="p-2 text-sm text-destructive text-center">{error}</div>}
                  <div className="py-1 pb-0 px-4 border-t border-border/20 bg-background/80 backdrop-blur-md dark:bg-[#141a1a]/90 dark:border-[#1e2626]/50">
                    <ChatInput onSend={sendMessage} isLoading={isLoading} />
                    <p className="text-xs text-muted-foreground mt-0 text-center px-2 opacity-80 hover:opacity-100 transition-opacity text-[0.65rem] sm:text-xs">
                      {new Date().getFullYear()} HydroGem AI · {t('chat.disclaimer', '响应内容可能并不总是准确，请谨慎核实重要信息')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'monitoring':
        return (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto h-full flex flex-col">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><NineDotGridRandom /></div>}>
              <MonitoringDashboard />
            </Suspense>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto h-full">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><NineDotGridRandom /></div>}>
              <AnalyticsDashboard />
            </Suspense>
          </div>
        );
      case 'help':
        return (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto h-full">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><NineDotGridRandom /></div>}>
              <HelpCenter />
            </Suspense>
          </div>
        );
      case 'knowledge':
        return (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto h-full">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><NineDotGridRandom /></div>}>
              <KnowledgeGraph />
            </Suspense>
          </div>
        );
      case 'fonts':
        return (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto h-full">
            <Suspense fallback={<div className="flex items-center justify-center h-full"><NineDotGridRandom /></div>}>
              <FontShowcase />
            </Suspense>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SettingsProvider>
      <UserProfileProvider>
        <PermissionProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Navbar />
              <div className="flex-1 pt-14 w-full h-[calc(100vh-3.5rem)] overflow-hidden">
                <Sidebar open={!sidebarCollapsed} setOpen={(open) => handleSidebarToggle(!open)} animate={true}>
                  <SidebarBody className="overflow-hidden">
                    <div className="flex flex-col flex-1">
                      <div className="flex flex-col gap-1 mt-6">
                        {navLinks.map((link, idx) => (
                          <SidebarLink 
                            key={idx} 
                            link={{
                              ...link,
                              icon: React.cloneElement(link.icon as React.ReactElement, {
                                className: `h-5 w-5 flex-shrink-0 ${currentView === link.href.replace('#', '') ? brandActiveColor : brandColor}`
                              })
                            }}
                            onClick={(e) => handleNavLinkClick(link.href.replace('#', '') as any, e)}
                            className={currentView === link.href.replace('#', '') ? 'font-medium bg-blue-50 dark:bg-blue-900/20' : ''}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-border/30 pt-4 mt-auto">
                      <SidebarLink
                        link={{
                          label: t('settings.title'),
                          href: "#settings",
                          icon: (
                            <Settings className={`h-5 w-5 flex-shrink-0 ${brandColor} transition-transform duration-200 group-hover:scale-110`} />
                          ),
                        }}
                      />
                    </div>
                  </SidebarBody>
                </Sidebar>
                <main className={cn(
                  "transition-all duration-300 h-[calc(100vh-3.5rem)]",
                  "p-4 pb-0 sm:p-4 sm:pb-0 px-2 sm:px-4", // 移除底部边距
                  sidebarCollapsed 
                    ? "ml-[60px] sm:ml-[60px]" 
                    : (i18n.language === 'en' ? "ml-[180px]" : "ml-[200px]"),
                  "sm:md:w-auto max-w-full",
                  "!ml-0 sm:!ml-[60px]", // Override margin for mobile devices
                  !sidebarCollapsed && "md:!ml-[180px] md:!ml-[200px]"
                )}>
                  <Routes>
                    <Route path="/" element={renderContent()} />
                    <Route path="/math-test" element={
                      <Suspense fallback={<div className="flex items-center justify-center h-full"><NineDotGridRandom /></div>}>
                        <MathTest />
                      </Suspense>
                    } />
                    <Route path="/examples/status-indicator" element={
                      <Suspense fallback={<div className="flex items-center justify-center h-full"><NineDotGridRandom /></div>}>
                        <StatusIndicatorShowcase />
                      </Suspense>
                    } />
                  </Routes>
                </main>
              </div>
            </div>
          </TooltipProvider>
        </PermissionProvider>
      </UserProfileProvider>
    </SettingsProvider>
  );
} 