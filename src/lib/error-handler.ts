/**
 * 错误处理工具
 * 处理LLM API调用时可能发生的各种错误
 */

// 常见错误类型
export enum ErrorType {
  NETWORK = 'network',
  API_KEY = 'api_key',
  RATE_LIMIT = 'rate_limit',
  SERVER = 'server',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

// 错误信息
interface ErrorInfo {
  type: ErrorType;
  message: string;
  retry?: boolean; // 是否可重试
  retryDelay?: number; // 重试延迟（毫秒）
}

/**
 * 根据错误信息确定错误类型
 * @param error 错误对象或消息
 * @returns 错误信息
 */
export function identifyError(error: Error | string): ErrorInfo {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  // 网络错误
  if (
    errorMessage.includes('network') || 
    errorMessage.includes('连接') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('fetch')
  ) {
    return {
      type: ErrorType.NETWORK,
      message: '网络连接错误，请检查您的网络连接',
      retry: true,
      retryDelay: 3000
    };
  }
  
  // API密钥错误
  if (
    errorMessage.includes('API key') ||
    errorMessage.includes('apikey') ||
    errorMessage.includes('api_key') ||
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('认证') ||
    errorMessage.includes('authentication')
  ) {
    return {
      type: ErrorType.API_KEY,
      message: 'API密钥无效或已过期，请联系管理员',
      retry: false
    };
  }
  
  // 速率限制
  if (
    errorMessage.includes('rate limit') ||
    errorMessage.includes('too many') ||
    errorMessage.includes('requests') ||
    errorMessage.includes('速率') ||
    errorMessage.includes('次数')
  ) {
    return {
      type: ErrorType.RATE_LIMIT,
      message: '请求频率过高，请稍后再试',
      retry: true,
      retryDelay: 5000
    };
  }
  
  // 服务器错误
  if (
    errorMessage.includes('500') ||
    errorMessage.includes('server') ||
    errorMessage.includes('服务器')
  ) {
    return {
      type: ErrorType.SERVER,
      message: '服务器错误，请稍后再试',
      retry: true,
      retryDelay: 3000
    };
  }
  
  // 超时错误
  if (
    errorMessage.includes('timeout') ||
    errorMessage.includes('timed out') ||
    errorMessage.includes('超时')
  ) {
    return {
      type: ErrorType.TIMEOUT,
      message: '请求超时，请稍后再试',
      retry: true,
      retryDelay: 2000
    };
  }
  
  // 未知错误
  return {
    type: ErrorType.UNKNOWN,
    message: '发生未知错误，请稍后再试',
    retry: true,
    retryDelay: 3000
  };
}

/**
 * 格式化错误消息以显示给用户
 * @param error 错误对象或消息
 * @returns 用户友好的错误消息
 */
export function formatErrorForUser(error: Error | string): string {
  const errorInfo = identifyError(error);
  return errorInfo.message;
} 