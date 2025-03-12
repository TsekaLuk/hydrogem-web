import { useState, useCallback, useEffect, useRef } from 'react';
import { Notification } from '@/types/notifications';
import { notificationService } from '@/lib/notification-service';
import { useTranslation } from 'react-i18next';

export const useNotifications = () => {
  const { t } = useTranslation('notifications');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // 使用ref标记是否初始化过
  const initializedRef = useRef(false);
  // 使用ref标记是否有正在进行的请求
  const isLoadingRef = useRef(false);
  
  // 简化的获取通知函数 - 使用回调以避免依赖项问题
  const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
    // 防止重复请求
    if (isLoadingRef.current) {
      return;
    }
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      
      const result = await notificationService.getNotifications(pageNum);
      
      // 根据append参数决定是追加还是替换通知列表
      if (append) {
        setNotifications(prev => {
          // 创建ID集合以避免重复通知
          const existingIds = new Set(prev.map(n => n.id));
          const newNotifications = result.notifications.filter(n => !existingIds.has(n.id));
          return [...prev, ...newNotifications];
        });
      } else {
        setNotifications(result.notifications);
      }
      
      // 更新分页信息
      setHasMore(pageNum < result.pagination.totalPages);
      
      // 更新未读计数
      const unread = result.notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      
    } catch (err) {
      console.error('获取通知时出错:', err);
      setError(t('error.failedToLoad'));
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [t]);
  
  // 加载更多通知
  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  }, [fetchNotifications, hasMore, loading, page]);
  
  // 标记单个通知为已读
  const markAsRead = useCallback((id: string) => {
    // 乐观更新UI
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    
    setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    
    // 异步更新后端（但不等待）
    notificationService.markAsRead(id).catch(err => {
      console.error(`标记通知 ${id} 为已读时出错:`, err);
    });
  }, []);
  
  // 标记所有通知为已读
  const markAllAsRead = useCallback(() => {
    // 乐观更新UI
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    setUnreadCount(0);
    
    // 异步更新后端（但不等待）
    notificationService.markAllAsRead().catch(err => {
      console.error('标记所有通知为已读时出错:', err);
    });
  }, []);
  
  // 刷新通知
  const refreshNotifications = useCallback(() => {
    // 重置到第一页
    setPage(1);
    fetchNotifications(1, false);
  }, [fetchNotifications]);
  
  // 只在组件首次挂载时获取通知
  useEffect(() => {
    // 防止在服务端渲染执行和重复初始化
    if (typeof window !== 'undefined' && !initializedRef.current) {
      initializedRef.current = true;
      fetchNotifications();
    }
    
    // 无需清理函数，因为我们不设置任何计时器或订阅
  }, [fetchNotifications]);
  
  return {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  };
};
