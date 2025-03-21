import { useEffect, useRef, memo, useState } from 'react';
import { Message } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import StreamingMessage from './StreamingMessage';

interface ChatContainerProps {
  messages: Message[];
  streamingMessage?: string;
  isLoading?: boolean;
  onSendMessage?: (content: string) => void;
  onReply?: () => void;
  modelName?: string;
  className?: string;
}

// 使用 memo 优化历史消息
const MemoizedChatMessage = memo(ChatMessage);

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

const ChatContainer: React.FC<ChatContainerProps> = memo(({
  messages,
  streamingMessage,
  isLoading,
  onReply,
  modelName,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;
  const hasStreamingContent = !!streamingMessage;
  const prevMessagesLengthRef = useRef<number>(messages.length);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  
  // 过滤掉用于演示的重复模拟消息
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  
  const { t } = useTranslation();
  
  useEffect(() => {
    // 如果消息数量减少（例如清除聊天），重置所有状态
    if (messages.length < prevMessagesLengthRef.current) {
      setFilteredMessages(messages);
      prevMessagesLengthRef.current = messages.length;
      return;
    }
    
    prevMessagesLengthRef.current = messages.length;
    
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
  
  // 监听容器滚动事件
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!container) return;
      
      // 判断是否接近底部（在底部20px范围内）
      const isNearBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 20;
      
      setIsAutoScrollEnabled(isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 改进的自动滚动逻辑
  useEffect(() => {
    if (!containerRef.current || !isAutoScrollEnabled) return;

    // 使用requestAnimationFrame确保在浏览器绘制后再滚动
    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    };

    // 延迟滚动，确保内容已经渲染
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(scrollToBottom);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [filteredMessages, streamingMessage, isAutoScrollEnabled]);
  
  // 确保新消息时总是滚动到底部
  useEffect(() => {
    if (filteredMessages.length > prevMessagesLengthRef.current || hasStreamingContent) {
      setIsAutoScrollEnabled(true);
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    }
  }, [filteredMessages.length, hasStreamingContent]);

  // 处理重新生成响应
  const handleRegenerateResponse = onReply 
    ? () => {
        // 当用户点击重新生成按钮时，直接调用重新生成函数
        if (onReply) {
          onReply();
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
      className={cn(
        "flex-1 flex flex-col overflow-hidden",
        className
      )}
    >
      <div 
        className={cn(
          "flex-1 p-2 sm:p-4 pr-2 sm:pr-3 space-y-2 sm:space-y-4 h-full overflow-y-auto hydrogem-scroll-container overscroll-contain",
          "min-h-[100px] relative"
        )}
      >
        {/* 历史消息容器 */}
        <div className="space-y-2 sm:space-y-4 flex-1">
          {filteredMessages.map((message, index) => (
            <MemoizedChatMessage
              key={message.id || index}
              message={message}
              onReply={handleRegenerateResponse}
            />
          ))}
          
          {/* 流式消息放在历史消息列表中 */}
          {streamingMessageObj && (
            <StreamingMessage 
              message={streamingMessageObj} 
              onReply={handleRegenerateResponse} 
            />
          )}
        </div>
        
        {/* 加载状态 */}
        {isLoading && !streamingMessage && <LoadingIndicator />}
        
        {/* 当没有消息时显示欢迎信息 */}
        {filteredMessages.length === 0 && !streamingMessage && (
          <div className="flex items-center justify-center h-full text-center p-4">
            <div className="max-w-md">
              <h3 className="text-lg font-medium text-foreground mb-2">{t('chat.welcomeTitle')}</h3>
              <p className="text-muted-foreground">{t('chat.welcomeMessage')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ChatContainer;