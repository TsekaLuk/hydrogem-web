import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HelpArticle } from './HelpArticle';
import { HelpFeedback } from './HelpFeedback';
import { HelpArticle as HelpArticleType } from '@/types/help';

interface HelpSearchProps {
  results: HelpArticleType[];
}

export function HelpSearch({ results }: HelpSearchProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No results found. Try adjusting your search terms.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4 pr-4">
        {results.map((article) => (
          <Card key={article.id} className="p-6">
            <HelpArticle article={article} />
            <HelpFeedback articleId={article.id} />
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}