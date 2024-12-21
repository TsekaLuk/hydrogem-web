import { useState, useCallback } from 'react';
import { Message, ChatState } from '@/types/chat';
import { CHAT_CONFIG } from '@/lib/constants';

const initialState: ChatState = {
  sessions: [],
  currentSessionId: null,
  messages: [CHAT_CONFIG.INITIAL_MESSAGE],
  isLoading: false,
  error: null,
  streamingMessage: '',
};

export function useChat() {
  const [state, setState] = useState<ChatState>(initialState);

  const createNewSession = useCallback(() => {
    const newSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      lastMessage: '',
      timestamp: new Date(),
      messages: [CHAT_CONFIG.INITIAL_MESSAGE],
    };

    setState(prev => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
      currentSessionId: newSession.id,
      messages: [CHAT_CONFIG.INITIAL_MESSAGE],
      streamingMessage: '',
      error: null,
    }));
  }, []);

  const switchSession = useCallback((sessionId: string) => {
    const session = state.sessions.find(s => s.id === sessionId);
    if (!session) return;

    setState(prev => ({
      ...prev,
      currentSessionId: sessionId,
      messages: session.messages,
      streamingMessage: '',
      error: null,
    }));
  }, [state.sessions]);

  const simulateStreamingResponse = (response: string) => {
    const words = response.split(' ');
    let currentIndex = 0;

    const streamInterval = setInterval(() => {
      if (currentIndex >= words.length) {
        clearInterval(streamInterval);
        setState(prev => ({
          ...prev,
          streamingMessage: '',
          isLoading: false,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        streamingMessage: prev.streamingMessage + ' ' + words[currentIndex],
      }));
      currentIndex++;
    }, CHAT_CONFIG.TYPING_INDICATOR_DELAY);
  };

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Update current session and messages
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
      // Simulate AI response with streaming
      const response = 'This is a simulated streaming response. In a real application, this would be connected to an AI API with proper streaming capabilities.';
      
      simulateStreamingResponse(response);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
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
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to send message. Please try again.',
        isLoading: false,
      }));
    }
  };

  const clearChat = () => {
    setState(initialState);
  };

  const deleteSession = useCallback((sessionId: string) => {
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
          : [CHAT_CONFIG.INITIAL_MESSAGE],
      };
    });
  }, []);

  function generateSessionTitle(message: string): string {
    return message.slice(0, 30) + (message.length > 30 ? '...' : '');
  }

  return {
    ...state,
    sendMessage,
    clearChat,
    createNewSession,
    switchSession,
    deleteSession,
  };
}