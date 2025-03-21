import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { WaterQualityParameter } from '@/types/parameters';
import { SearchService } from '@/services/search/search-service';
import { useMonitoringData } from '@/hooks/useMonitoringData';

/**
 * 搜索结果分组
 */
export interface SearchResultGroups {
  parameters: WaterQualityParameter[];
  devices: any[];
  areas: any[];
}

/**
 * 搜索上下文类型
 */
export interface SearchContextType {
  // 搜索查询
  searchQuery: string;
  // 是否正在搜索
  isSearching: boolean;
  // 搜索结果
  searchResults: SearchResultGroups;
  // 是否有搜索结果
  hasResults: boolean;
  // 设置搜索查询
  setSearchQuery: (query: string) => void;
  // 清除搜索
  clearSearch: () => void;
  // 执行搜索
  search: () => Promise<void>;
}

// 创建搜索上下文
const SearchContext = createContext<SearchContextType | undefined>(undefined);

/**
 * 搜索提供者属性
 */
interface SearchProviderProps {
  children: ReactNode;
}

/**
 * 搜索提供者组件
 */
export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  // 搜索查询状态
  const [searchQuery, setSearchQuery] = useState('');
  // 搜索中状态
  const [isSearching, setIsSearching] = useState(false);
  // 搜索结果状态
  const [searchResults, setSearchResults] = useState<SearchResultGroups>({
    parameters: [],
    devices: [],
    areas: [],
  });

  // 获取监控数据
  const { parameters, isLoading, error } = useMonitoringData();

  // 检查是否有结果
  const hasResults = 
    searchResults.parameters.length > 0 || 
    searchResults.devices.length > 0 || 
    searchResults.areas.length > 0;

  // 执行搜索
  const search = useCallback(async () => {
    if (!searchQuery.trim() || isLoading || error) {
      setSearchResults({
        parameters: [],
        devices: [],
        areas: [],
      });
      return;
    }

    setIsSearching(true);
    try {
      // 使用搜索服务执行搜索
      const results = await SearchService.search(searchQuery, {
        parameters,
        // 未来可以添加设备和区域数据
        devices: [],
        areas: [],
      });

      setSearchResults(results);
    } catch (error) {
      console.error('搜索出错:', error);
      setSearchResults({
        parameters: [],
        devices: [],
        areas: [],
      });
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, parameters, isLoading, error]);

  // 清除搜索
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults({
      parameters: [],
      devices: [],
      areas: [],
    });
  }, []);

  // 上下文值
  const contextValue: SearchContextType = {
    searchQuery,
    isSearching,
    searchResults,
    hasResults,
    setSearchQuery,
    clearSearch,
    search,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

/**
 * 使用搜索钩子
 */
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch必须在SearchProvider内部使用');
  }
  return context;
};

export default SearchContext; 