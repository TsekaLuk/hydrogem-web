import apiClient from './api-client';
import { Notification } from '@/types/notifications';

// 环境变量标志，用于控制是否使用模拟数据
const USE_MOCK_DATA = true; // 强制使用模拟数据，避免API请求卡死

export interface ApiNotification {
  id: string;
  title: string;
  message: string;
  level: 'critical' | 'warning' | 'info' | 'success';
  status: 'active' | 'read' | 'dismissed';
  source: string;
  sourceId: string;
  sourceName: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationsResponse {
  data: ApiNotification[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// 模拟通知数据
const mockNotifications: ApiNotification[] = [
  {
    id: '1',
    title: 'pH Level Warning',
    message: 'Tank #3 pH levels approaching warning threshold',
    level: 'warning',
    status: 'active',
    source: 'system',
    sourceId: 'tank-3',
    sourceName: 'pH Monitoring',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30分钟前
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: '2',
    title: 'System Update',
    message: 'System maintenance scheduled for tonight',
    level: 'info',
    status: 'active',
    source: 'system',
    sourceId: 'maintenance',
    sourceName: 'System',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(), // 2小时前
    updatedAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
  {
    id: '3',
    title: 'Temperature Alert',
    message: 'Tank #2 temperature exceeds critical threshold',
    level: 'critical',
    status: 'active',
    source: 'system',
    sourceId: 'tank-2',
    sourceName: 'Temperature Monitoring',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(), // 10分钟前
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: '4',
    title: 'Oxygen Levels Normal',
    message: 'Tank #1 oxygen levels have returned to normal range',
    level: 'success',
    status: 'active',
    source: 'system',
    sourceId: 'tank-1',
    sourceName: 'Oxygen Monitoring',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(), // 45分钟前
    updatedAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: '5',
    title: 'Daily Report',
    message: 'Yesterday\'s water quality report is now available',
    level: 'info',
    status: 'read',
    source: 'system',
    sourceId: 'reports',
    sourceName: 'Reporting',
    createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1天前
    updatedAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
  }
];

// 本地缓存，用于在模拟数据模式下记录已读状态
let mockNotificationCache = [...mockNotifications];

// 获取模拟通知数据
const getMockNotifications = (page = 1, limit = 20): NotificationsResponse => {
  // 过滤和分页模拟数据
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = mockNotificationCache.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    meta: {
      page,
      limit,
      totalItems: mockNotificationCache.length,
      totalPages: Math.ceil(mockNotificationCache.length / limit)
    }
  };
};

// 将API通知类型转换为应用通知类型
function mapApiNotificationToNotification(apiNotification: ApiNotification): Notification {
  // 映射API通知级别到应用通知类型
  const typeMap: Record<string, Notification['type']> = {
    'critical': 'error',
    'warning': 'warning',
    'info': 'info',
    'success': 'success'
  };

  return {
    id: apiNotification.id,
    type: typeMap[apiNotification.level] || 'info',
    title: apiNotification.title,
    message: apiNotification.message,
    timestamp: new Date(apiNotification.createdAt),
    read: apiNotification.status === 'read' || apiNotification.status === 'dismissed',
    metadata: apiNotification.metadata,
    actionUrl: apiNotification.sourceId ? `/alerts/${apiNotification.sourceId}` : undefined
  };
}

// 通知服务
export const notificationService = {
  // 获取通知列表
  async getNotifications(page = 1, limit = 20): Promise<{
    notifications: Notification[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  }> {
    try {
      // 强制使用模拟数据，避免API卡死
      const mockResponse = getMockNotifications(page, limit);
      return {
        notifications: mockResponse.data.map(mapApiNotificationToNotification),
        pagination: {
          currentPage: mockResponse.meta.page,
          totalPages: mockResponse.meta.totalPages,
          totalItems: mockResponse.meta.totalItems
        }
      };
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      
      // 返回空结果，避免更多错误
      return {
        notifications: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0
        }
      };
    }
  },

  // 标记通知为已读
  async markAsRead(id: string): Promise<boolean> {
    try {
      // 在模拟数据模式下，更新本地缓存
      mockNotificationCache = mockNotificationCache.map(notification => 
        notification.id === id 
          ? { ...notification, status: 'read' } 
          : notification
      );
      
      return true;
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
      return false;
    }
  },

  // 标记所有通知为已读 - 简化版本，不依赖于getNotifications
  async markAllAsRead(): Promise<boolean> {
    try {
      // 在模拟数据模式下，更新所有通知为已读
      mockNotificationCache = mockNotificationCache.map(notification => 
        notification.status === 'active' 
          ? { ...notification, status: 'read' } 
          : notification
      );
      
      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  },

  // 获取未读通知数
  async getUnreadCount(): Promise<number> {
    try {
      // 在模拟数据模式下，直接计算未读数量
      const unreadCount = mockNotificationCache.filter(n => n.status === 'active').length;
      return unreadCount;
    } catch (error) {
      console.error('Failed to get unread notification count:', error);
      return 0;
    }
  }
};
