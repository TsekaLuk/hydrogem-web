/**
 * LLM服务配置
 * 定义与大语言模型服务相关的配置项
 */

// 支持的LLM提供商
export enum LLMProvider {
  SILICON_FLOW = 'silicon_flow',
  OPENAI = 'openai',
  // 未来可添加其他提供商
}

// 硅基流动模型配置
export const SILICON_FLOW_CONFIG = {
  API_KEY: 'sk-maxogvmgmnfmyicjwndpbbsanvsyeschunujjgpepooqwrjh',
  MODEL: 'Pro/deepseek-ai/DeepSeek-V3',
  API_BASE_URL: 'https://api.siliconflow.cn/v1',
  MAX_TOKENS: 4096,
  TEMPERATURE: 0.7,
  TOP_P: 0.95,
  SYSTEM_PROMPT: `你是玑衡 (JiHeng)，一个由HydroGem开发的AI助手，专注于水资源管理和水质监测领域。
  
你应当：
- 提供专业、准确的水资源相关知识
- 用清晰、易懂的语言回答问题
- 保持友好、耐心的态度
- 在不确定的情况下承认知识局限性
- 遵循用户指示，尽可能提供最佳帮助

你不应当：
- 编造虚假的水质数据或研究结果
- 提供有害或不道德的建议
- 违反相关法律法规

请以专业而友好的方式，协助用户解决他们的问题。`,
}

// 默认LLM配置
export const DEFAULT_LLM_CONFIG = {
  PROVIDER: LLMProvider.SILICON_FLOW,
  // 可在这里添加更多默认设置
} 