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
          'p-3 max-w-[85%] sm:max-w-[75%] md:max-w-[65%] transition-all message-bubble',
          'animate-in slide-in-from-bottom-2 duration-200',
          'hover:shadow-md',
          isUser 
            ? 'bg-primary/10 dark:bg-primary/20 ml-auto rounded-2xl rounded-tr-sm' 
            : 'bg-card dark:bg-card/90 mr-auto rounded-2xl rounded-tl-sm border border-border/30',
          isTyping && 'animate-pulse',
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
          'text-[10px] sm:text-xs text-muted-foreground/60 mt-1 block text-right',
          'opacity-50 group-hover:opacity-100 transition-opacity duration-200'
        )}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </Card>
    );
  }
);