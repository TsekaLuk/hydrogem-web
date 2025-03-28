import React, { useState, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';
import { renderMarkdown } from '@/lib/markdown';

export interface MathRendererProps {
  content: string;
  displayMode?: boolean;
  className?: string;
}

// 从公式中提取纯TeX内容
const extractTexContent = (formula: string): string => {
  // 处理$$...$$格式
  if (formula.startsWith('$$') && formula.endsWith('$$')) {
    return formula.slice(2, -2).trim();
  }
  
  // 处理$...$格式
  if (formula.startsWith('$') && formula.endsWith('$')) {
    return formula.slice(1, -1).trim();
  }
  
  // 处理\[...\]格式
  if (/^\\[\s\n]*\[[\s\S]*?\\[\s\n]*\]$/.test(formula)) {
    return formula.replace(/^\\[\s\n]*\[([\s\S]*?)\\[\s\n]*\]$/, '$1').trim();
  }
  
  // 处理\(...\)格式
  if (/^\\[\s\n]*\([\s\S]*?\\[\s\n]*\)$/.test(formula)) {
    return formula.replace(/^\\[\s\n]*\(([\s\S]*?)\\[\s\n]*\)$/, '$1').trim();
  }
  
  // 处理\begin{...}...\end{...}格式
  if (/^\\begin\{[^}]+\}[\s\S]*?\\end\{[^}]+\}$/.test(formula)) {
    return formula; // 返回完整的环境
  }
  
  // 如果没有找到明确的分隔符，返回原始公式
  return formula;
};

// 分割文本和公式
interface ContentPart {
  type: 'text' | 'math';
  content: string;
  displayMode: boolean;
}

const splitContent = (content: string): ContentPart[] => {
  const parts: ContentPart[] = [];
  let currentIndex = 0;
  
  // 匹配所有公式：行间公式($$...$$)和行内公式($...$)
  const mathRegex = /(\$\$[\s\S]*?\$\$)|(\$[^$\n]+?\$)/g;
  let match;
  
  while ((match = mathRegex.exec(content)) !== null) {
    // 添加公式前的文本
    if (match.index > currentIndex) {
      parts.push({
        type: 'text',
        content: content.slice(currentIndex, match.index),
        displayMode: false
      });
    }
    
    // 添加公式
    const formula = match[0];
    const isDisplayMode = formula.startsWith('$$');
    parts.push({
      type: 'math',
      content: extractTexContent(formula),
      displayMode: isDisplayMode
    });
    
    currentIndex = match.index + formula.length;
  }
  
  // 添加剩余的文本
  if (currentIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(currentIndex),
      displayMode: false
    });
  }
  
  return parts;
};

// 渲染单个公式
const RenderFormula = ({ content, displayMode }: { content: string; displayMode: boolean }) => {
  const [error, setError] = useState<string | null>(null);
  
  try {
    return (
      <span
        className={cn(
          'math-renderer',
          displayMode ? 'math-display katex-display-wrapper' : 'math-inline katex-inline-fix',
          displayMode ? 'block w-full my-1' : 'inline-block align-middle'
        )}
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(content, {
            displayMode: displayMode,
            throwOnError: false,
            strict: false,
            trust: true,
            output: 'html',
            macros: {
              '\\vec': '\\mathbf',
              '\\mat': '\\mathbf',
              // 添加更多常用宏
              '\\R': '\\mathbb{R}',
              '\\N': '\\mathbb{N}',
              '\\Z': '\\mathbb{Z}',
              '\\Q': '\\mathbb{Q}',
              '\\C': '\\mathbb{C}',
              // 微分符号
              '\\d': '\\mathrm{d}',
              '\\diff': '\\,\\mathrm{d}',
              // 向量符号
              '\\grad': '\\nabla',
              '\\div': '\\nabla \\cdot',
              '\\curl': '\\nabla \\times',
            },
          }),
        }}
      />
    );
  } catch (err) {
    console.error('KaTeX rendering error:', err);
    return <span className="math-error">Error rendering math: {err instanceof Error ? err.message : 'Unknown error'}</span>;
  }
};

