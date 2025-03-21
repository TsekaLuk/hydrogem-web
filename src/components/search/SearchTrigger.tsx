import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Keyboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SearchDrawer from './SearchDrawer';
import { cn } from '@/lib/utils';

/**
 * 搜索触发器属性
 */
interface SearchTriggerProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  showKeyboardShortcut?: boolean;
  shortcutKey?: string;
}

/**
 * 搜索触发器组件
 */
const SearchTrigger: React.FC<SearchTriggerProps> = ({
  className = '',
  variant = 'outline',
  showKeyboardShortcut = true,
  shortcutKey = 'k',
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // 监听键盘快捷键
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 检查是否按下 Ctrl/Cmd + 指定快捷键
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === shortcutKey.toLowerCase()) {
        event.preventDefault();
        setIsOpen(true);
      }
      
      // 按下ESC键关闭搜索
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcutKey, isOpen]);

  return (
    <>
      <Button
        variant={variant}
        size="sm"
        className={cn(
          "gap-2 rounded-full transition-all duration-200 hover:shadow-sm", 
          isOpen && "ring-2 ring-primary/20",
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="text-sm font-medium">{t('search.search')}</span>
        {showKeyboardShortcut && (
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted/80 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">
              {navigator.platform.indexOf('Mac') === 0 ? '⌘' : 'Ctrl'}
            </span>
            <span className="text-xs">{shortcutKey.toUpperCase()}</span>
          </kbd>
        )}
      </Button>

      <SearchDrawer open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default SearchTrigger; 