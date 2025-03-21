import React, { useEffect, useState } from 'react';

// 性能指标接口
interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  jsHeapSize: number | null; // JavaScript堆大小（MB）
  domNodes: number | null; // DOM节点数量
  resourceCount: number | null; // 资源数量
}

// 格式化毫秒为易读格式
const formatTime = (ms: number | null): string => {
  if (ms === null) return 'N/A';
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

// 格式化数字为易读格式
const formatNumber = (num: number | null): string => {
  if (num === null) return 'N/A';
  return num.toLocaleString();
};

// 格式化字节为MB
const formatMB = (bytes: number | null): string => {
  if (bytes === null) return 'N/A';
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * 性能监控组件
 * 收集和显示关键Web性能指标
 */
export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    jsHeapSize: null,
    domNodes: null,
    resourceCount: null,
  });
  
  const [isExpanded, setIsExpanded] = useState(false);

  // 收集性能指标
  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return;
    }

    // 获取基本导航计时
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navEntry) {
      setMetrics(prev => ({
        ...prev,
        ttfb: navEntry.responseStart,
      }));
    }

    // 计算DOM节点数量
    const countDOMNodes = () => {
      return document.querySelectorAll('*').length;
    };

    // 获取资源数量
    const countResources = () => {
      return performance.getEntriesByType('resource').length;
    };

    // 获取JS堆大小（如果可用）
    const getJSHeapSize = () => {
      if ('memory' in performance) {
        // @ts-ignore - memory属性在TS定义中不存在，但在Chrome中可用
        return performance.memory.usedJSHeapSize;
      }
      return null;
    };

    // 使用PerformanceObserver监听FCP
    if ('PerformanceObserver' in window) {
      // 监听FCP
      try {
        const fcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            const fcp = entries[0].startTime;
            setMetrics(prev => ({ ...prev, fcp }));
          }
        });
        fcpObserver.observe({ type: 'paint', buffered: true });
      } catch (e) {
        console.error('FCP监控失败:', e);
      }
      
      // 监听LCP
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            const lcp = lastEntry.startTime;
            setMetrics(prev => ({ ...prev, lcp }));
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.error('LCP监控失败:', e);
      }
      
      // 监听FID
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            const fid = entries[0].processingStart - entries[0].startTime;
            setMetrics(prev => ({ ...prev, fid }));
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.error('FID监控失败:', e);
      }
      
      // 监听CLS
      try {
        let clsValue = 0;
        let clsEntries: PerformanceEntry[] = [];
        
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries() as PerformanceEntry[];
          
          entries.forEach(entry => {
            // 不将用户输入后1秒内的布局偏移计入CLS
            if (!entry.hadRecentInput) {
              // @ts-ignore - CLS特定属性
              const impact = entry.value;
              clsValue += impact;
              clsEntries.push(entry);
            }
          });
          
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        });
        
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.error('CLS监控失败:', e);
      }
    }

    // 定期更新内存和DOM数量等指标
    const intervalId = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        jsHeapSize: getJSHeapSize(),
        domNodes: countDOMNodes(),
        resourceCount: countResources(),
      }));
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // 根据指标评估性能
  const evaluatePerformance = (metric: keyof PerformanceMetrics): 'good' | 'needs-improvement' | 'poor' | 'unknown' => {
    const value = metrics[metric];
    
    if (value === null) return 'unknown';
    
    switch (metric) {
      case 'fcp':
        return value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor';
      case 'lcp':
        return value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
      case 'fid':
        return value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor';
      case 'cls':
        return value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
      case 'ttfb':
        return value < 200 ? 'good' : value < 500 ? 'needs-improvement' : 'poor';
      default:
        return 'unknown';
    }
  };

  // 性能指标样式
  const getMetricStyle = (metric: keyof PerformanceMetrics) => {
    const evaluation = evaluatePerformance(metric);
    
    switch (evaluation) {
      case 'good':
        return 'text-green-500';
      case 'needs-improvement':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!isExpanded) {
    return (
      <div 
        className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg cursor-pointer z-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        onClick={() => setIsExpanded(true)}
        title="显示性能指标"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50 max-w-xs md:max-w-sm opacity-90 hover:opacity-100 transition-opacity">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">性能监控</h3>
        <button 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={() => setIsExpanded(false)}
          aria-label="关闭性能监控面板"
          title="关闭"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-2 text-xs md:text-sm">
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-gray-600 dark:text-gray-400">首次内容绘制 (FCP):</span>
          <span className={getMetricStyle('fcp')}>{formatTime(metrics.fcp)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-gray-600 dark:text-gray-400">最大内容绘制 (LCP):</span>
          <span className={getMetricStyle('lcp')}>{formatTime(metrics.lcp)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-gray-600 dark:text-gray-400">首次输入延迟 (FID):</span>
          <span className={getMetricStyle('fid')}>{formatTime(metrics.fid)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-gray-600 dark:text-gray-400">累积布局偏移 (CLS):</span>
          <span className={getMetricStyle('cls')}>{metrics.cls !== null ? metrics.cls.toFixed(3) : 'N/A'}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-gray-600 dark:text-gray-400">首字节时间 (TTFB):</span>
          <span className={getMetricStyle('ttfb')}>{formatTime(metrics.ttfb)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-gray-600 dark:text-gray-400">JS堆大小:</span>
          <span className="text-gray-700 dark:text-gray-300">{formatMB(metrics.jsHeapSize)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-gray-600 dark:text-gray-400">DOM节点:</span>
          <span className="text-gray-700 dark:text-gray-300">{formatNumber(metrics.domNodes)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-x-2">
          <span className="text-gray-600 dark:text-gray-400">资源数量:</span>
          <span className="text-gray-700 dark:text-gray-300">{formatNumber(metrics.resourceCount)}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        更新于 {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default PerformanceMonitor;
