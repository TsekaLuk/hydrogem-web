import { useState, useEffect, useCallback } from 'react';

interface UseSidebarResult {
  isCollapsed: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
}

/**
 * 侧边栏状态管理钩子
 * 用于控制侧边栏的展开/折叠状态
 */
export function useSidebar(): UseSidebarResult {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // 在移动设备上自动折叠侧边栏
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768 && !isCollapsed) {
        setIsCollapsed(true);
      }
    };

    // 初始化检查
    checkScreenSize();

    // 监听窗口大小变化
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isCollapsed]);

  // 切换侧边栏状态
  const toggle = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // 折叠侧边栏
  const collapse = useCallback(() => {
    setIsCollapsed(true);
  }, []);

  // 展开侧边栏
  const expand = useCallback(() => {
    setIsCollapsed(false);
  }, []);

  return {
    isCollapsed,
    toggle,
    collapse,
    expand
  };
} 