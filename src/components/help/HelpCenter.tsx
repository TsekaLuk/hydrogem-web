import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { HelpCategories } from './HelpCategories';
import { HelpContent } from './HelpContent';
import { HelpSearch } from './HelpSearch';
import { useHelpSearch } from '@/hooks/useHelpSearch';
import { useTranslation } from 'react-i18next';
import { KatexDemo } from '../chat/KatexDemo';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { searchQuery, searchResults, handleSearch } = useHelpSearch();
  const { t } = useTranslation(['common', 'help']);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-2xl font-semibold">{t('common:help.title')}</h1>
        <p className="text-muted-foreground">
          {t('common:help.description')}
        </p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('help:navigation.search')}
          className="pl-9"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {searchQuery ? (
        <HelpSearch results={searchResults} />
      ) : (
        <div className="grid gap-6 md:grid-cols-[250px_1fr] flex-grow">
          <HelpCategories
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <HelpContent category={selectedCategory} />
        </div>
      )}

      <Tabs defaultValue="general" className="w-full mt-auto pt-4">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="general">常见问题</TabsTrigger>
          <TabsTrigger value="usage">使用指南</TabsTrigger>
          <TabsTrigger value="math">数学公式</TabsTrigger>
        </TabsList>

        <TabsContent value="math" className="space-y-4">
          <KatexDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default HelpCenter;