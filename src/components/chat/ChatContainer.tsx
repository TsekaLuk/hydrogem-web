import { useEffect, useRef, memo, useState } from 'react';
import { Message } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { cn } from '@/lib/utils';

interface ChatContainerProps {
  messages: Message[];
  streamingMessage?: string;
  isLoading?: boolean;
  onSendMessage?: (content: string) => void;
  onReply?: (content: string) => void;
}

// 使用 memo 优化历史消息
const MemoizedChatMessage = memo(ChatMessage);

// 流式消息组件
const StreamingMessageComponent = memo(({ message, onReply }: { 
  message: Message, 
  onReply?: () => void 
}) => {
  return (
    <ChatMessage
      key="streaming"
      message={message}
      isTyping={true}
      isStreaming={true}
      onReply={onReply}
    />
  );
});

// 加载指示器
const LoadingIndicator = () => (
  <div className="flex justify-center py-4">
    <div className="loading-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
);

// 空白状态组件
const EmptyMessageView = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-4">
    <div className="text-xl font-semibold">开始对话</div>
    <p className="text-muted-foreground max-w-md">
      通过发送消息开始您与玑衡的对话。您可以询问任何问题或请求帮助。
    </p>
  </div>
);

export function ChatContainer({
  messages,
  streamingMessage,
  isLoading,
  onReply
}: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;
  const hasStreamingContent = !!streamingMessage;
  
  // 过滤掉用于演示的重复模拟消息
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    // 过滤掉包含模拟消息内容的消息
    const mockupPhrases = [
      "This is a simulated",
      "模拟消息",
      "模拟回复",
      "这是模拟"
    ];
    
    const uniqueMessages = messages.filter(msg => {
      // 检查是否包含模拟内容
      const containsMockup = mockupPhrases.some(phrase => 
        msg.content.includes(phrase)
      );
      
      // 如果正在流式传输类似内容，则过滤掉历史消息中的模拟内容
      return !(containsMockup && hasStreamingContent);
    });
    
    setFilteredMessages(uniqueMessages);
  }, [messages, hasStreamingContent]);
  
  // 自动滚动到底部
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [filteredMessages, streamingMessage]);

  // 处理回复，包装一下参数
  const handleReply = onReply 
    ? () => {
        // 当用户点击回复按钮时，这个闭包已经有了消息内容
        if (onReply && filteredMessages.length > 0) {
          const lastAiMessage = [...filteredMessages].reverse().find(m => m.role === 'assistant');
          if (lastAiMessage) {
            onReply(lastAiMessage.content);
          }
        }
      }
    : undefined;

  // 模拟空白状态
  if (!hasMessages && !hasStreamingContent && !isLoading) {
    return <EmptyMessageView />;
  }

  // 创建流式消息的 Message 对象
  const streamingMessageObj = streamingMessage 
    ? {
        id: 'streaming',
        role: 'assistant' as const,
        content: streamingMessage,
        timestamp: new Date()
      }
    : undefined;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
    >
      {/* 历史消息容器 */}
      <div className="history-message-container">
        {filteredMessages.map((message) => (
          <MemoizedChatMessage
            key={message.id}
            message={message}
            onReply={handleReply}
            isStreaming={false}
          />
        ))}
      </div>

      {/* 流式消息容器 */}
      {streamingMessageObj && (
        <div className="streaming-message-container">
          <StreamingMessageComponent 
            message={streamingMessageObj} 
            onReply={handleReply} 
          />
        </div>
      )}

      {/* 加载状态 */}
      {isLoading && !streamingMessage && <LoadingIndicator />}
    </div>
  );
}