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
  
  // 首先处理所有块级公式和特殊格式
  const blockMathRegex = /(\$\$[\s\S]*?\$\$)|(\\[\s\n]*\[[\s\S]*?\\[\s\n]*\])|(\\[\s\n]*\([\s\S]*?\\[\s\n]*\))|(\\begin\{[^}]+\}[\s\S]*?\\end\{[^}]+\})/g;
  let blockMatch;
  let tempContent = content;
  let blockMatches: {index: number, match: string, isDisplay: boolean}[] = [];
  
  // 先提取所有块级公式
  while ((blockMatch = blockMathRegex.exec(content)) !== null) {
    const formula = blockMatch[0];
    const isDisplayMode = formula.startsWith('$$') || 
                        formula.startsWith('\\[') || 
                        /^\\begin\{(equation|align|gather|multline|cases|array|matrix|bmatrix|pmatrix|vmatrix)\*?\}/.test(formula);
    blockMatches.push({
      index: blockMatch.index,
      match: formula,
      isDisplay: isDisplayMode
    });
    
    // 更新currentIndex跟踪匹配过程
    currentIndex = blockMathRegex.lastIndex;
  }
  
  // 然后处理行内公式 $...$
  const inlineMathRegex = /\$([^\$\n]+?)\$/g;
  let inlineMatch;
  let allMatches = [...blockMatches];
  
  // 提取所有行内公式，但排除块级公式中的内容
  while ((inlineMatch = inlineMathRegex.exec(content)) !== null) {
    const formula = inlineMatch[0];
    const matchIndex = inlineMatch.index;
    
    // 检查是否在块级公式内部
    let isInsideBlock = false;
    for (const block of blockMatches) {
      if (matchIndex > block.index && matchIndex < block.index + block.match.length) {
        isInsideBlock = true;
        break;
      }
    }
    
    if (!isInsideBlock) {
      allMatches.push({
        index: matchIndex,
        match: formula,
        isDisplay: false
      });
    }
  }
  
  // 对所有匹配按索引排序
  allMatches.sort((a, b) => a.index - b.index);
  
  // 根据排序后的匹配构建分割结果
  let lastIndex = 0;
  for (const match of allMatches) {
    // 添加公式前的文本
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index),
        displayMode: false
      });
    }
    
    // 添加公式
    const formula = match.match;
    parts.push({
      type: 'math',
      content: extractTexContent(formula),
      displayMode: match.isDisplay
    });
    
    lastIndex = match.index + formula.length;
  }
  
  // 添加剩余的文本
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex),
      displayMode: false
    });
  }
  
  return parts;
};

