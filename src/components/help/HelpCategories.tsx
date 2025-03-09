import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HELP_CATEGORIES } from '@/data/help-categories';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface HelpCategoriesProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

export function HelpCategories({ selectedCategory, onSelectCategory }: HelpCategoriesProps) {
  const { t } = useTranslation('help');
  
  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-2 pr-4">
        {HELP_CATEGORIES.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className={cn(
              'w-full justify-start',
              selectedCategory === category.id && 'bg-accent'
            )}
            onClick={() => onSelectCategory(category.id)}
          >
            <category.icon className="mr-2 h-4 w-4" />
            {t(`categories.${category.id}`, category.name)}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}