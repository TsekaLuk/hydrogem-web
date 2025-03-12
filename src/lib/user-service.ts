import apiClient from '@/lib/api-client';

// 用户信息接口定义
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  tenants: UserTenant[];
  defaultTenantId?: string;
  created_at: string;
  updated_at: string;
}

// 租户信息接口定义
export interface UserTenant {
  id: string;
  name: string;
  role: string;
  isActive: boolean;
}

// 本地存储键
const USER_INFO_KEY = 'user_info';

// 获取当前用户信息
export async function fetchCurrentUser(): Promise<UserInfo> {
  try {
    // 检查本地缓存
    const cachedUserInfo = getCachedUserInfo();
    
    // 如果本地有缓存且未过期，直接返回缓存
    if (cachedUserInfo) {
      return cachedUserInfo;
    }
    
    // 如果没有缓存或缓存已过期，则请求后端
    const response = await apiClient.get('/users/me');
    const userInfo = response.data.data;
    
    // 缓存用户信息（包括过期时间，设置为1小时）
    cacheUserInfo(userInfo);
    
    // 如果用户有默认租户，则存储默认租户ID
    if (userInfo.defaultTenantId) {
      localStorage.setItem('default_tenant_id', userInfo.defaultTenantId);
    }
    
    return userInfo;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
}

// 获取缓存的用户信息
export function getCachedUserInfo(): UserInfo | null {
  const userInfoData = localStorage.getItem(USER_INFO_KEY);
  
  if (!userInfoData) {
    return null;
  }
  
  try {
    const userData = JSON.parse(userInfoData);
    
    // 检查缓存是否过期
    if (userData.expiry && userData.expiry > Date.now()) {
      return userData.userInfo;
    }
    
    // 缓存已过期，清除缓存
    localStorage.removeItem(USER_INFO_KEY);
    return null;
  } catch (error) {
    console.error('解析用户信息失败:', error);
    return null;
  }
}

// 缓存用户信息
export function cacheUserInfo(userInfo: UserInfo): void {
  const data = {
    userInfo,
    expiry: Date.now() + 3600000 // 1小时过期
  };
  
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(data));
}

// 更新用户信息
export async function updateUserProfile(userData: Partial<UserInfo>): Promise<UserInfo> {
  try {
    const response = await apiClient.patch('/users/me', userData);
    const updatedUserInfo = response.data.data;
    
    // 更新缓存
    const currentInfo = getCachedUserInfo();
    if (currentInfo) {
      cacheUserInfo({
        ...currentInfo,
        ...updatedUserInfo
      });
    }
    
    return updatedUserInfo;
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
}

// 获取用户的租户列表
export async function getUserTenants(): Promise<UserTenant[]> {
  try {
    const response = await apiClient.get('/users/me/tenants');
    return response.data.data;
  } catch (error) {
    console.error('获取用户租户列表失败:', error);
    throw error;
  }
}

// 切换用户当前租户
export async function switchUserTenant(tenantId: string): Promise<void> {
  try {
    await apiClient.post('/users/me/tenants/switch', { tenantId });
    
    // 更新本地存储的租户ID
    localStorage.setItem('tenant_id', tenantId);
    
    // 刷新用户信息缓存
    await fetchCurrentUser();
    
    // 重载页面以反映租户变更
    window.location.reload();
  } catch (error) {
    console.error('切换租户失败:', error);
    throw error;
  }
}

// 获取用户名
export function getUserName(): string {
  const userInfo = getCachedUserInfo();
  return userInfo?.name || '未知用户';
}

// 获取用户邮箱
export function getUserEmail(): string {
  const userInfo = getCachedUserInfo();
  return userInfo?.email || '';
}

// 检查用户是否有特定租户的特定权限
export function hasPermission(permission: string, tenantId?: string): boolean {
  const userInfo = getCachedUserInfo();
  
  if (!userInfo) {
    return false;
  }
  
  // 使用指定的租户ID或当前活跃租户ID
  const targetTenantId = tenantId || localStorage.getItem('tenant_id') || userInfo.defaultTenantId;
  
  // 如果用户是超级管理员，拥有所有权限
  if (userInfo.role === 'super_admin') {
    return true;
  }
  
  // 找到当前租户的用户角色
  const tenant = userInfo.tenants.find(t => t.id === targetTenantId);
  
  // 实际项目中，这里应该有一个更复杂的权限检查逻辑
  // 简化版：假设某些角色拥有某些权限
  if (tenant) {
    switch (tenant.role) {
      case 'tenant_admin':
        return true; // 租户管理员拥有所有权限
      case 'manager':
        return !permission.includes('admin'); // 管理者拥有除admin外的所有权限
      case 'operator':
        return permission.startsWith('read') || permission.startsWith('view'); // 操作员只有读权限
      default:
        return false;
    }
  }
  
  return false;
}
