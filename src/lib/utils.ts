import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并Tailwind CSS类
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 将数字格式化为带有K/M/B后缀的字符串
 */
export function formatCompactNumber(num: number): string {
  const formatter = Intl.NumberFormat('en', { 
    notation: 'compact',
    maximumFractionDigits: 1 
  });
  return formatter.format(num);
}

/**
 * 根据当前值和阈值范围确定状态
 */
export function getStatusFromThresholds(
  value: number, 
  thresholds: { warning: [number, number], critical: [number, number] }
): 'good' | 'warning' | 'critical' {
  const { warning, critical } = thresholds;
  
  if (value < critical[0] || value > critical[1]) {
    return 'critical';
  }
  
  if (value < warning[0] || value > warning[1]) {
    return 'warning';
  }
  
  return 'good';
}

/**
 * 计算两个日期之间的时间差，并返回人类可读的字符串
 */
export function getTimeAgo(date: Date | number): string {
  const now = new Date();
  const past = typeof date === 'number' ? new Date(date) : date;
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (seconds < 60) {
    return `${seconds}秒前`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}分钟前`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}小时前`;
  }
  
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}天前`;
  }
  
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}个月前`;
  }
  
  const years = Math.floor(months / 12);
  return `${years}年前`;
}

/**
 * 生成随机ID
 */
export function generateId(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}
