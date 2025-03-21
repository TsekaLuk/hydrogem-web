/**
 * 硅基流动LLM服务实现
 */
import { LLMService, LLMMessage, LLMChatRequestOptions, LLMStreamResponse } from '@/types/llm';
import { SILICON_FLOW_CONFIG } from '@/lib/llm-config';

export class SiliconFlowService implements LLMService {
  private apiKey: string;
  private model: string;
  private baseUrl: string;
  private temperature: number;
  private maxTokens: number;
  private topP: number;
  private systemPrompt: string;

  constructor(config = SILICON_FLOW_CONFIG) {
    this.apiKey = config.API_KEY;
    this.model = config.MODEL;
    this.baseUrl = config.API_BASE_URL;
    this.temperature = config.TEMPERATURE;
    this.maxTokens = config.MAX_TOKENS;
    this.topP = config.TOP_P;
    this.systemPrompt = config.SYSTEM_PROMPT;
  }

  /**
   * 发送消息到硅基流动API并获取完整响应
   */
  public async sendMessage(messages: LLMMessage[], options?: LLMChatRequestOptions): Promise<string> {
    // 添加系统提示信息
    const messagesWithSystem = this.addSystemPrompt(messages);
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: messagesWithSystem,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        top_p: this.topP,
        stream: false
      }),
      signal: options?.signal
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`硅基流动API错误: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * 发送消息到硅基流动API并获取流式响应
   */
  public async sendMessageStream(
    messages: LLMMessage[],
    callbacks: {
      onStart?: () => void;
      onToken: (token: string) => void;
      onComplete?: (fullText: string) => void;
      onError?: (error: Error) => void;
    },
    options?: LLMChatRequestOptions
  ): Promise<void> {
    // 添加系统提示信息
    const messagesWithSystem = this.addSystemPrompt(messages);
    
    try {
      // 调用开始回调
      if (callbacks.onStart) {
        callbacks.onStart();
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messagesWithSystem,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
          top_p: this.topP,
          stream: true
        }),
        signal: options?.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`硅基流动API错误: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // 处理流式响应
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      let fullText = '';
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        // 解码二进制数据
        const chunk = decoder.decode(value, { stream: true });
        
        // 处理SSE数据
        const lines = chunk
          .split('\n')
          .filter(line => line.trim() !== '')
          .filter(line => line.trim() !== 'data: [DONE]');

        for (const line of lines) {
          // 提取SSE数据载荷
          const match = /data: (.+)/.exec(line);
          if (!match) continue;

          try {
            const data = JSON.parse(match[1]) as LLMStreamResponse;
            const content = data.choices[0]?.delta?.content;
            
            // 处理内容片段
            if (content) {
              callbacks.onToken(content);
              fullText += content;
            }
          } catch (e) {
            console.error('解析流数据失败:', line, e);
          }
        }
      }

      // 调用完成回调
      if (callbacks.onComplete) {
        callbacks.onComplete(fullText);
      }
    } catch (error) {
      if (callbacks.onError && error instanceof Error) {
        callbacks.onError(error);
      } else {
        throw error;
      }
    }
  }

  /**
   * 为消息列表添加系统提示
   */
  private addSystemPrompt(messages: LLMMessage[]): LLMMessage[] {
    // 检查是否已存在系统消息
    const hasSystemMessage = messages.some(msg => msg.role === 'system');
    
    if (hasSystemMessage) {
      return messages;
    }
    
    // 添加系统提示消息
    return [
      { role: 'system', content: this.systemPrompt },
      ...messages
    ];
  }
} 