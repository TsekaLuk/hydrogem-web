/**
 * LLM服务工厂
 * 根据配置返回不同的LLM服务实现
 */
import { LLMProvider, DEFAULT_LLM_CONFIG } from '@/lib/llm-config';
import { SiliconFlowService } from './silicon-flow-service';
import { LLMService } from '@/types/llm';

// LLM服务单例
let siliconFlowServiceInstance: SiliconFlowService | null = null;

/**
 * 获取LLM服务实例
 * @param provider LLM服务提供商
 * @returns LLM服务实例
 */
export function getLLMService(provider: LLMProvider = DEFAULT_LLM_CONFIG.PROVIDER): LLMService {
  switch (provider) {
    case LLMProvider.SILICON_FLOW:
      if (!siliconFlowServiceInstance) {
        siliconFlowServiceInstance = new SiliconFlowService();
      }
      return siliconFlowServiceInstance;
      
    // 未来可以添加其他LLM服务提供商的支持
    // case LLMProvider.OPENAI:
    //   return new OpenAIService();
      
    default:
      throw new Error(`不支持的LLM服务提供商: ${provider}`);
  }
} 