export const MathRenderer: React.FC<MathRendererProps> = ({
  content,
  displayMode = false,
  className = '',
}) => {
  // 如果整个内容就是一个公式，直接渲染
  if (displayMode || (content.startsWith('$') && content.endsWith('$'))) {
    return <RenderFormula content={extractTexContent(content)} displayMode={displayMode} />;
  }

  // 否则，分割并渲染混合内容
  const parts = splitContent(content);
  
  return (
    <div className={cn('math-content markdown-content', className)}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part.type === 'math' ? (
            <RenderFormula content={part.content} displayMode={part.displayMode} />
          ) : (
            <span className="markdown-text">{part.content}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Specialized renderer optimized for message bubbles
export const MathRendererForMessages: React.FC<MathRendererProps> = ({
  content,
  displayMode = false,
  className = '',
}) => {
  // 检测内容是否为纯数学公式
  const isPureMathFormula = (
    (content.startsWith('$$') && content.endsWith('$$')) ||
    (content.startsWith('$') && content.endsWith('$')) ||
    content.trim().startsWith('\\begin{') ||
    content.trim().startsWith('\\[')
  );
  
  // 如果整个内容就是一个公式，根据公式类型决定显示模式
  if (isPureMathFormula) {
    const texContent = extractTexContent(content);
    // 只有明确是块级公式的才用displayMode=true渲染
    const isBlockMath = content.startsWith('$$') || content.startsWith('\\[') || content.trim().startsWith('\\begin{');
    
    return (
      <div className={cn(
        "message-formula-container markdown-content layout-stable", 
        isBlockMath ? "w-full py-1" : "inline-block py-0.5", 
        "px-0 transition-all duration-300 ease-in-out will-change-transform min-h-[1.25em]"
      )}>
        <RenderFormula 
          content={texContent} 
          displayMode={isBlockMath} 
        />
      </div>
    );
  }

  // 否则，分割并渲染混合内容
  const parts = splitContent(content);
  
  // 导入必要的markdown渲染函数
  const [processedParts, setProcessedParts] = useState<Array<{
    type: 'math' | 'html';
    content: string;
    displayMode?: boolean;
  }>>(parts.map(part => part.type === 'math' 
    ? { type: 'math', content: part.content, displayMode: part.displayMode } 
    : { type: 'html', content: part.content }
  ));

  // 使用useEffect处理文本部分的markdown渲染，带有防抖和清理逻辑
  useEffect(() => {
    let isMounted = true;
    let debounceTimer: NodeJS.Timeout | null = null;
    
    const processTextParts = async () => {
      // 清除之前的定时器
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      // 如果当前内容长度小于前一次处理的内容，立即处理(流式输出可能完成)
      const totalContentLength = parts.reduce((sum, part) => sum + part.content.length, 0);
      const shouldProcessImmediately = totalContentLength > 500;
      
      // 设置防抖，减少频繁渲染
      debounceTimer = setTimeout(async () => {
        if (!isMounted) return;
        
        try {
          // 批量处理所有部分，减少状态更新次数
          const processed = await Promise.all(
            parts.map(async part => {
              // 数学部分保持不变
              if (part.type === 'math') {
                return { type: 'math' as const, content: part.content, displayMode: part.displayMode };
              }
              
              // 文本部分通过markdown渲染
              if (part.content.trim()) {
                try {
                  const html = await renderMarkdown(part.content);
                  return { type: 'html' as const, content: html };
                } catch (err) {
                  console.error('Markdown渲染错误:', err);
                  return { type: 'html' as const, content: `<p>${part.content}</p>` };
                }
              }
              return { type: 'html' as const, content: part.content ? `<p>${part.content}</p>` : '' };
            })
          );
          
          if (isMounted) {
            setProcessedParts(processed);
          }
        } catch (error) {
          console.error('处理文本部分时出错:', error);
        }
      }, shouldProcessImmediately ? 0 : 100); // 较短的内容使用100ms防抖，长内容立即处理
    };
    
    processTextParts();
    
    // 组件卸载时清理
    return () => {
      isMounted = false;
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [parts]);
  
  return (
    <div className={cn(
      'math-content message-math-content markdown-content content-height-stable',
      'transition-all duration-300 ease-in-out transform-gpu',
      'min-h-[1.2em] will-change-transform',
      className
    )}>
      {processedParts.map((part, index) => {
        if (part.type === 'math') {
          // 确保行内公式保持在inline元素内
          const Wrapper = part.displayMode ? 'div' : 'span';
          return (
            <Wrapper 
              key={index} 
              className={cn(
                part.displayMode ? "block-math-wrapper katex-display-wrapper" : "inline-math-wrapper katex-inline-fix",
                "layout-stable transition-all duration-300 ease-in-out", // 添加平滑过渡效果
                "will-change-transform transform-gpu" // 使用GPU加速
              )}
            >
              <RenderFormula content={part.content} displayMode={part.displayMode || false} />
            </Wrapper>
          );
        } else {
          return (
            <div 
              key={index} 
              className="markdown-html-part layout-stable transition-height"
              dangerouslySetInnerHTML={{ __html: part.content }} 
            />
          );
        }
      })}
    </div>
  );
};

export default MathRenderer; 