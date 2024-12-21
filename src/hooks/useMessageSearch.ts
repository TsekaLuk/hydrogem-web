import { useState, useCallback, useMemo } from 'react';
import { Message } from '@/types/chat';

export function useMessageSearch(messages: Message[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;

    const query = searchQuery.toLowerCase();
    return messages.filter((message) =>
      message.content.toLowerCase().includes(query) ||
      message.role.toLowerCase().includes(query)
    );
  }, [messages, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    filteredMessages,
    handleSearch,
  };
}