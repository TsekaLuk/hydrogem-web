import React, { useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useSearch } from '@/contexts/search-context';
import SearchInput from '@/components/ui/search-input';
import SearchResults from '@/components/search/SearchResults';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * 搜索抽屉属性
 */
interface SearchDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 搜索抽屉组件
 */
const SearchDrawer: React.FC<SearchDrawerProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const { searchQuery, setSearchQuery, search, clearSearch } = useSearch();

  // 处理搜索输入变化
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // 在搜索查询变化时执行搜索
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        search();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, open, search]);

  // 当抽屉关闭时清除搜索
  useEffect(() => {
    if (!open) {
      clearSearch();
    }
  }, [open, clearSearch]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle>{t('search.globalSearch')}</DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4">
            <SearchInput
              value={searchQuery}
              onSearch={handleSearchChange}
              placeholder={t('search.searchPlaceholder')}
              autoFocus
              debounceTime={300}
              showClear
              iconPosition="left"
              className="w-full"
            />
          </div>
        </DrawerHeader>
        <div className="p-4 overflow-auto">
          <SearchResults />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchDrawer; 