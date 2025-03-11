import { useState, useEffect, useCallback, RefObject } from 'react';

// 基础维度接口
export interface Dimensions {
  width: number;
  height: number;
}

// 使用防抖的尺寸观察钩子
export function useDimensions(ref: RefObject<HTMLElement>): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0
  });

  const updateDimensions = useCallback(() => {
    if (ref.current) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight
      });
    }
  }, [ref]);

  useEffect(() => {
    // 初始更新
    updateDimensions();

    // 创建ResizeObserver来观察尺寸变化
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === ref.current) {
          // 更新尺寸，有轻微的防抖效果（16ms，约等于一帧）
          const timeout = setTimeout(() => {
            updateDimensions();
          }, 16);

          return () => clearTimeout(timeout);
        }
      }
    });

    // 开始观察
    if (ref.current) {
      observer.observe(ref.current);
    }

    // 在窗口调整大小时也更新
    window.addEventListener('resize', updateDimensions);

    // 清理
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [ref, updateDimensions]);

  return dimensions;
} 