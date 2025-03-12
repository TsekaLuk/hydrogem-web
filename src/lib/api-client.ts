import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { refreshAuthToken } from '@/lib/auth-service';

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.hydrogem.tech/v1';

// 错误消息映射
const ERROR_MESSAGES: Record<number, string> = {
  400: '请求参数错误或不完整',
  401: '未认证或认证已过期',
  403: '无权访问此资源',
  404: '请求的资源不存在',
  409: '请求冲突',
  429: '请求次数过多，请稍后再试',
  500: '服务器内部错误',
  503: '服务暂时不可用'
};

// 定义API错误响应接口
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5秒超时
});

// 存储是否正在刷新令牌的标志
let isRefreshingToken = false;
// 存储等待令牌刷新的请求队列
let pendingRequests: Array<() => void> = [];

// 请求拦截器：添加认证令牌和租户上下文
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // 添加租户ID（如果存在）
  const tenantId = localStorage.getItem('tenant_id') || localStorage.getItem('default_tenant_id');
  if (tenantId && config.headers) {
    config.headers['X-Tenant-ID'] = tenantId;
  }
  
  return config;
});

// 响应拦截器：处理错误和令牌刷新
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 成功响应直接返回
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (!originalRequest) {
      return Promise.reject(formatError(error));
    }

    // 处理401错误（未认证或令牌过期）
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshingToken) {
        // 如果正在刷新令牌，将请求添加到队列
        return new Promise(resolve => {
          pendingRequests.push(() => resolve(apiClient(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshingToken = true;

      try {
        // 尝试刷新令牌
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // 使用刷新令牌获取新的访问令牌
        const tokens = await refreshAuthToken(refreshToken);
        localStorage.setItem('auth_token', tokens.accessToken);
        localStorage.setItem('refresh_token', tokens.refreshToken);

        // 更新当前请求的Authorization头
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        
        // 处理队列中的所有请求
        pendingRequests.forEach(callback => callback());
        pendingRequests = [];
        
        // 重试原始请求
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 刷新令牌失败，需要重新登录
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        
        // 重定向到登录页面
        window.location.href = '/login?expired=true';
        return Promise.reject(formatError(error));
      } finally {
        isRefreshingToken = false;
      }
    }

    // 处理其他错误
    return Promise.reject(formatError(error));
  }
);

// 格式化错误消息
function formatError(error: AxiosError): Error {
  const status = error.response?.status;
  // 类型断言解决TypeScript错误
  const errorData = error.response?.data as ApiErrorResponse | undefined;
  const serverMessage = errorData?.error?.message;
  const defaultMessage = status ? ERROR_MESSAGES[status] || '请求失败' : '网络错误，请检查您的连接';

  const errorMessage = serverMessage || defaultMessage;
  
  // 构建自定义错误对象
  const formattedError: any = new Error(errorMessage);
  formattedError.status = status;
  formattedError.code = errorData?.error?.code || 'UNKNOWN_ERROR';
  formattedError.details = errorData?.error?.details || null;
  formattedError.originalError = error;
  
  return formattedError;
}

export default apiClient;
