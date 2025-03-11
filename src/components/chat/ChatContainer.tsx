import { useEffect, useRef, useCallback } from 'react';
import { Message } from '@/types/chat';
import { MessageList } from './MessageList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatMessage } from './ChatMessage';

interface ChatContainerProps {
  messages: Message[];
  streamingMessage?: string;
  isLoading?: boolean;
  onReply?: (content: string) => void;
}

export function ChatContainer({ messages, streamingMessage, isLoading, onReply }: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, scrollToBottom]);

  const hasMessages = messages.length > 0 || streamingMessage;

  return (
    <div className="h-full flex-1 relative bg-background/10 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/30">
      <div className="flex flex-col h-full">
        <div className="w-full max-w-[98%] mx-auto py-4 flex-1">
          {!hasMessages && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center text-muted-foreground/70">
              <div className="mb-2 p-4 rounded-full bg-primary/5 border border-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary/50">
                  <path d="M12 20.5c4.142 0 7.5-3.134 7.5-7s-3.358-7-7.5-7c-4.142 0-7.5 3.134-7.5 7 0 1.941.846 3.698 2.214 4.99L6.5 20.5l3.5-2.5" />
                  <path d="M12 12v.01M8 12v.01M16 12v.01" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">开始新对话</h3>
              <p className="mt-2 max-w-xs text-sm">输入您的问题开始对话，或点击左侧新建会话按钮...</p>
            </div>
          )}
          
          <MessageList 
            messages={messages}
            onReply={onReply}
            className="w-full"
          />
          
          {streamingMessage && (
            <ChatMessage
              message={{
                id: 'streaming',
                role: 'assistant',
                content: streamingMessage,
                timestamp: new Date()
              }}
              isTyping={true}
            />
          )}
          
          {isLoading && !streamingMessage && (
            <div className="flex gap-3 p-4 animate-pulse">
              <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[60%]" />
                <Skeleton className="h-4 w-[40%]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>
    </div>
  );
}