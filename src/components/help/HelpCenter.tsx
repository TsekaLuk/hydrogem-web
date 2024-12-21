import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { HelpCategories } from './HelpCategories';
import { HelpContent } from './HelpContent';
import { HelpSearch } from './HelpSearch';
import { useHelpSearch } from '@/hooks/useHelpSearch';

export function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { searchQuery, searchResults, handleSearch } = useHelpSearch();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers to common questions and learn how to use our platform
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for help..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {searchQuery ? (
        <HelpSearch results={searchResults} />
      ) : (
        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <HelpCategories
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <HelpContent category={selectedCategory} />
        </div>
      )}
    </div>
  );
}