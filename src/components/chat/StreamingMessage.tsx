import React, { memo, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { User, Brain } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface StreamingMessageProps {
  message: Message;
  onReply?: () => void;
}

/**
 * 专门优化的流式消息组件
 * 使用memo和useRef来最小化渲染
 */
const StreamingMessage: React.FC<StreamingMessageProps> = memo(({ message, onReply }) => {
  const contentRef = useRef(message.content);
  const prevContentRef = useRef('');

  // 只在DOM更新完成后更新ref，减少不必要的比较
  useEffect(() => {
    prevContentRef.current = contentRef.current;
    contentRef.current = message.content;
  });

  // 显式处理流式消息的渲染，避免不必要的DOM更新
  return (
    <div className="flex gap-3 mb-6 group transition-opacity px-2 py-1">
      {/* AI头像 */}
      <div className="flex flex-col items-center gap-1 pr-2 sm:pr-2 pr-1">
        <div className="ai-avatar-container">
          <div className="ai-avatar-ring" />
          <Avatar className={cn(
            'h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all shrink-0',
            'bg-gradient-to-br from-blue-600/20 via-indigo-500/30 to-blue-400/20 text-blue-600 dark:text-blue-400 border-2 border-blue-500/30',
            'flex items-center justify-center relative overflow-visible',
            'shadow-sm ai-avatar-inner'
          )}>
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 via-indigo-500/40 to-purple-500/30 animate-pulse opacity-100" />
              <div className="relative z-10 flex items-center justify-center">
                <Brain className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
            <div className="ai-status-indicator" />
          </Avatar>
        </div>
        <div className="text-xs text-center text-muted-foreground opacity-70">AI</div>
      </div>

      {/* 消息气泡 */}
      <div className="flex-1">
        <MessageBubble
          content={message.content}
          timestamp={message.timestamp}
          isUser={false}
          isTyping={true}
          isStreaming={true}
          onReply={onReply}
        />
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数，只有当消息内容有实质性变化时才重新渲染
  const prevContent = prevProps.message.content;
  const nextContent = nextProps.message.content;
  
  // 如果内容相同，不重新渲染
  if (prevContent === nextContent) return true;
  
  // 修复无限渲染句号的bug：
  // 1. 检查是否只是添加了句号
  if (nextContent.length > prevContent.length) {
    const addedPart = nextContent.slice(prevContent.length);
    // 如果只添加了句号或空格，我们仍然更新内容，但返回true以避免重新渲染
    if (/^[.。\s]+$/.test(addedPart)) {
      return true;
    }
  }
  
  // 如果内容发生了较大变化，则重新渲染
  const contentDiff = nextContent.length - prevContent.length;
  return contentDiff < 5; // 减小阈值，使更新更频繁但仍避免每个字符都重新渲染
});

export default StreamingMessage;
