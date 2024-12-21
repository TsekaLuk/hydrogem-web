import { useMemo, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Message } from '@/types/chat';
import { MessageGroup } from './MessageGroup';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  onReply?: (content: string) => void;
  className?: string;
}

const ESTIMATED_ITEM_SIZE = 100;

export function MessageList({ messages, onReply, className }: MessageListProps) {
  const listRef = useRef<List>(null);
  
  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    let currentGroup: Message[] = [];

    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp).toLocaleDateString();
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  }, [messages]);

  const getItemSize = (index: number) => {
    const group = groupedMessages[index];
    return group.messages.length * ESTIMATED_ITEM_SIZE + 40; // 40px for date header
  };

  return (
    <div className={cn("h-full w-full overflow-hidden", className)}>
      <List
        ref={listRef}
        height={600} // This will be overridden by CSS
        width="100%"
        itemCount={groupedMessages.length}
        itemSize={getItemSize}
        className="scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-transparent
          scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30"
      >
        {({ index, style }) => (
          <MessageGroup
            key={groupedMessages[index].date}
            date={groupedMessages[index].date}
            messages={groupedMessages[index].messages}
            onReply={onReply}
            style={style}
          />
        )}
      </List>
    </div>
  );
}