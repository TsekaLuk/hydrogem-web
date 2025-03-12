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
          'p-4 max-w-[85%] sm:max-w-[75%] md:max-w-[65%] transition-all message-bubble',
          'animate-in slide-in-from-bottom-2 duration-300',
          'hover:shadow-lg',
          isUser 
            ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/20 dark:from-cyan-500/20 dark:to-blue-500/30 ml-auto rounded-2xl rounded-tr-sm border border-cyan-500/20 user-bubble' 
            : 'bg-gradient-to-br from-blue-500/5 to-indigo-500/10 dark:from-blue-500/10 dark:to-indigo-500/20 mr-auto rounded-2xl rounded-tl-sm border border-blue-500/15 ai-bubble',
          isTyping && 'animate-pulse',
          className
        )}
      >
        <MessageContent content={content} />
        
        <div className="absolute top-1 right-1 z-10">
          <MessageActions 
            content={content} 
            onReply={!isUser ? onReply : undefined} 
          />
        </div>
        
        {isTyping && <TypingIndicator />}
        
        <time className={cn(
          'text-[10px] sm:text-xs text-muted-foreground/70 mt-2 block',
          isUser ? 'text-right' : 'text-left',
          'opacity-70 group-hover:opacity-100 transition-opacity duration-200'
        )}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </Card>
    );
  }
);

MessageBubble.displayName = 'MessageBubble';