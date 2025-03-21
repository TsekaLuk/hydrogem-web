import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from './input';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 搜索值变化时的回调函数 */
  onSearch: (value: string) => void;
  /** 防抖延迟时间(ms) */
  debounceTime?: number;
  /** 是否显示清除按钮 */
  showClear?: boolean;
  /** 搜索图标位置 */
  iconPosition?: 'left' | 'right';
  /** 输入框大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 容器类名 */
  containerClassName?: string;
  /** 搜索按钮类名 */
  searchButtonClassName?: string;
  /** 是否显示搜索按钮 */
  showSearchButton?: boolean;
  /** 搜索按钮上显示的文本 */
  searchButtonText?: string;
  /** 使用回车键触发搜索 */
  searchOnEnter?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({
    onSearch,
    debounceTime = 300,
    showClear = true,
    iconPosition = 'left',
    size = 'md',
    className,
    containerClassName,
    searchButtonClassName,
    showSearchButton = false,
    searchButtonText = '搜索',
    searchOnEnter = false,
    placeholder = '搜索...',
    value,
    onChange,
    ...props
  }, ref) => {
    const [inputValue, setInputValue] = useState<string>(value as string || '');
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRef = useMergeRefs(ref, inputRef);

    // 尺寸映射
    const sizeClasses = {
      sm: 'h-8 text-xs px-2',
      md: 'h-10 text-sm px-3',
      lg: 'h-12 text-base px-4'
    };

    // 防抖处理搜索
    const debouncedSearch = useCallback((searchValue: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        onSearch(searchValue);
      }, debounceTime);
    }, [onSearch, debounceTime]);

    // 处理输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      
      if (onChange) {
        onChange(e);
      }

      if (!searchOnEnter) {
        debouncedSearch(newValue);
      }
    };

    // 处理清除按钮点击
    const handleClear = () => {
      setInputValue('');
      onSearch('');
      
      // 聚焦回输入框
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // 处理回车键搜索
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (searchOnEnter && e.key === 'Enter') {
        e.preventDefault();
        onSearch(inputValue);
      }
    };

    // 处理搜索按钮点击
    const handleSearchClick = () => {
      onSearch(inputValue);
    };

    // 当外部value变化时更新内部状态
    useEffect(() => {
      if (value !== undefined && value !== inputValue) {
        setInputValue(value as string);
      }
    }, [value]);

    // 清理定时器
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    return (
      <div 
        className={cn(
          "relative flex items-center w-full",
          containerClassName
        )}
      >
        {iconPosition === 'left' && (
          <Search 
            className={cn(
              "absolute text-muted-foreground",
              size === 'sm' ? 'h-3.5 w-3.5 left-2' : 
              size === 'md' ? 'h-4 w-4 left-3' : 
              'h-5 w-5 left-4'
            )}
          />
        )}

        <Input
          ref={mergedRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={cn(
            sizeClasses[size],
            iconPosition === 'left' && (
              size === 'sm' ? 'pl-7' : 
              size === 'md' ? 'pl-9' : 
              'pl-11'
            ),
            (showClear && inputValue) && (
              size === 'sm' ? 'pr-7' : 
              size === 'md' ? 'pr-9' : 
              'pr-11'
            ),
            className
          )}
          placeholder={placeholder}
          {...props}
        />

        {(showClear && inputValue) && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className={cn(
              "absolute p-0",
              size === 'sm' ? 'h-4 w-4 right-2' : 
              size === 'md' ? 'h-5 w-5 right-3' : 
              'h-6 w-6 right-4'
            )}
          >
            <X 
              className={cn(
                "text-muted-foreground",
                size === 'sm' ? 'h-3 w-3' : 
                size === 'md' ? 'h-4 w-4' : 
                'h-5 w-5'
              )}
            />
            <span className="sr-only">清除搜索</span>
          </Button>
        )}

        {iconPosition === 'right' && !inputValue && (
          <Search 
            className={cn(
              "absolute text-muted-foreground",
              size === 'sm' ? 'h-3.5 w-3.5 right-2' : 
              size === 'md' ? 'h-4 w-4 right-3' : 
              'h-5 w-5 right-4'
            )}
          />
        )}

        {showSearchButton && (
          <Button
            type="button"
            onClick={handleSearchClick}
            className={cn("ml-2", searchButtonClassName)}
            size={size === 'sm' ? 'sm' : size === 'md' ? 'default' : 'lg'}
          >
            {searchButtonText}
          </Button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

// 合并多个ref的辅助函数
function useMergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return useCallback((value: T) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<T>).current = value;
      }
    });
  }, [refs]);
}

export default SearchInput; 