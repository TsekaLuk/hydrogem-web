import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, ChatState } from '@/types/chat';
import { CHAT_CONFIG, createInitialMessage } from '@/lib/constants';
import { getLLMService } from '@/services/llm/llm-service-factory';
import { LLMMessage } from '@/types/llm';
import { formatErrorForUser } from '@/lib/error-handler';

const initialState: ChatState = {
  sessions: [],
  currentSessionId: null,
  messages: [createInitialMessage()],
  isLoading: false,
  error: null,
  streamingMessage: '',
};

// 使用 requestAnimationFrame 批量处理更新，比 setTimeout 更高效
function useBatchedUpdates<T>(callback: (value: T) => void, initialValue: T) {
  const valueRef = useRef<T>(initialValue);
  const frameIdRef = useRef<number | null>(null);
  const isScheduledRef = useRef<boolean>(false);

  // 累积变更但不立即更新状态
  const update = useCallback((newValue: T) => {
    valueRef.current = newValue;
    
    // 如果还没有计划更新，安排一个
    if (!isScheduledRef.current) {
      isScheduledRef.current = true;
      
      // 使用 requestAnimationFrame 以适应浏览器的渲染周期
      frameIdRef.current = requestAnimationFrame(() => {
        callback(valueRef.current);
        isScheduledRef.current = false;
        frameIdRef.current = null;
      });
    }
  }, [callback]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        
        // 确保最后的值被更新
        callback(valueRef.current);
      }
    };
  }, [callback]);

  return update;
}

