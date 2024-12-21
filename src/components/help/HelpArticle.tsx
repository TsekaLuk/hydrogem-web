import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HelpArticle as HelpArticleType } from '@/types/help';
import { renderMarkdown } from '@/lib/markdown';

interface HelpArticleProps {
  article: HelpArticleType;
}

export function HelpArticle({ article }: HelpArticleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium">{article.title}</h3>
          <p className="text-sm text-muted-foreground">{article.description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div 
          className="prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
        />
      )}
    </div>
  );
}