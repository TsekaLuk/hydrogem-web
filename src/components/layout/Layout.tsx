import { useChat } from '@/hooks/useChat';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { PermissionProvider } from '@/contexts/PermissionContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';
import { MonitoringDashboard } from '@/components/monitoring/MonitoringDashboard';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { HelpCenter } from '@/components/help/HelpCenter';
import { useTranslation } from 'react-i18next';
import { WaterQualityPanel } from '@/components/monitoring/WaterQualityPanel';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { LayoutDashboard, MessageSquare, BarChart, LifeBuoy, Settings, BarChart3, Droplet, LogOut } from 'lucide-react';
import { Logo, LogoIcon } from '@/components/ui/sidebar-demo';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 提取共用的滚动容器样式为一个常量
const scrollContainerClass = "h-[calc(100vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/30 pr-2";

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
  } = useChat();
  const [currentView, setCurrentView] = useState<'chat' | 'monitoring' | 'analytics' | 'help'>('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const handleLanguageChange = () => {
      console.log('Language changed event received');
      setCurrentView(prev => prev);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  useEffect(() => {
    console.log('App mounted');
    console.log('Current language:', i18n.language);
  }, [i18n]);

  useEffect(() => {
    console.log('Sidebar state:', sidebarCollapsed ? 'collapsed' : 'expanded');
  }, [sidebarCollapsed]);

  const handleReply = (content: string) => {
    const input = document.querySelector('textarea');
    if (input) {
      (input as HTMLTextAreaElement).value = `Regarding: "${content.slice(0, 50)}...":\n\n`;
      input.focus();
    }
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const refreshMonitoringData = () => {
    console.log('刷新监测数据');
    // 这里实际上应该调用API或重新获取数据
  };

  // 根据 HydroGem logo 添加的品牌颜色
  const brandColor = "text-blue-500";
  const brandActiveColor = "text-blue-600";

  // 导航链接
  const navLinks = [
    {
      label: "聊天",
      href: "#chat",
      icon: (
        <MessageSquare className="h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "监控",
      href: "#monitoring",
      icon: (
        <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "数据分析",
      href: "#analytics",
      icon: (
        <BarChart className="h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "帮助支持",
      href: "#help",
      icon: (
        <LifeBuoy className="h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const handleNavLinkClick = (view: 'chat' | 'monitoring' | 'analytics' | 'help', e: React.MouseEvent<HTMLAnchorElement>) => {
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
              <div className="flex-1 flex flex-col md:flex-row bg-background/50 rounded-xl overflow-hidden shadow-md backdrop-blur-sm border border-border/20">
                <ChatSidebar
                  sessions={sessions}
                  currentSessionId={currentSessionId}
                  onNewChat={createNewSession}
                  onSelectSession={switchSession}
                  onDeleteSession={deleteSession}
                />
                <div className="flex-1 flex flex-col border-l border-border/40 overflow-hidden">
                  <ChatHeader onClearChat={clearChat} />
                  <div className="flex-1 overflow-hidden">
                    <ChatContainer 
                      messages={messages} 
                      streamingMessage={streamingMessage}
                      isLoading={isLoading}
                      onReply={handleReply}
                    />
                  </div>
                  {error && <div className="p-2 text-sm text-destructive text-center">{error}</div>}
                  <div className="py-2 px-4 border-t border-border/20 bg-background/80 backdrop-blur-md">
                    <ChatInput onSend={sendMessage} isLoading={isLoading} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'monitoring':
        return (
          <div className="min-h-[calc(100vh-16rem)] max-h-[calc(100vh-6rem)] flex flex-col rounded-xl border border-border/20 bg-background/50 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="p-4 flex-grow h-full overflow-y-auto">
              <MonitoringDashboard />
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="min-h-[calc(100vh-16rem)] max-h-[calc(100vh-6rem)] flex flex-col rounded-xl border border-border/20 bg-background/50 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="p-4 flex-grow h-full overflow-y-auto">
              <AnalyticsDashboard />
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="h-[calc(100vh-16rem)] overflow-y-auto rounded-xl border border-border/20 bg-background/50 backdrop-blur-sm shadow-sm">
            <div className="p-4">
              <HelpCenter />
            </div>
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
              <div className="flex-1 pt-14 w-full h-[calc(100vh-3.5rem)]">
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
                          label: "设置",
                          href: "#settings",
                          icon: (
                            <Settings className={`h-5 w-5 flex-shrink-0 ${brandColor}`} />
                          ),
                        }}
                      />
                    </div>
                  </SidebarBody>
                </Sidebar>
                <main className={cn(
                  "transition-all duration-300 h-[calc(100vh-3.5rem)] p-4",
                  sidebarCollapsed ? "ml-[60px]" : "ml-[200px]",
                  "md:w-auto max-w-full"
                )}>
                  {renderContent()}
                </main>
              </div>
            </div>
          </TooltipProvider>
        </PermissionProvider>
      </UserProfileProvider>
    </SettingsProvider>
  );
} 