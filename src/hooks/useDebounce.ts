import { useState, useEffect } from 'react';

/**
 * 一个用于对值进行防抖处理的自定义钩子
 * @param value 需要防抖的值
 * @param delay 防抖延迟时间（毫秒）
 * @returns 防抖后的值
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    // 设置定时器以延迟更新防抖值
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // 在下一次 useEffect 运行前清除定时器
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
} 