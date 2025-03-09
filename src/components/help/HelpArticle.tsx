import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HelpArticle as HelpArticleType } from '@/types/help';
import { renderMarkdown } from '@/lib/markdown';
import { useTranslation } from 'react-i18next';

interface HelpArticleProps {
  article: HelpArticleType;
}

export function HelpArticle({ article }: HelpArticleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation(['common', 'help']);

  // Get translated article content
  const title = t(`help:articles.${article.id}.title`, article.title);
  const description = t(`help:articles.${article.id}.description`, article.description);
  const content = t(`help:articles.${article.id}.content`, article.content);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
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
        <div>
          <div 
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
          <div className="mt-4 text-sm text-muted-foreground">
            <p>{t('help:feedback.helpful')}</p>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => {}}>
                {t('help:feedback.yes')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => {}}>
                {t('help:feedback.no')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}