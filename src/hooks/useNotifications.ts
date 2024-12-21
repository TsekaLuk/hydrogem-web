import { useState, useCallback } from 'react';
import { Notification, NotificationType } from '@/types/notifications';
import { useToast } from '@/hooks/use-toast';

// 模拟初始通知数据
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'pH Level Warning',
    message: 'Tank #3 pH levels approaching warning threshold',
    timestamp: new Date(),
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'System Update',
    message: 'System maintenance scheduled for tonight',
    timestamp: new Date(),
    read: false,
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const { toast } = useToast();

  const addNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    options?: Partial<Notification>
  ) => {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      ...options
    };

    setNotifications(prev => [notification, ...prev]);

    // Show toast for non-info notifications
    if (type !== 'info') {
      toast({
        title: notification.title,
        description: notification.message,
        variant: type === 'error' ? 'destructive' : 'default',
      });
    }

    return notification.id;
  }, [toast]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
}