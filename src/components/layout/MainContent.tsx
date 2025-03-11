import { cn } from '@/lib/utils';
import { ContentHeader } from './ContentHeader';
import { ContentGrid } from './ContentGrid';
import { useEffect, useState } from 'react';

interface MainContentProps {
  className?: string;
  children?: React.ReactNode;
  sidebarCollapsed?: boolean;
}

export function MainContent({ className, children, sidebarCollapsed = false }: MainContentProps) {
  const [isMobile, setIsMobile] = useState(false);

  // 检测屏幕尺寸变化
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 初始检查
    checkScreenSize();

    // 监听窗口大小变化
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <main className={cn(
      'flex-1 transition-all duration-300 ease-in-out',
      'p-0',
      isMobile ? 'ml-[60px]' : (sidebarCollapsed ? 'ml-[60px]' : 'ml-[240px]'),
      'w-[calc(100%-60px)] md:w-auto max-w-full h-[calc(100vh-3.5rem)]',
      className
    )}>
      <div className="max-w-[1400px] mx-auto w-full h-full">
        <ContentHeader />
        <div className="w-full mt-4 h-[calc(100%-3rem)] overflow-auto">
          {children}
        </div>
      </div>
    </main>
  );
}