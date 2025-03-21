/**
 * LLM服务相关类型定义
 */

export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMChatOptions {
  model: string;
  messages: LLMMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  stop?: string[];
}

export interface LLMChatRequestOptions {
  signal?: AbortSignal;
}

export interface LLMStreamResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      content?: string;
    };
    finish_reason: string | null;
  }>;
}

export interface LLMCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string | null;
    index: number;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface LLMService {
  /**
   * 发送消息到LLM服务并获取完整响应
   */
  sendMessage(messages: LLMMessage[], options?: LLMChatRequestOptions): Promise<string>;
  
  /**
   * 发送消息到LLM服务并获取流式响应
   */
  sendMessageStream(
    messages: LLMMessage[], 
    callbacks: {
      onStart?: () => void;
      onToken: (token: string) => void;
      onComplete?: (fullText: string) => void;
      onError?: (error: Error) => void;
    },
    options?: LLMChatRequestOptions
  ): Promise<void>;
} 