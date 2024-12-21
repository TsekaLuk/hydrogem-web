import { Message } from '@/types/chat';
import { User, Sparkles } from 'lucide-react';
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
      'flex gap-3 sm:gap-5 mb-6 sm:mb-8 group transition-opacity px-2 sm:px-4',
      isUser && 'flex-row-reverse',
      'animate-in fade-in duration-200'
    )}>
      <Avatar className={cn(
        'h-8 w-8 sm:h-10 sm:w-10 ring-2 transition-all shrink-0 overflow-visible',
        isUser ? 'bg-sky-500/10 ring-sky-500/20' : 'bg-cyan-500/10 ring-cyan-500/20',
        'group-hover:ring-4 group-hover:scale-105 flex items-center justify-center'
      )}>
        {isUser ? 
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" /> : 
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600" />
        }
      </Avatar>
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