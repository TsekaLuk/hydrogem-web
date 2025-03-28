import React, { memo, useRef, useEffect, useState } from 'react';
import { Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { Brain, Copy, Check } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

interface StreamingMessageProps {
  message: Message;
  isLatestActive?: boolean;
  onReply?: () => void;
  totalBranches?: number;
  currentBranch?: number;
  onSwitchBranch?: (branchNumber: number) => void;
}

/**
 * 专门优化的流式消息组件
 * 使用memo和useRef来最小化渲染
 */
const StreamingMessage: React.FC<StreamingMessageProps> = memo(({ 
  message, 
  isLatestActive = true,
  onReply,
  totalBranches = 1,
  currentBranch = 1,
  onSwitchBranch
}) => {
  const contentRef = useRef(message.content);
  const prevContentRef = useRef('');
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const stableContentCountRef = useRef<number>(0);
  const [copied, setCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const { t } = useTranslation();
  
  // 使用更可靠的方法检测打字完成状态
  useEffect(() => {
    // 记录上次内容更新的时间
    if (prevContentRef.current !== message.content) {
      lastUpdateTimeRef.current = Date.now();
      prevContentRef.current = message.content;
      stableContentCountRef.current = 0; // 重置稳定计数器
    } else {
      stableContentCountRef.current++; // 内容稳定，增加计数器
    }
    
    // 设置计时器，定期检查是否还在接收新内容
    const checkInterval = 1000; // 1秒检查一次
    const typingTimeout = 6000; // 6秒无更新视为完成输入
    
    const intervalId = setInterval(() => {
      const timeSinceLastUpdate = Date.now() - lastUpdateTimeRef.current;
      
      // 基于内容长度、稳定性和时间的动态超时策略
      const hasMathFormula = /((\$\$|\$|\\begin\{|\\\[|\\\().*?(\$\$|\$|\\end\{|\\\]|\\\))|\\[a-zA-Z]+\{[^}]*\}|\\(int|sum|prod|frac|sqrt))/s.test(message.content);
      const minContentLength = 20; // 最小内容长度阈值
      const isContentSubstantial = message.content.trim().length > minContentLength;

      // 动态超时 - 数学公式或长内容需要更长时间
      const dynamicTimeout = hasMathFormula || isContentSubstantial 
        ? Math.max(7000, typingTimeout) // 数学公式或长内容至少7秒
        : typingTimeout; // 普通内容6秒

      // 至少观察到3次稳定的内容，且超过动态超时
      const isStableEnough = stableContentCountRef.current >= 3;
      
      // 如果内容不为空且长时间未更新且稳定，认为打字已完成
      if (message.content.trim().length > 0 && (
        (timeSinceLastUpdate > dynamicTimeout && isStableEnough) || 
        timeSinceLastUpdate > dynamicTimeout * 2 // 绝对超时，无论稳定性
      )) {
        // 在设置isTyping为false之前，确保内容已经稳定
        if (message.content === prevContentRef.current) {
          setIsTyping(false);
          clearInterval(intervalId); // 停止检查
        }
      } else if (message.content.trim().length === 0 || timeSinceLastUpdate <= dynamicTimeout) {
        setIsTyping(true);
      }
    }, checkInterval);
    
    return () => clearInterval(intervalId);
  }, [message.content]);

  // 添加防抖延迟处理，通过对特定情况的分析，判断高级渲染时机
  useEffect(() => {
    // 如果内容中有潜在的数学公式，特殊处理渲染节奏
    const hasPotentialMathFormula = /((\$\$|\$|\\begin\{|\\\[|\\\().*?(\$\$|\$|\\end\{|\\\]|\\\))|\\[a-zA-Z]+\{[^}]*\}|\\(int|sum|prod|frac|sqrt))/s.test(message.content);
    
    if (hasPotentialMathFormula) {
      // 数学公式接收延长的打字状态，确保公式完整
      if (prevContentRef.current === message.content && message.content.length > 0) {
        // 数学公式需要更长的"冷却期"才认为已完成 - 10秒
        const timeSinceLastUpdate = Date.now() - lastUpdateTimeRef.current;
        if (timeSinceLastUpdate > 10000) {  // 10秒无更新时视为已完成
          setIsTyping(false);
        }
      }
    }
  }, [message.content]);

  // 优化的打字完成检测逻辑（使用单个useEffect，减少渲染和计算开销）
  useEffect(() => {
    // 更新内容引用 - 合并多个内容相关的副作用到一个useEffect中
    contentRef.current = message.content;
    
    // 记录上次内容更新的时间
    if (prevContentRef.current !== message.content) {
      lastUpdateTimeRef.current = Date.now();
      prevContentRef.current = message.content;
      stableContentCountRef.current = 0; // 重置稳定计数器
    } else {
      stableContentCountRef.current++; // 内容稳定，增加计数器
    }
    
    // 使用setTimeout而不是setInterval，避免潜在的堆叠调用
    const timerId = setTimeout(() => {
      const timeSinceLastUpdate = Date.now() - lastUpdateTimeRef.current;
      const contentLength = message.content.trim().length;
      
      // 简化数学公式检测 - 使用基本检查而不是复杂正则
      const hasMathContent = message.content.includes('$') || 
                             message.content.includes('\\begin') || 
                             message.content.includes('\\frac');
      
      // 简化动态超时逻辑
      let timeout = 3000; // 基础超时：3秒
      
      // 根据内容长度和内容类型调整超时，但设置上限
      if (contentLength > 300) timeout += 1000;
      if (contentLength > 800) timeout += 1000;
      if (hasMathContent) timeout += 1500;
      
      // 绝对最大超时为7秒
      const maxTimeout = 7000;
      
      // 检查是否应该结束打字状态
      const shouldEndTyping = 
        (contentLength > 0 && timeSinceLastUpdate > timeout && 
         stableContentCountRef.current >= 2) || 
        (timeSinceLastUpdate > maxTimeout);
      
      // 只在状态需要变化时才调用setState，减少不必要的渲染
      if (shouldEndTyping && isTyping) {
        setIsTyping(false);
      } else if (!shouldEndTyping && !isTyping && contentLength > 0) {
        setIsTyping(true);
      }
    }, 800); // 使用较长的检查间隔，减少频繁检查
    
    // 清理函数
    return () => clearTimeout(timerId);
  }, [message.content, isTyping]);

  // 更新内容引用
  useEffect(() => {
    contentRef.current = message.content;
  }, [message.content]);
  
  // 复制内容到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      
      // 3秒后重置复制状态
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  // 流式消息布局与非流式保持一致
  return (
    <div className="flex gap-3 mb-6 group transition-opacity px-2 py-1">
      {/* AI头像 */}
      <div className="flex flex-col items-center gap-1 pr-2 sm:pr-2 pr-1">
        <div className={cn(
          "ai-avatar-container",
          isLatestActive ? "ai-avatar-floating" : ""
        )}>
          <div className="ai-avatar-ring" />
          <Avatar className={cn(
            'h-9 w-9 sm:h-10 sm:w-10 rounded-full transition-all shrink-0',
            'bg-gradient-to-br from-blue-600/20 via-indigo-500/30 to-blue-400/20 text-blue-600 dark:text-blue-400 border-2 border-blue-500/30',
            'flex items-center justify-center relative overflow-visible',
            'shadow-sm ai-avatar-inner'
          )}>
            <div className="relative flex items-center justify-center">
              <div className={cn(
                "absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 via-indigo-500/40 to-purple-500/30",
                isTyping ? "animate-pulse opacity-100" : "opacity-70"
              )} />
              <div className="relative z-10 flex items-center justify-center">
                <Brain className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
            {isLatestActive && isTyping && <div className="ai-status-indicator" />}
          </Avatar>
        </div>
        <div className={cn(
          "text-[10px] font-medium px-2 py-0.5 rounded-full",
          "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 dark:text-blue-400"
        )}>
          {t('agent.name', '玑衡')}
        </div>
      </div>

      {/* 消息气泡布局 */}
      <div className="flex-1 markdown-content-wrapper layout-stable transition-all duration-300">
        <MessageBubble
          content={message.content}
          timestamp={message.timestamp}
          isUser={false}
          isTyping={isTyping}
          isStreaming={true}
          onRegenerate={!isTyping ? onReply : undefined}
          totalBranches={totalBranches}
          currentBranch={currentBranch}
          onSwitchBranch={onSwitchBranch}
        />
      </div>
      
      {/* 复制按钮 - 仅当消息完成时显示 */}
      {!isTyping && message.content.trim().length > 0 && (
        <div className="flex flex-col ml-1 mt-1 gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={copyToClipboard}
                  className={cn(
                    'h-8 w-8 rounded-lg opacity-0 transition-opacity',
                    'group-hover:opacity-100 focus:opacity-100',
                    'bg-background/80 hover:bg-primary/10',
                    'border border-border/40 hover:border-primary/30',
                    'text-primary/80 hover:text-primary'
                  )}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? t('chat.copied') : t('chat.copyContent')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}, (prevProps: StreamingMessageProps, nextProps: StreamingMessageProps) => {
  // 改进的比较函数，更智能地决定何时重新渲染
  const prevContent = prevProps.message.content;
  const nextContent = nextProps.message.content;
  
  // 如果内容完全相同，不重新渲染
  if (prevContent === nextContent) return true;
  
  // 更健壮的数学公式检测 - 包括更多的LaTeX标记
  const mathRegex = /(\$|\\\(|\\\[|\\begin\{|\\end\{|\\\]|\\\)|\\[a-zA-Z]+(\{|\[|\()|\\mbox|\\text|\\mathbb|\\mathbf|\\mathcal|\\frac|\\sum|\\int|\\lim|\\infty)/s;
  const hasMathContent = mathRegex.test(nextContent);
  
  // 如果包含数学公式，使用更保守的更新策略
  if (hasMathContent) {
    // 只有当内容有显著变化时才更新
    const diffLength = nextContent.length - prevContent.length;
    if (diffLength > 10 || diffLength < 0) {
      return false; // 有较大变化时更新
    }
    
    // 检查最近添加的是否包含数学标记
    if (diffLength > 0) {
      const newContent = nextContent.slice(prevContent.length);
      return !mathRegex.test(newContent); // 如果新增内容包含数学标记，则更新
    }
    
    return true; // 其他情况下保持不变
  }
  
  // 检查是否有新段落或换行符 - 这些需要立即更新
  const hasNewParagraph = nextContent.split('\n').length > prevContent.split('\n').length;
  if (hasNewParagraph) {
    return false; // 有新段落时立即渲染
  }
  
  // 如果内容增长显著，始终渲染
  if (nextContent.length - prevContent.length > 5) {
    return false;
  }
  
  // 如果是短增量更新（1-5个字符），且不包含特殊标记，可以合并更新以减少渲染次数
  if (nextContent.length > prevContent.length) {
    const addedPart = nextContent.slice(prevContent.length);
    
    // 只有纯文本且没有特殊字符时才延迟更新
    if (addedPart.length <= 5 && !/[#*`_~<>{}[\]()$\\]/.test(addedPart)) {
      return true; // 短纯文本增量，等待更多内容后再更新
    }
  }
  
  // 默认行为：有任何变化就更新
  return false;
});

export default StreamingMessage;
