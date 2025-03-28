import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并类名并解决Tailwind类名冲突的工具函数
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 