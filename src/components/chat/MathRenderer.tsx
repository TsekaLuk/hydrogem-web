import React, { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import { defaultKatexOptions } from '@/lib/katex-config';
import { cn } from '@/lib/utils';
import { renderMathJax } from '@/lib/mathjax-init';

interface MathRendererProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

// Complexity indicators that suggest using MathJax instead of KaTeX
const COMPLEX_PATTERNS = [
  /\\begin\{(align|gather|multline|eqnarray)\*?\}/,  // Complex environments
  /\\underbrace|\\overbrace/,                        // Under/overbrace
  /\\xleftarrow|\\xrightarrow/,                      // Extensible arrows
  /\\begin\{cases\}.{100,}/,                        // Large cases environment
  /\\begin\{(matrix|pmatrix|bmatrix|vmatrix|Vmatrix)\}.{150,}/, // Large matrices
  /\\mathchoice/,                                   // Math choice command
  /\\(over|under)set/,                              // Over/under set
  /\\stackrel/,                                     // Stack relation
  /\\(mathop|limits)/,                              // Custom operators with limits
  /\\(left|right)\s*[\{\[].+?[\}\]]/s              // Complex delimiters
];

// Check if formula is complex enough to warrant MathJax
const isComplexFormula = (formula: string): boolean => {
  // Quick length check first
  if (formula.length > 500) return true;
  
  // Check for complex patterns
  return COMPLEX_PATTERNS.some(pattern => pattern.test(formula));
};

export function MathRenderer({ 
  math, 
  displayMode = false, 
  className 
}: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [renderer, setRenderer] = useState<'katex' | 'mathjax'>('katex');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const renderMath = async () => {
      if (!containerRef.current || !math) return;
      
      setIsLoading(true);
      try {
        // Clear previous content and error
        containerRef.current.innerHTML = '';
        setError(null);
        
        // Determine which renderer to use
        const shouldUseMathJax = isComplexFormula(math);
        setRenderer(shouldUseMathJax ? 'mathjax' : 'katex');
        
        // Prepare the content for rendering
        const contentToRender = displayMode && !math.startsWith('$$') 
          ? `$$${math}$$` 
          : math;
          
        if (shouldUseMathJax) {
          // Use MathJax for complex formulas
          try {
            const rendered = await renderMathJax(contentToRender);
            if (containerRef.current) {
              containerRef.current.innerHTML = rendered;
              
              // 修复行内公式可能被强制换行的问题
              if (!displayMode && containerRef.current.firstElementChild) {
                const mjxContainer = containerRef.current.querySelector('.mjx-container');
                if (mjxContainer) {
                  mjxContainer.setAttribute('style', 'display: inline-block; white-space: normal;');
                  mjxContainer.classList.add('math-inline-fix');
                }
              }
            }
          } catch (mjErr) {
            console.error('MathJax rendering error:', mjErr);
            // Fallback to KaTeX if MathJax fails
            if (containerRef.current) {
              katex.render(math, containerRef.current, {
                ...defaultKatexOptions,
                displayMode,
                throwOnError: false,
                errorCallback: (err) => {
                  console.error('KaTeX fallback error:', err);
                  setError(`MathJax failed, KaTeX fallback error: ${err.message}`);
                }
              });
            }
          }
        } else {
          // Use KaTeX for simple formulas
          try {
            katex.render(math, containerRef.current, {
              ...defaultKatexOptions,
              displayMode,
              throwOnError: false,
              errorCallback: (err) => {
                console.error('KaTeX error:', err);
                setError(err.message);
              }
            });
          } catch (katexErr) {
            console.error('KaTeX rendering error:', katexErr);
            // If KaTeX fails, try MathJax as a fallback
            try {
              const rendered = await renderMathJax(contentToRender);
              if (containerRef.current) {
                containerRef.current.innerHTML = rendered;
                
                // 修复行内公式可能被强制换行的问题
                if (!displayMode && containerRef.current.firstElementChild) {
                  const mjxContainer = containerRef.current.querySelector('.mjx-container');
                  if (mjxContainer) {
                    mjxContainer.setAttribute('style', 'display: inline-block; white-space: normal;');
                    mjxContainer.classList.add('math-inline-fix');
                  }
                }
                
                setError(null);
              }
            } catch (mjFallbackErr) {
              console.error('MathJax fallback error:', mjFallbackErr);
              setError('Both renderers failed');
            }
          }
        }
      } catch (err) {
        console.error('Math rendering error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    
    renderMath();
  }, [math, displayMode]);
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        'math-renderer',
        displayMode ? 'block my-4 math-display-clean' : 'inline math-inline-clean',
        error ? 'text-red-500' : '',
        isLoading ? 'opacity-50' : '',
        className
      )}
      style={{
        // 确保行内公式不导致换行
        display: displayMode ? 'block' : 'inline',
        verticalAlign: !displayMode ? 'middle' : undefined
      }}
    >
      {isLoading && <span className="math-loading">Loading math...</span>}
      {error && <span className="math-error" title={error}>{math}</span>}
    </div>
  );
}

export default MathRenderer; 