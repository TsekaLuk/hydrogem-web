export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

export type ChatState = {
  sessions: ChatSession[];
  currentSessionId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  streamingMessage: string;
};