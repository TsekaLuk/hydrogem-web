import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { MessageContent } from './MessageContent';
import { MessageActions } from './MessageActions';
import { TypingIndicator } from './TypingIndicator';

interface MessageBubbleProps {
  content: string;
  timestamp: Date;
  isUser?: boolean;
  isTyping?: boolean;
  onReply?: () => void;
  className?: string;
}

export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ content, timestamp, isUser, isTyping, onReply, className }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'p-4 sm:p-5 max-w-[85%] sm:max-w-[80%] transition-all message-bubble',
          'animate-in slide-in-from-bottom-2 duration-200',
          'hover:shadow-lg hover:scale-[1.02]',
          isUser ? 'bg-sky-500/5 dark:bg-sky-500/10 ml-auto' : 'bg-cyan-500/5 dark:bg-cyan-500/10 mr-auto',
          'backdrop-blur-sm rounded-2xl',
          className
        )}
      >
        <MessageContent content={content} />
        
        <div className="absolute top-0 right-0 mt-1 mr-1 z-10">
          <MessageActions 
            content={content} 
            onReply={!isUser ? onReply : undefined} 
          />
        </div>
        
        {isTyping && <TypingIndicator />}
        
        <time className={cn(
          'text-[10px] sm:text-xs text-muted-foreground dark:text-white/50 mt-2 block',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
        )}>
          {timestamp.toLocaleTimeString()}
        </time>
      </Card>
    );
  }
);