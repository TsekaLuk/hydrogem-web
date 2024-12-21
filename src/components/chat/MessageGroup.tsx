import { Message } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { cn } from '@/lib/utils';

interface MessageGroupProps {
  date: string;
  messages: Message[];
  onReply?: (content: string) => void;
  style?: React.CSSProperties;
}

export function MessageGroup({ date, messages, onReply, style }: MessageGroupProps) {
  return (
    <div style={style} className="py-2">
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground bg-background/95 px-2 py-1 rounded-full">
          {date}
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onReply={() => onReply?.(message.content)}
          />
        ))}
      </div>
    </div>
  );
}