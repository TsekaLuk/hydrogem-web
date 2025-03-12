import { Message } from '@/types/chat';
import { User, Sparkles, Brain, CircuitBoard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { MessageBubble } from './MessageBubble';
import { motion } from 'framer-motion';
import { useState, useEffect, memo, useRef } from 'react';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
  isStreaming?: boolean;
  onReply?: () => void;
}

// 使用 memo 包装 MessageBubble 组件
const MemoizedMessageBubble = memo(MessageBubble);

function ChatMessageComponent({ message, isTyping, isStreaming = false, onReply }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Trigger animation when typing starts
  useEffect(() => {
    if (isTyping && !isUser) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isTyping, isUser]);

  // 消息使用的CSS类
  const messageClass = cn(
    'flex gap-3 mb-6 group transition-opacity px-2 py-1',
    isUser ? 'flex-row-reverse' : 'flex-row',
  );

  // 创建一个包裹组件，根据是否是流式消息使用不同的容器
  const MessageWrapper = isStreaming ? motion.div : 'div';
  const motionProps = isStreaming ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <MessageWrapper 
      className={messageClass}
      {...motionProps}
    >
      <div className={cn(
        'flex flex-col items-center gap-1',
        isUser ? 'pl-2' : 'pr-2'
      )}>
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={!isUser ? 'ai-avatar-container' : ''}
        >
          {!isUser && <div className="ai-avatar-ring" />}
          
          <Avatar className={cn(
            'h-10 w-10 rounded-full transition-all shrink-0',
            isUser 
              ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/30 text-cyan-600 dark:text-cyan-400 border-2 border-cyan-500/30' 
              : 'bg-gradient-to-br from-blue-600/20 via-indigo-500/30 to-blue-400/20 text-blue-600 dark:text-blue-400 border-2 border-blue-500/30',
            'flex items-center justify-center relative overflow-visible',
            isUser ? 'shadow-md' : 'shadow-sm',
            !isUser && 'ai-avatar-inner'
          )}>
            {isUser ? (
              <User className="h-5 w-5" />
            ) : (
              <div className="relative flex items-center justify-center">
                <div className={cn(
                  "absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 via-indigo-500/40 to-purple-500/30",
                  "animate-pulse opacity-0",
                  (isHovered || isAnimating) && "opacity-100"
                )} />
                <div className="relative z-10 flex items-center justify-center">
                  <Brain className={cn(
                    "h-5 w-5 text-blue-500 dark:text-blue-400 absolute",
                    "transition-all duration-300",
                    isHovered ? "opacity-0 scale-0" : "opacity-100 scale-100"
                  )} />
                  <Sparkles className={cn(
                    "h-5 w-5 text-indigo-500 dark:text-indigo-400 absolute",
                    "transition-all duration-300",
                    isHovered ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  )} />
                </div>
              </div>
            )}
            
            {!isUser && isAnimating && (
              <div className="ai-status-indicator" />
            )}
          </Avatar>
        </div>
        <div className={cn(
          "text-[10px] font-medium px-2 py-0.5 rounded-full",
          isUser 
            ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400" 
            : "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-400"
        )}>
          {isUser ? '我' : '玑衡'}
        </div>
      </div>
      
      <MemoizedMessageBubble
        content={message.content}
        timestamp={new Date(message.timestamp)}
        isUser={isUser}
        isTyping={isTyping}
        isStreaming={isStreaming}
        onReply={onReply}
      />
    </MessageWrapper>
  );
}

// 导出使用 memo 包装的 ChatMessage
export const ChatMessage = memo(ChatMessageComponent);