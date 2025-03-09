import { Message } from '@/types/chat';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { MessageBubble } from './MessageBubble';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
  onReply?: () => void;
}

export function ChatMessage({ message, isTyping, onReply }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      'flex gap-3 mb-4 group transition-opacity px-2 py-1',
      isUser ? 'flex-row-reverse' : 'flex-row',
      'animate-in fade-in-50 duration-100'
    )}>
      <div className={cn(
        'flex flex-col items-center gap-1',
        isUser ? 'pl-2' : 'pr-2'
      )}>
        <Avatar className={cn(
          'h-8 w-8 rounded-full transition-all shrink-0',
          isUser 
            ? 'bg-primary/15 text-primary border-2 border-primary/30' 
            : 'bg-blue-500/15 text-blue-600 border-2 border-blue-500/30',
          'flex items-center justify-center'
        )}>
          {isUser ? 
            <User className="h-4 w-4" /> : 
            <Bot className="h-4 w-4" />
          }
        </Avatar>
        <div className="text-[10px] text-muted-foreground font-medium">
          {isUser ? '我' : 'AI'}
        </div>
      </div>
      
      <MessageBubble
        content={message.content}
        timestamp={new Date(message.timestamp)}
        isUser={isUser}
        isTyping={isTyping}
        onReply={onReply}
      />
    </div>
  );
}