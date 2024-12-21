import { useMemo } from 'react';
import { Code, Image as ImageIcon, FileText, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { renderMarkdown } from '@/lib/markdown';
import { Tooltip } from '@/components/ui/tooltip';

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

const contentTypes: ContentType[] = [
  { type: 'code', icon: Code, color: 'text-amber-500', label: 'Code block' },
  { type: 'image', icon: ImageIcon, color: 'text-emerald-500', label: 'Image' },
  { type: 'link', icon: ExternalLink, color: 'text-blue-500', label: 'Link' },
  { type: 'file', icon: FileText, color: 'text-purple-500', label: 'File' },
];

export function MessageContent({ content, className }: MessageContentProps) {
  const contentTypes = useMemo(() => {
    const types = new Set<string>();
    if (content.includes('```')) types.add('code');
    if (content.includes('![')) types.add('image');
    if (content.includes('[') && content.includes('](')) types.add('link');
    if (content.includes('.pdf') || content.includes('.doc')) types.add('file');
    return Array.from(types);
  }, [content]);

  return (
    <div className={cn('relative group', className)}>
      {contentTypes.length > 0 && (
        <div className="mb-2 flex gap-2">
          {contentTypes.map((type) => {
            const typeConfig = contentTypes.find(t => t.type === type);
            if (!typeConfig) return null;
            const Icon = typeConfig.icon;
            
            return (
              <Tooltip key={type} content={typeConfig.label}>
                <div className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-1 rounded-full',
                  'text-xs font-medium bg-background/50',
                  'transition-all duration-200 hover:scale-105'
                )}>
                  <Icon className={cn('h-3.5 w-3.5', typeConfig.color)} />
                  <span className="capitalize">{type}</span>
                </div>
              </Tooltip>
            );
          })}
        </div>
      )}
      <div 
        className={cn(
          'prose prose-sm sm:prose-base dark:prose-invert max-w-none',
          'transition-all duration-200',
        )}
        dangerouslySetInnerHTML={{ 
          __html: renderMarkdown(content) 
        }} 
      />
    </div>
  );
}