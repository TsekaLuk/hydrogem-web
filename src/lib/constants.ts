type ChatConfig = {
  readonly MAX_TOKENS: number;
  readonly MODEL: string;
  readonly TEMPERATURE: number;
  INITIAL_MESSAGE: {
    readonly role: 'assistant';
    content: string;
    readonly id: string;
    readonly timestamp: Date;
  };
  readonly TYPING_INDICATOR_DELAY: number;
  readonly MAX_RETRY_ATTEMPTS: number;
  readonly DEFAULT_SESSION_TITLE: string;
};

export const CHAT_CONFIG: ChatConfig = {
  MAX_TOKENS: 4096,
  MODEL: 'gpt-4',
  TEMPERATURE: 0.7,
  INITIAL_MESSAGE: {
    role: 'assistant',
    content: '欢迎使用玑衡智能助手，我是您的水资源管理与水质监测专家。您可以向我询问任何水资源相关问题，或者分享水质监测数据让我进行分析。有什么我可以帮您解答的吗？',
    id: 'welcome',
    timestamp: new Date(),
  },
  TYPING_INDICATOR_DELAY: 300,
  MAX_RETRY_ATTEMPTS: 3,
  DEFAULT_SESSION_TITLE: '新的对话',
};

export function createInitialMessage(content?: string): ChatConfig['INITIAL_MESSAGE'] {
  return {
    role: 'assistant',
    content: content || CHAT_CONFIG.INITIAL_MESSAGE.content,
    id: 'welcome',
    timestamp: new Date(),
  };
}

export function updateInitialMessage(content: string) {
  CHAT_CONFIG.INITIAL_MESSAGE.content = content;
}