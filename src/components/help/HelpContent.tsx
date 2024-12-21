import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HELP_ARTICLES } from '@/data/help-articles';
import { HelpArticle } from './HelpArticle';
import { HelpFeedback } from './HelpFeedback';

interface HelpContentProps {
  category: string | null;
}

export function HelpContent({ category }: HelpContentProps) {
  const articles = category
    ? HELP_ARTICLES.filter(article => article.categoryId === category)
    : HELP_ARTICLES;

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4 pr-4">
        {articles.map((article) => (
          <Card key={article.id} className="p-6">
            <HelpArticle article={article} />
            <HelpFeedback articleId={article.id} />
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}