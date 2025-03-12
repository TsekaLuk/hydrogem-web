import { useMemo, useRef, useEffect, memo } from 'react';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Message } from '@/types/chat';
import { MessageGroup } from './MessageGroup';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  onReply?: (content: string) => void;
  className?: string;
}

const ESTIMATED_ITEM_SIZE = 100;

// 使用 memo 包装 MessageGroup 组件以避免不必要的重新渲染
const MemoizedMessageGroup = memo(MessageGroup);

// 创建一个 memo 组件以避免在流式消息更新时对历史消息进行重绘
function MessageListInner({ messages, onReply, className }: MessageListProps) {
  const listRef = useRef<List>(null);
  
  // 在消息更新时滚动到底部
  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
  }, [messages]);
  
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

  // 使用 useMemo 包装 getItemSize 函数
  const getItemSize = useMemo(() => {
    return (index: number) => {
      const group = groupedMessages[index];
      return group.messages.length * ESTIMATED_ITEM_SIZE + 40; // 40px for date header
    };
  }, [groupedMessages]);

  // 使用 useMemo 缓存 itemRenderer
  const itemRenderer = useMemo(() => {
    return ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <MemoizedMessageGroup
        key={groupedMessages[index].date}
        date={groupedMessages[index].date}
        messages={groupedMessages[index].messages}
        onReply={onReply}
        style={{...style, width: '100%'}}
      />
    );
  }, [groupedMessages, onReply]);

  return (
    <div className={cn("h-full w-full", className)}>
      {groupedMessages.length > 0 ? (
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={listRef}
              height={height}
              width={width}
              itemCount={groupedMessages.length}
              itemSize={getItemSize}
              className="w-full"
              // 添加键以确保 List 在必要时才重新创建
              key={`message-list-${messages.length}`}
            >
              {itemRenderer}
            </List>
          )}
        </AutoSizer>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          没有消息记录
        </div>
      )}
    </div>
  );
}

// 导出使用 memo 包装的 MessageList
export const MessageList = memo(MessageListInner);