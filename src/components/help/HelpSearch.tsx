import { HelpArticle } from './HelpArticle';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface HelpSearchProps {
  results: any[];
}

export function HelpSearch({ results }: HelpSearchProps) {
  const { t } = useTranslation('help');

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('navigation.no_results', 'No results found')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((article) => (
        <Card key={article.id} className="p-6">
          <HelpArticle article={article} />
        </Card>
      ))}
    </div>
  );
}