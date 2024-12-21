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

  return (
    <SettingsProvider>
      <UserProfileProvider>
        <PermissionProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Navbar />
              <div className="flex-1 pt-14">
                <Sidebar onViewChange={setCurrentView} currentView={currentView} />
                <MainContent>
                  {currentView === 'chat' ? (
                    <div className="flex h-[calc(100vh-12rem)] bg-background rounded-xl overflow-hidden">
                      <ChatSidebar
                        sessions={sessions}
                        currentSessionId={currentSessionId}
                        onNewChat={createNewSession}
                        onSelectSession={switchSession}
                        onDeleteSession={deleteSession}
                      />
                      <div className="flex-1 flex flex-col border-l border-border">
                        <ChatHeader onClearChat={clearChat} />
                        <ChatContainer 
                          messages={messages} 
                          streamingMessage={streamingMessage}
                          isLoading={isLoading}
                          onReply={handleReply}
                        />
                        {error && <div className="p-2 text-sm text-destructive text-center">{error}</div>}
                        <div className="p-4 border-t border-border bg-background">
                          <ChatInput onSend={sendMessage} isLoading={isLoading} />
                        </div>
                      </div>
                    </div>
                  ) : currentView === 'monitoring' ? (
                    <MonitoringDashboard />
                  ) : currentView === 'analytics' ? (
                    <AnalyticsDashboard />
                  ) : (
                    <HelpCenter />
                  )}
                </MainContent>
              </div>
            </div>
          </TooltipProvider>
        </PermissionProvider>
      </UserProfileProvider>
    </SettingsProvider>
  );
} 