import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Button } from '@/components/ui/button';
import { Repeat } from 'lucide-react';
import { getMarkdownComponents } from './markdown-components';
import KatexRenderer from './KatexRenderer';
import KatexMarkdown from './KatexMarkdown';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';
import { Components } from 'react-markdown';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface MessageBubbleProps {
  content: string;
  timestamp: Date;
  isUser: boolean;
  isTyping?: boolean;
  isStreaming?: boolean;
  onReply?: () => void;
}

function MessageBubbleComponent({
  content,
  timestamp,
  isUser,
  isTyping,
  isStreaming = false,
  onReply
}: MessageBubbleProps) {
  const formattedTime = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestamp);

  // 增强的LaTeX检测函数，识别更多数学表达式
  const hasLatex = useMemo(() => {
    // 检查是否包含常见的LaTeX分隔符
    const hasDelimiters = /\$\$.+?\$\$|\$.+?\$|\\[\(\[].*?\\[\)\]]/s.test(content);
    if (hasDelimiters) return true;
    
    // 检查是否包含LaTeX命令
    const hasCommands = /\\[a-zA-Z]+(\{.*?\})*/.test(content);
    if (hasCommands) return true;
    
    // 检查是否包含积分表达式
    const hasIntegrals = /\\int|\\oint|\\iint|\\iiint|\\sum|\\prod/.test(content);
    if (hasIntegrals) return true;
    
    // 检查是否包含分数、根号等常见数学结构
    const hasMathStructures = /\\frac|\\sqrt|\\lim|\\infty|\\partial/.test(content);
    if (hasMathStructures) return true;
    
    // 检查是否包含微分符号
    const hasDifferentials = /\bd[xyz]\b|\\mathrm\{d[xyz]\}/.test(content);
    if (hasDifferentials) return true;
    
    // 检查是否包含希腊字母
    const hasGreekLetters = /\\(alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega)/i.test(content);
    
    return hasGreekLetters;
  }, [content]);

  return (
    <div className={cn(
      "group flex-1 relative flex", 
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] sm:max-w-[80%] max-w-[90%]", // Adjust max width on mobile
        "rounded-2xl py-3 px-3 sm:px-4 text-sm shadow-sm mb-0.5",
        isUser
          ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-tr-sm"
          : "bg-gradient-to-br from-background to-muted rounded-tl-sm",
        isTyping && !isUser ? 'pulse-bg' : ''
      )}>
        <div className={cn(
          'prose prose-sm dark:prose-invert max-w-none',
          'prose-p:leading-relaxed prose-pre:p-0',
          'prose-code:bg-background prose-code:rounded-md prose-code:p-0.5',
          'prose-pre:my-2',
          'katex-styles'
        )}>
          {hasLatex ? (
            <KatexMarkdown markdown={content} />
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={getMarkdownComponents()}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
        
        {/* 时间显示，放在气泡内部底部 */}
        <div className={cn(
          'text-xs opacity-70 mt-2 text-right',
          isUser ? 'text-white/70' : 'text-muted-foreground'
        )}>
          {formattedTime}
        </div>
      </div>
      
      {/* 重新生成回复按钮 */}
      {!isUser && !isStreaming && (
        <div className="flex ml-1 mt-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onReply}
                  className={cn(
                    'h-8 w-8 rounded-lg opacity-0 transition-opacity',
                    'group-hover:opacity-100 focus:opacity-100',
                    'bg-background/80 hover:bg-primary/10',
                    'border border-border/40 hover:border-primary/30',
                    'text-primary/80 hover:text-primary'
                  )}
                >
                  <Repeat className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>重新生成回复</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}

export const MessageBubble = React.memo(MessageBubbleComponent);