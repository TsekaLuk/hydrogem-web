import { useState, useCallback, useMemo } from 'react';
import { HELP_ARTICLES } from '@/data/help-articles';

export function useHelpSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return HELP_ARTICLES.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    searchResults,
    handleSearch,
  };
}