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

  return (
    <ScrollArea className="flex-1 p-2 sm:p-4 md:p-6 relative bg-background">
      <div className="h-full">
        <MessageList 
          messages={messages}
          onReply={onReply}
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
          <div className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}