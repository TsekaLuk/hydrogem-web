import { useEffect, useRef, memo } from 'react';
import katex from 'katex';
import { defaultKatexOptions } from '@/lib/katex-config';
import 'katex/dist/katex.min.css';

interface KatexRendererProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

// Using memo to prevent unnecessary re-renders
const KatexRenderer = memo(function KatexRenderer({ 
  math, 
  displayMode = false, 
  className = ''
}: KatexRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current && math) {
      try {
        katex.render(math, containerRef.current, {
          ...defaultKatexOptions,
          displayMode,
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        containerRef.current.innerHTML = `
          <span class="katex-error text-red-500" title="${error}">
            ${displayMode ? '$$' : '$'}${math}${displayMode ? '$$' : '$'}
          </span>
        `;
      }
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [math, displayMode]);
  
  return (
    <div 
      ref={containerRef} 
      className={className} 
      data-katex-expression={math}
    />
  );
});

export default KatexRenderer; 