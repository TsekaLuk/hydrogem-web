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
};

export const CHAT_CONFIG: ChatConfig = {
  MAX_TOKENS: 4096,
  MODEL: 'gpt-4',
  TEMPERATURE: 0.7,
  INITIAL_MESSAGE: {
    role: 'assistant',
    content: '',
    id: 'welcome',
    timestamp: new Date(),
  },
  TYPING_INDICATOR_DELAY: 300,
  MAX_RETRY_ATTEMPTS: 3,
};

export function updateInitialMessage(content: string) {
  CHAT_CONFIG.INITIAL_MESSAGE.content = content;
}