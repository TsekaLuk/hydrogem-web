import axios from 'axios';

// API基础配置
const AUTH_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.hydrogem.tech/v1';

// 定义Token响应接口
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// 登录接口
export async function login(email: string, password: string): Promise<TokenResponse> {
  try {
    const response = await axios.post(`${AUTH_API_URL}/auth/login`, {
      email,
      password
    });
    
    const tokens = response.data.data;
    
    // 存储tokens
    localStorage.setItem('auth_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
    localStorage.setItem('token_expiry', String(Date.now() + tokens.expiresIn * 1000));
    
    return tokens;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

// 刷新令牌
export async function refreshAuthToken(refreshToken: string): Promise<TokenResponse> {
  try {
    const response = await axios.post(`${AUTH_API_URL}/auth/refresh`, {
      refreshToken
    });
    
    const tokens = response.data.data;
    
    // 更新tokens
    localStorage.setItem('auth_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
    localStorage.setItem('token_expiry', String(Date.now() + tokens.expiresIn * 1000));
    
    return tokens;
  } catch (error) {
    console.error('刷新令牌失败:', error);
    throw error;
  }
}

// 登出
export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expiry');
  localStorage.removeItem('user_info');
  
  // 不移除租户ID，因为下次登录可能仍需使用同一租户
  
  // 重定向到登录页面
  window.location.href = '/login';
}

// 检查是否已经登录
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('auth_token');
  const expiry = localStorage.getItem('token_expiry');
  
  if (!token || !expiry) {
    return false;
  }
  
  // 检查令牌是否过期
  const expiryTime = parseInt(expiry, 10);
  const now = Date.now();
  
  // 如果过期时间在10分钟内，尝试刷新令牌
  if (expiryTime - now < 10 * 60 * 1000) {
    refreshTokenIfNeeded();
  }
  
  return expiryTime > now;
}

// 如果需要，自动刷新令牌（预防性刷新，用于在令牌即将过期时）
export async function refreshTokenIfNeeded(): Promise<boolean> {
  const expiry = localStorage.getItem('token_expiry');
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!expiry || !refreshToken) {
    return false;
  }
  
  const expiryTime = parseInt(expiry, 10);
  const now = Date.now();
  
  // 如果令牌将在10分钟内过期，刷新它
  if (expiryTime - now < 10 * 60 * 1000) {
    try {
      await refreshAuthToken(refreshToken);
      return true;
    } catch (error) {
      console.error('自动刷新令牌失败:', error);
      return false;
    }
  }
  
  return true; // 令牌仍然有效
}

// 切换租户
export function switchTenant(tenantId: string): void {
  localStorage.setItem('tenant_id', tenantId);
  // 在切换租户后刷新页面以加载新的租户数据
  window.location.reload();
}

// 获取当前租户ID
export function getCurrentTenantId(): string | null {
  return localStorage.getItem('tenant_id') || localStorage.getItem('default_tenant_id');
}