// 渲染单个公式
const RenderFormula = React.memo(({ content, displayMode }: { content: string; displayMode: boolean }) => {
  const [error, setError] = useState<string | null>(null);
  
  // 使用useMemo缓存渲染结果，减少重复计算
  const renderedFormula = React.useMemo(() => {
    try {
      return katex.renderToString(content, {
        displayMode: displayMode,
        throwOnError: false,
        strict: false,
        trust: true,
        output: 'html',
        macros: {
          '\\vec': '\\mathbf',
          '\\mat': '\\mathbf',
          // 仅包含最常用的宏，减少处理开销
          '\\R': '\\mathbb{R}',
          '\\N': '\\mathbb{N}',
          '\\Z': '\\mathbb{Z}',
          '\\d': '\\mathrm{d}',
        },
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  }, [content, displayMode]);
  
  if (error) {
    return <span className="math-error">Error rendering math: {error}</span>;
  }
  
  const Element = displayMode ? 'div' : 'span';
  
  return (
    <Element
      className={cn(
        'math-renderer',
        displayMode 
          ? 'math-display katex-display-wrapper' 
          : 'math-inline katex-inline-fix',
        displayMode ? 'block' : 'inline'
      )}
      dangerouslySetInnerHTML={{
        __html: renderedFormula as string
      }}
    />
  );
});

export const MathRenderer = React.memo(({ 
  content,
  displayMode = false,
  className = '',
}: MathRendererProps) => {
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
});

// Specialized renderer optimized for message bubbles
export const MathRendererForMessages = React.memo(({
  content,
  displayMode = false,
  className = '',
}: MathRendererProps) => {
  // 检测内容是否为纯数学公式 - 使用简单的条件检查
  const isPureMathFormula = (
    (content.startsWith('$$') && content.endsWith('$$')) ||
    (content.startsWith('$') && content.endsWith('$')) ||
    /^\\[\s\n]*\([\s\S]*?\\[\s\n]*\)$/.test(content) ||  // \(...\) 格式
    /^\\[\s\n]*\[[\s\S]*?\\[\s\n]*\]$/.test(content) ||  // \[...\] 格式 
    content.trim().startsWith('\\begin{')
  );
  
  // 如果整个内容就是一个公式，根据公式类型决定显示模式
  if (isPureMathFormula) {
    const texContent = extractTexContent(content);
    // 只有明确是块级公式的才用displayMode=true渲染
    const isBlockMath = 
      content.startsWith('$$') || 
      /^\\[\s\n]*\[/.test(content) || 
      content.trim().startsWith('\\begin{');
    
    return (
      <div className={cn(
        "message-formula-container", 
        isBlockMath ? "block" : "inline"
      )}>
        <RenderFormula 
          content={texContent} 
          displayMode={isBlockMath} 
        />
      </div>
    );
  }

  // 使用React.useMemo优化计算
  const parts = React.useMemo(() => splitContent(content), [content]);
  
  // 改进状态管理，减少重渲染次数
  const [processedParts, setProcessedParts] = useState<Array<{
    type: 'math' | 'html';
    content: string;
    displayMode?: boolean;
  }>>(parts.map(part => part.type === 'math' 
    ? { type: 'math', content: part.content, displayMode: part.displayMode } 
    : { type: 'html', content: part.content }
  ));

  // 优化useEffect以减少流式更新过程中的负载
  useEffect(() => {
    let isMounted = true;
    let debounceTimer: NodeJS.Timeout | null = null;
    
    const processTextParts = async () => {
      // 清除之前的定时器
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      // 对于很短的内容或流式更新中的内容，延迟处理以提高性能
      const shouldDelay = content.length < 20 || processedParts.length > 0;
      
      // 设置较长的防抖时间，减少渲染频率
      debounceTimer = setTimeout(async () => {
        if (!isMounted) return;
        
        try {
          // 对parts进行批量处理
          const processed = await Promise.all(
            parts.map(async part => {
              // 数学部分保持不变
              if (part.type === 'math') {
                return { type: 'math' as const, content: part.content, displayMode: part.displayMode };
              }
              
              // 对于文本部分，采用更简单的处理方式
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
      }, shouldDelay ? 150 : 30); // 更长的防抖时间
    };
    
    processTextParts();
    
    // 组件卸载时清理
    return () => {
      isMounted = false;
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [parts, content.length]);
  
  return (
    <div className={cn(
      'math-content message-math-content',
      className
    )}>
      {processedParts.map((part, index) => {
        if (part.type === 'math') {
          // 确保行内公式保持在inline元素内
          const isBlock = part.displayMode === true;
          const Wrapper = isBlock ? 'div' : 'span';
          return (
            <Wrapper 
              key={index} 
              className={cn(
                isBlock 
                  ? "block-math-wrapper katex-display-wrapper block" 
                  : "inline-math-wrapper katex-inline-fix inline",
                isBlock ? "" : "math-inline" // 额外添加math-inline类
              )}
            >
              <RenderFormula content={part.content} displayMode={isBlock} />
            </Wrapper>
          );
        } else {
          // 对于HTML内容
          // 移除可能导致错误解析为标题标签的内容
          let sanitizedContent = part.content;
          // 将可能会被错误渲染为标题的内容如：饱和溶解氧 替换处理
          sanitizedContent = sanitizedContent.replace(/<h([1-6])[^>]*>([^<]*)<\/h\1>/g, '<span class="text-content">$2</span>');
          
          return (
            <React.Fragment key={index}>
              <span 
                className="markdown-html-part inline-text"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }} 
              />
            </React.Fragment>
          );
        }
      })}
    </div>
  );
});

export default MathRenderer; 