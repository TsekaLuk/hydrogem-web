import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import MathRenderer from './MathRenderer';
import type { Components } from 'react-markdown';

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
  const content = React.isValidElement(children) ? children.props.children : String(children);
  
  // 检查是否为LaTeX块
  if (language === 'math' || language === 'tex' || isKatexBlock(content)) {
    return <MathRenderer math={content} displayMode={true} />;
  }
  
  return (
    <div className="rounded-md overflow-hidden my-2">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        wrapLines={true}
        showLineNumbers={language !== 'text'}
        customStyle={{ 
          margin: 0, 
          padding: '1rem', 
          fontSize: '0.875rem',
          borderRadius: '0.375rem',
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};

// 内联代码组件
export const InlineCode = ({ children }: { children: React.ReactNode }) => {
  const content = String(children);
  
  // 检查是否为内联LaTeX
  if (content.startsWith('\\(') && content.endsWith('\\)')) {
    const math = content.slice(2, -2);
    return <MathRenderer math={math} displayMode={false} />;
  }
  
  if (content.startsWith('$') && content.endsWith('$')) {
    const math = content.slice(1, -1);
    return <MathRenderer math={math} displayMode={false} />;
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
    const content = String(children).replace(/\n$/, '');
    
    if (inline) {
      const childContent = String(children);
      
      // 检查是否为内联LaTeX
      if (childContent.startsWith('\\(') && childContent.endsWith('\\)')) {
        const math = childContent.slice(2, -2);
        return <MathRenderer math={math} displayMode={false} />;
      }
      
      if (childContent.startsWith('$') && childContent.endsWith('$')) {
        const math = childContent.slice(1, -1);
        return <MathRenderer math={math} displayMode={false} />;
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
      return <MathRenderer math={content} displayMode={true} />;
    }
    
    return (
      <div className="rounded-md overflow-hidden my-2">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          wrapLines={true}
          showLineNumbers={language !== 'text'}
          customStyle={{ 
            margin: 0, 
            padding: '1rem', 
            fontSize: '0.875rem',
            borderRadius: '0.375rem',
          }}
          {...props}
        >
          {content}
        </SyntaxHighlighter>
      </div>
    );
  },
  pre({ children }) {
    return <>{children}</>;
  }
}; 