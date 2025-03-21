import React, { CSSProperties } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { cn } from '@/lib/utils';
import MathRenderer from './MathRenderer';
import type { Components } from 'react-markdown';

// 检测代码块中的LaTeX公式
function isKatexBlock(code: string): boolean {
  return code.trim().startsWith('\\begin{') || 
         code.trim().startsWith('\\[') || 
         /^\s*\\\w+/.test(code.trim());
}

// 创建一个类型安全的样式对象
const vscDarkPlusStyle: Record<string, CSSProperties | any> = {
  'code[class*="language-"]': {
    color: '#e3e3e3',
    background: 'none',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: 4,
    hyphens: 'none'
  },
  'pre[class*="language-"]': {
    color: '#e3e3e3',
    background: '#1E1E1E',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: 4,
    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em'
  },
  'comment': { color: '#6A9955' },
  'block-comment': { color: '#6A9955' },
  'prolog': { color: '#6A9955' },
  'doctype': { color: '#6A9955' },
  'cdata': { color: '#6A9955' },
  'punctuation': { color: '#D4D4D4' },
  'property': { color: '#9CDCFE' },
  'tag': { color: '#569CD6' },
  'boolean': { color: '#569CD6' },
  'number': { color: '#B5CEA8' },
  'constant': { color: '#9CDCFE' },
  'symbol': { color: '#F8C555' },
  'selector': { color: '#D7BA7D' },
  'attr-name': { color: '#9CDCFE' },
  'string': { color: '#CE9178' },
  'char': { color: '#CE9178' },
  'attr-value': { color: '#CE9178' },
  'builtin': { color: '#4EC9B0' },
  'inserted': { color: '#CE9178' },
  'operator': { color: '#D4D4D4' },
  'entity': { color: '#4EC9B0', cursor: 'help' },
  'url': { color: '#67CDCC' },
  'variable': { color: '#9CDCFE' },
  'atrule': { color: '#C586C0' },
  'keyword': { color: '#569CD6' },
  'function': { color: '#DCDCAA' },
  'regex': { color: '#D16969' },
  'important': { color: '#569CD6', fontWeight: 'bold' },
  'bold': { fontWeight: 'bold' },
  'italic': { fontStyle: 'italic' },
  'deleted': { color: '#CE9178', backgroundColor: 'rgba(255, 0, 0, 0.1)' },
};

// 自定义代码块组件
export function CodeBlock({ className, children }: { className?: string; children: React.ReactNode }) {
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
        style={vscDarkPlusStyle}
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
}

// 内联代码组件
export function InlineCode({ children }: { children: React.ReactNode }) {
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
}

// 内联代码渲染器组件
export function MarkdownInlineCode({ node, inline, className, children, ...props }: any) {
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

// 代码块渲染器组件
export function MarkdownCode({ node, inline, className, children, ...props }: any) {
  if (inline) {
    return <MarkdownInlineCode {...props}>{children}</MarkdownInlineCode>;
  }
  
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const content = String(children).replace(/\n$/, '');
  
  // 检查是否为LaTeX块
  if (language === 'math' || language === 'tex' || isKatexBlock(content)) {
    return <MathRenderer math={content} displayMode={true} />;
  }
  
  return (
    <div className="rounded-md overflow-hidden my-2">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlusStyle}
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
}

// 预格式化文本组件
export function MarkdownPre({ children }: any) {
  return <>{children}</>;
}

// 导出组件集合（供ReactMarkdown使用）
export function getMarkdownComponents(): Components {
  return {
    code: MarkdownCode,
    pre: MarkdownPre
  };
} 