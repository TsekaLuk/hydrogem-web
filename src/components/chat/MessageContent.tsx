import { useMemo } from 'react';
import { Code, Image as ImageIcon, FileText, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { renderMarkdown } from '@/lib/markdown';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MessageContentProps {
  content: string;
  className?: string;
}

interface ContentType {
  type: 'text' | 'code' | 'image' | 'link' | 'file';
  icon: typeof Code;
  color: string;
  label: string;
}

const contentTypeConfigs: ContentType[] = [
  { type: 'code', icon: Code, color: 'text-amber-500', label: 'Code block' },
  { type: 'image', icon: ImageIcon, color: 'text-emerald-500', label: 'Image' },
  { type: 'link', icon: ExternalLink, color: 'text-blue-500', label: 'Link' },
  { type: 'file', icon: FileText, color: 'text-purple-500', label: 'File' },
];

export function MessageContent({ content, className }: MessageContentProps) {
  const contentTypes = useMemo(() => {
    const types = new Set<'text' | 'code' | 'image' | 'link' | 'file'>();
    if (content.includes('```')) types.add('code');
    if (content.includes('![')) types.add('image');
    if (content.includes('[') && content.includes('](')) types.add('link');
    if (content.includes('.pdf') || content.includes('.doc')) types.add('file');
    return Array.from(types);
  }, [content]);

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
        className={cn(
          'prose prose-sm sm:prose-base dark:prose-invert max-w-none',
          'transition-all duration-200',
          'prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/30 prose-pre:shadow-sm',
          'prose-code:bg-muted/50 prose-code:border prose-code:border-border/30 prose-code:rounded-md prose-code:px-1 prose-code:py-0.5',
          'prose-img:rounded-lg prose-img:shadow-md',
          'prose-blockquote:border-l-4 prose-blockquote:border-blue-500/40 prose-blockquote:text-muted-foreground prose-blockquote:italic prose-blockquote:font-normal'
        )}
        dangerouslySetInnerHTML={{ 
          __html: renderMarkdown(content) 
        }} 
      />
    </div>
  );
}