export function useChat() {
  const [state, setState] = useState<ChatState>(initialState);
  const pendingTokensRef = useRef('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const llmService = getLLMService();

  // 使用批处理更新流式消息
  const updateStreamingMessage = useBatchedUpdates((tokens: string) => {
    setState(prev => {
      // 确保即使是第一个字符也能立即显示
      const updatedStreamingMessage = prev.streamingMessage + tokens;
      return {
        ...prev,
        streamingMessage: updatedStreamingMessage,
      };
    });
  }, '');

  // 清理函数 - 组件卸载或会话切换时中止请求
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const createNewSession = useCallback(() => {
    const newSession = {
      id: crypto.randomUUID(),
      title: CHAT_CONFIG.DEFAULT_SESSION_TITLE,
      lastMessage: '',
      timestamp: new Date(),
      messages: [createInitialMessage()],
    };

    setState(prev => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
      currentSessionId: newSession.id,
      messages: [createInitialMessage()],
      streamingMessage: '',
      error: null,
    }));
  }, []);

  const switchSession = useCallback((sessionId: string) => {
    // 中止当前正在进行的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    const session = state.sessions.find(s => s.id === sessionId);
    if (!session) return;

    setState(prev => ({
      ...prev,
      currentSessionId: sessionId,
      messages: session.messages,
      streamingMessage: '',
      isLoading: false,
      error: null,
    }));
    // 清空待处理的token
    pendingTokensRef.current = '';
  }, [state.sessions]);

  // 将应用消息转换为LLM消息格式
  const convertToLLMMessages = (messages: Message[]): LLMMessage[] => {
    return messages
      .filter(msg => msg.role !== 'system') // 系统消息由服务自动添加
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
  };

  const sendMessage = async (content: string) => {
    // 如果当前没有活动会话，先创建一个新会话
    if (!state.currentSessionId) {
      const newSession = {
        id: crypto.randomUUID(),
        title: generateSessionTitle(content),
        lastMessage: content,
        timestamp: new Date(),
        messages: [createInitialMessage()],
      };

      setState(prev => ({
        ...prev,
        sessions: [newSession, ...prev.sessions],
        currentSessionId: newSession.id,
        messages: [createInitialMessage()],
        streamingMessage: '',
        error: null,
      }));
    }

    // 创建用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // 更新状态
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      sessions: prev.sessions.map(session => 
        session.id === prev.currentSessionId
          ? {
              ...session,
              messages: [...session.messages, userMessage],
              lastMessage: userMessage.content,
              timestamp: new Date(),
              title: session.messages.length === 1 ? generateSessionTitle(userMessage.content) : session.title,
            }
          : session
      ),
      isLoading: true,
      error: null,
    }));

    try {
      // 中止之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // 创建新的AbortController
      abortControllerRef.current = new AbortController();
      
      // 准备所有消息
      const messages = [...state.messages, userMessage];
      const llmMessages = convertToLLMMessages(messages);
      
      // 清空流式消息和待处理的token
      setState(prev => ({
        ...prev,
        streamingMessage: '',
      }));
      pendingTokensRef.current = '';
      
      // 流式发送消息
      await llmService.sendMessageStream(
        llmMessages,
        {
          onToken: (token) => {
            // 使用批量更新策略，减少重渲染
            pendingTokensRef.current += token;
            updateStreamingMessage(pendingTokensRef.current);
            pendingTokensRef.current = '';
          },
          onComplete: (fullText) => {
            const assistantMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: fullText,
              timestamp: new Date(),
            };

            setState((prev) => ({
              ...prev,
              messages: [...prev.messages, assistantMessage],
              streamingMessage: '',
              isLoading: false,
              sessions: prev.sessions.map(session =>
                session.id === prev.currentSessionId
                  ? {
                      ...session,
                      messages: [...session.messages, assistantMessage],
                      lastMessage: assistantMessage.content,
                      timestamp: new Date(),
                    }
                  : session
              ),
            }));
          },
          onError: (error) => {
            setState(prev => ({
              ...prev,
              error: formatErrorForUser(error),
              isLoading: false,
              streamingMessage: '',
            }));
          }
        },
        { signal: abortControllerRef.current.signal }
      );
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: formatErrorForUser(error),
        isLoading: false,
        streamingMessage: '',
      }));
    }
  };

  // 重新生成最后一条AI回复
  const regenerateResponse = async () => {
    // 如果还在流式输出中，先清除它
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // 确保有消息可以重新生成
    if (state.messages.length <= 1) {
      return;
    }

    // 找到最后一条用户消息
    const lastUserMessageIndex = [...state.messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserMessageIndex === -1) {
      return;
    }

    // 获取真实索引（从后往前数）
    const userMessageIndex = state.messages.length - 1 - lastUserMessageIndex;
    
    // 移除最后一条AI回复（如果有的话）
    const messagesWithoutLastAIReply = state.messages.filter((_, index) => index <= userMessageIndex);

    setState(prev => ({
      ...prev,
      messages: messagesWithoutLastAIReply,
      isLoading: true,
      streamingMessage: '',
      error: null,
    }));
    pendingTokensRef.current = '';

    try {
      // 创建新的AbortController
      abortControllerRef.current = new AbortController();
      
      // 准备消息
      const llmMessages = convertToLLMMessages(messagesWithoutLastAIReply);
      
      // 流式发送消息
      await llmService.sendMessageStream(
        llmMessages,
        {
          onToken: (token) => {
            // 使用批量更新策略，减少重渲染
            pendingTokensRef.current += token;
            updateStreamingMessage(pendingTokensRef.current);
            pendingTokensRef.current = '';
          },
          onComplete: (fullText) => {
            const newAssistantMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: fullText,
              timestamp: new Date(),
            };

            setState((prev) => ({
              ...prev,
              messages: [...prev.messages, newAssistantMessage],
              streamingMessage: '',
              isLoading: false,
              sessions: prev.sessions.map(session =>
                session.id === prev.currentSessionId
                  ? {
                      ...session,
                      messages: [...messagesWithoutLastAIReply, newAssistantMessage],
                      lastMessage: newAssistantMessage.content,
                      timestamp: new Date(),
                    }
                  : session
              ),
            }));
          },
          onError: (error) => {
            setState(prev => ({
              ...prev,
              error: formatErrorForUser(error),
              isLoading: false,
              streamingMessage: '',
            }));
          }
        },
        { signal: abortControllerRef.current.signal }
      );
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: formatErrorForUser(error),
        isLoading: false,
        streamingMessage: '',
      }));
    }
  };

  const clearChat = () => {
    // 中止当前请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setState(prev => ({
      ...prev,
      messages: [createInitialMessage()],
      isLoading: false,
      streamingMessage: '',
      error: null,
      sessions: prev.sessions.map(session =>
        session.id === prev.currentSessionId
          ? {
              ...session,
              messages: [createInitialMessage()],
            }
          : session
      ),
    }));
  };

  const deleteSession = useCallback((sessionId: string) => {
    if (state.currentSessionId === sessionId && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setState(prev => {
      const newSessions = prev.sessions.filter(s => s.id !== sessionId);
      const newCurrentId = prev.currentSessionId === sessionId
        ? newSessions[0]?.id || null
        : prev.currentSessionId;

      return {
        ...prev,
        sessions: newSessions,
        currentSessionId: newCurrentId,
        messages: newCurrentId 
          ? newSessions.find(s => s.id === newCurrentId)?.messages || []
          : [createInitialMessage()],
        streamingMessage: prev.currentSessionId === sessionId ? '' : prev.streamingMessage,
        isLoading: prev.currentSessionId === sessionId ? false : prev.isLoading,
      };
    });
    // 如果删除的是当前会话，清空待处理的token
    if (state.currentSessionId === sessionId) {
      pendingTokensRef.current = '';
    }
  }, [state.currentSessionId]);

  // 优化生成会话标题的函数
  function generateSessionTitle(message: string): string {
    // 移除换行符和多余空格
    const cleanMessage = message.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    // 如果消息很短，直接使用
    if (cleanMessage.length <= 30) {
      return cleanMessage;
    }
    // 尝试提取第一句话
    const firstSentence = cleanMessage.split(/[.。!！?？]/, 1)[0];
    if (firstSentence.length <= 30) {
      return firstSentence;
    }
    // 如果第一句话太长，截取前30个字符
    return firstSentence.slice(0, 30) + '...';
  }

  return {
    ...state,
    sendMessage,
    clearChat,
    createNewSession,
    switchSession,
    deleteSession,
    regenerateResponse,
  };
}