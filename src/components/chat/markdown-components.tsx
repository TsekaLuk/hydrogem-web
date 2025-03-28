import React, { ReactElement, useState } from 'react';
import { cn } from '@/lib/utils';
import MathRenderer from './MathRenderer';
import CodeHighlighter from './CodeHighlighter';
import type { Components } from 'react-markdown';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdvancedCodeBlock } from '@/cuicui/application-ui/code/advanced-code-block';

// 检测代码块中的LaTeX公式
const isKatexBlock = (code: string): boolean => {
  return code.trim().startsWith('\\begin{') || 
         code.trim().startsWith('\\[') || 
         /^\s*\\\w+/.test(code.trim());
};

// 自定义代码块组件
export const CodeBlock = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const [copied, setCopied] = useState(false);
  
  // 使用类型断言以确保TypeScript了解props的类型
  const content = React.isValidElement(children) 
    ? (children as ReactElement<{ children: string }>).props.children 
    : String(children);
  
  // 检查是否为LaTeX块
  if (language === 'math' || language === 'tex' || isKatexBlock(content)) {
    return <MathRenderer content={content} displayMode={true} />;
  }
  
  // 使用高级代码块组件
  const isDarkMode = typeof window !== 'undefined' 
    ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
    : false;
    
  return (
    <AdvancedCodeBlock 
      code={content} 
      lang={language as any || "text"} 
      fileName={language ? `${language} 代码` : undefined}
      theme={isDarkMode ? "github-dark" : "github-light"}
    />
  );
};

// 内联代码组件
export const InlineCode = ({ children }: { children: React.ReactNode }) => {
  const content = React.isValidElement(children) 
    ? (children as ReactElement<{ children: string }>).props.children 
    : String(children);
  
  // 检查是否为内联LaTeX
  if (content.startsWith('\\(') && content.endsWith('\\)')) {
    const math = content.slice(2, -2);
    return <MathRenderer content={math} displayMode={false} />;
  }
  
  if (content.startsWith('$') && content.endsWith('$')) {
    const math = content.slice(1, -1);
    return <MathRenderer content={math} displayMode={false} />;
  }
  
  return (
    <code className={cn(
      'px-1 py-0.5 rounded-sm font-mono text-sm',
      'bg-muted text-foreground'
    )}>
      {children}
    </code>
  );
};

// 定义自定义组件
export const components: Components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    
    // 使用安全的方式转换children内容
    const content = Array.isArray(children) 
      ? children.join('').replace(/\n$/, '')
      : String(children).replace(/\n$/, '');
    
    if (inline) {
      // 使用安全的方式获取内容
      const childContent = Array.isArray(children) ? children.join('') : String(children);
      
      // 检查是否为内联LaTeX
      if (childContent.startsWith('\\(') && childContent.endsWith('\\)')) {
        const math = childContent.slice(2, -2);
        return <MathRenderer content={math} displayMode={false} />;
      }
      
      if (childContent.startsWith('$') && childContent.endsWith('$')) {
        const math = childContent.slice(1, -1);
        return <MathRenderer content={math} displayMode={false} />;
      }
      
      return (
        <code className={cn(
          'px-1 py-0.5 rounded-sm font-mono text-sm',
          'bg-muted text-foreground'
        )} {...props}>
          {children}
        </code>
      );
    }
    
    // 检查是否为LaTeX块
    if (language === 'math' || language === 'tex' || isKatexBlock(content)) {
      return <MathRenderer content={content} displayMode={true} />;
    }
    
    // 使用CodeBlock组件，保持一致性
    return <CodeBlock className={className}>{content}</CodeBlock>;
  },
  pre({ children }) {
    return <>{children}</>;
  }
}; 