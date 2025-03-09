import { useChat } from '@/hooks/useChat';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { MainContent } from '@/components/layout/MainContent';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { PermissionProvider } from '@/contexts/PermissionContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';
import { MonitoringDashboard } from '@/components/monitoring/MonitoringDashboard';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { HelpCenter } from '@/components/help/HelpCenter';
import { useTranslation } from 'react-i18next';

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
  const { i18n } = useTranslation();

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

  const renderContent = () => {
    switch (currentView) {
      case 'chat':
        return (
          <div className="flex justify-center mx-auto h-full">
            <div className="flex h-[calc(100vh-12rem)] bg-background/50 rounded-xl overflow-hidden w-full max-w-[900px] shadow-md backdrop-blur-sm border border-border/20">
              <ChatSidebar
                sessions={sessions}
                currentSessionId={currentSessionId}
                onNewChat={createNewSession}
                onSelectSession={switchSession}
                onDeleteSession={deleteSession}
              />
              <div className="flex-1 flex flex-col border-l border-border/40 overflow-hidden">
                <ChatHeader onClearChat={clearChat} />
                <ChatContainer 
                  messages={messages} 
                  streamingMessage={streamingMessage}
                  isLoading={isLoading}
                  onReply={handleReply}
                />
                {error && <div className="p-2 text-sm text-destructive text-center">{error}</div>}
                <div className="p-2 border-t border-border/20 bg-background/80 backdrop-blur-md">
                  <ChatInput onSend={sendMessage} isLoading={isLoading} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'monitoring':
        return <div className="container mx-auto px-4"><MonitoringDashboard /></div>;
      case 'analytics':
        return <div className="container mx-auto px-4"><AnalyticsDashboard /></div>;
      case 'help':
        return <div className="container mx-auto px-4"><HelpCenter /></div>;
      default:
        return null;
    }
  };

  return (
    <SettingsProvider>
      <UserProfileProvider>
        <PermissionProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background flex flex-col overflow-hidden">
              <Navbar />
              <div className="flex-1 pt-14 w-full h-[calc(100vh-3.5rem)] overflow-hidden">
                <Sidebar 
                  onViewChange={setCurrentView} 
                  currentView={currentView} 
                  onToggleCollapse={handleSidebarToggle}
                />
                <MainContent sidebarCollapsed={sidebarCollapsed}>
                  {renderContent()}
                </MainContent>
              </div>
            </div>
          </TooltipProvider>
        </PermissionProvider>
      </UserProfileProvider>
    </SettingsProvider>
  );
} 