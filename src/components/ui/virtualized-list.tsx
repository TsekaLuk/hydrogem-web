import React, { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import '@/styles/virtualized-list.css';

interface VirtualizedListProps<T> {
  items: T[];
  height: number | string;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number; // 预加载行数
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

// 创建一个HOC组件，用于处理动态高度
const DynamicHeightContainer: React.FC<{
  height: number | string;
  className?: string;
  children: React.ReactNode;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
}> = ({ height, className, children, onScroll, containerRef }) => {
  // 使用CSS变量设置高度
  useEffect(() => {
    if (containerRef.current) {
      if (typeof height === 'number') {
        containerRef.current.style.setProperty('--container-height', `${height}px`);
      } else {
        containerRef.current.style.setProperty('--container-height', height);
      }
    }
  }, [height, containerRef]);

  return (
    <div
      ref={containerRef}
      className={cn("virtualized-list-container", className)}
      onScroll={onScroll}
    >
      {children}
    </div>
  );
};

export function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className,
  overscan = 3,
  onEndReached,
  endReachedThreshold = 200
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
      
      // 监听容器大小变化
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          setContainerHeight(entry.contentRect.height);
        }
      });
      
      resizeObserver.observe(containerRef.current);
      
      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }
  }, []);

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setScrollTop(scrollTop);
      
      // 检测是否滚动到底部附近
      if (
        onEndReached &&
        scrollHeight - scrollTop - clientHeight < endReachedThreshold
      ) {
        onEndReached();
      }
    }
  }, [onEndReached, endReachedThreshold]);

  // 计算可见项的起始和结束索引
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  // 计算内容的总高度和偏移量
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  // 提取可见项
  const visibleItems = items.slice(startIndex, endIndex + 1);

  // 使用useEffect更新CSS变量
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.setProperty('--content-height', `${totalHeight}px`);
    }
    if (itemsRef.current) {
      itemsRef.current.style.setProperty('--offset-y', `${offsetY}px`);
    }
  }, [totalHeight, offsetY]);

  // 为每个项目设置高度
  useEffect(() => {
    const items = document.querySelectorAll('.virtualized-list-item');
    items.forEach(item => {
      (item as HTMLElement).style.setProperty('--item-height', `${itemHeight}px`);
    });
  }, [itemHeight, visibleItems]);

  return (
    <DynamicHeightContainer
      height={height}
      className={className}
      onScroll={handleScroll}
      containerRef={containerRef}
    >
      <div 
        ref={contentRef}
        className="virtualized-list-content" 
        data-total-height={totalHeight}
      >
        <div
          ref={itemsRef}
          className="virtualized-list-items"
          data-offset-y={offsetY}
        >
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              className="virtualized-list-item"
              data-height={itemHeight}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </DynamicHeightContainer>
  );
}
