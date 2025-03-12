import { memo } from 'react';
import { Message } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { cn } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';

interface MessageGroupProps {
  date: string;
  messages: Message[];
  onReply?: (content: string) => void;
  style?: React.CSSProperties;
}

// 使用 memo 包装 ChatMessage 组件
const MemoizedChatMessage = memo(ChatMessage);

// 在这个组件内部实现 MessageGroup 逻辑
function MessageGroupInner({ date, messages, onReply, style }: MessageGroupProps) {
  return (
    <div style={style} className="py-4 w-full">
      <div className="mb-4 flex justify-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/40 backdrop-blur-sm rounded-full border border-border/30 shadow-sm">
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground/70" />
          <span className="text-xs font-medium text-muted-foreground">
            {date}
          </span>
        </div>
      </div>
      <div className="space-y-6 w-full">
        {messages.map((message) => (
          <MemoizedChatMessage
            key={message.id}
            message={message}
            onReply={() => onReply?.(message.content)}
          />
        ))}
      </div>
    </div>
  );
}

// 导出使用 memo 包装的 MessageGroup
export const MessageGroup = memo(MessageGroupInner);