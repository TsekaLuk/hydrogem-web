import { useMemo, useEffect, useRef, memo } from 'react';
import { Code, Image as ImageIcon, FileText, ExternalLink, Binary } from 'lucide-react';
import { cn } from '@/lib/utils';
import { renderMarkdown } from '@/lib/markdown';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import 'katex/dist/katex.min.css'; // Import KaTeX styles

interface MessageContentProps {
  content: string;
  className?: string;
}

// Content type configuration for detecting and showing content type badges
const contentTypeConfigs = [
  {
    type: 'code',
    pattern: /```[\s\S]*?```/,
    icon: Code,
    label: '包含代码块',
    color: 'text-amber-500',
  },
  {
    type: 'math',
    pattern: /\$\$[\s\S]*?\$\$|\$[^$\n]+?\$/,
    icon: Binary,
    label: '包含数学公式',
    color: 'text-blue-500',
  },
  {
    type: 'image',
    pattern: /!\[.*?\]\(.*?\)/,
    icon: ImageIcon,
    label: '包含图片',
    color: 'text-green-500',
  },
  {
    type: 'link',
    pattern: /\[.*?\]\(https?:\/\/.*?\)|(https?:\/\/[^\s)]+)/,
    icon: ExternalLink,
    label: '包含链接',
    color: 'text-purple-500',
  },
  {
    type: 'document',
    pattern: /\[.*?\]\((?!https?:\/\/).*?\)/,
    icon: FileText,
    label: '包含文档',
    color: 'text-orange-500',
  },
];

function MessageContentComponent({ content, className }: MessageContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Detect content types to show appropriate badges
  const contentTypes = useMemo(() => {
    return contentTypeConfigs
      .filter(config => config.pattern.test(content))
      .map(config => config.type);
  }, [content]);

  // Parse and render the markdown content with KaTeX processing
  const renderedContent = useMemo(() => {
    return renderMarkdown(content);
  }, [content]);

  // 使用 useEffect 来确保 KaTeX 公式渲染得到正确处理
  useEffect(() => {
    // 如果需要进行特殊处理，可以在此处添加代码
    // 例如：在内容包含数学公式时重新渲染 KaTeX
    if (contentRef.current && contentTypes.includes('math')) {
      // KaTeX 自动已经在 renderMarkdown 中处理了
    }
  }, [renderedContent, contentTypes]);

  return (
    <div className={cn('relative group', className)}>
      {contentTypes.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {contentTypes.map((type) => {
            const typeConfig = contentTypeConfigs.find(t => t.type === type);
            if (!typeConfig) return null;
            const Icon = typeConfig.icon;
            
            return (
              <TooltipProvider key={type}>
                <Tooltip>
                  <TooltipTrigger>
                    <div className={cn(
                      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full',
                      'text-[10px] font-medium backdrop-blur-sm',
                      'bg-background/60 border border-border/40',
                      'shadow-sm transition-all duration-200 hover:scale-105'
                    )}>
                      <Icon className={cn('h-3 w-3', typeConfig.color)} />
                      <span className="capitalize">{type}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{typeConfig.label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      )}
      <div 
        ref={contentRef}
        className={cn(
          'prose prose-sm sm:prose-base dark:prose-invert max-w-none',
          'transition-all duration-200',
          'prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/30 prose-pre:shadow-sm',
          'prose-code:bg-muted/50 prose-code:border prose-code:border-border/30 prose-code:rounded-md prose-code:px-1 prose-code:py-0.5',
          'prose-img:rounded-lg prose-img:shadow-md',
          'prose-blockquote:border-l-4 prose-blockquote:border-blue-500/40 prose-blockquote:text-muted-foreground prose-blockquote:italic prose-blockquote:font-normal',
          // Add KaTeX specific styles
          'katex-styles'
        )}
        dangerouslySetInnerHTML={{ 
          __html: renderedContent
        }} 
      />
    </div>
  );
}

// 导出使用 memo 包装的 MessageContent 组件
export const MessageContent = memo(MessageContentComponent);