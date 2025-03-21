import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ThemeProvider } from 'next-themes';
import { memo, Suspense, useCallback, lazy } from 'react';
import NineDotGridRandom from './components/ui/NineDotGridRandom';
import StatusIndicatorShowcase from './components/examples/StatusIndicatorShowcase';
import { Route } from 'react-router-dom';

// 懒加载性能监控组件，确保不影响初始加载时间
const PerformanceMonitor = lazy(() => import('./components/performance/PerformanceMonitor'));

// 使用React.memo优化Layout组件，防止不必要的重渲染
const MemoizedLayout = memo(Layout);

// 预取主要资源的函数
const prefetchResources = () => {
  const resources = [
    '/assets/images/logo.png',
    '/assets/fonts/main.woff2'
  ];
  
  // 使用requestIdleCallback在浏览器空闲时进行预加载
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      resources.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        document.head.appendChild(link);
      });
    });
  }
};

function App() {
  // 预取资源
  useCallback(() => {
    if (typeof window !== 'undefined') {
      prefetchResources();
    }
  }, [])();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><NineDotGridRandom /></div>}>
          <MemoizedLayout />
          {/* 只在生产环境之外显示性能监控 */}
          {process.env.NODE_ENV !== 'production' && <PerformanceMonitor />}
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;