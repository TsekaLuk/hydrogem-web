import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useCallback, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export function LanguageToggle() {
  const { i18n } = useTranslation();

  // 组件挂载时确保语言设置与存储一致
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleLanguageChange = useCallback(async (code: string) => {
    try {
      console.log('Changing language to:', code);
      console.log('Current language:', i18n.language);
      
      await i18n.changeLanguage(code);
      
      console.log('Language changed successfully');
      console.log('New language:', i18n.language);
      
      // 强制重新渲染所有使用翻译的组件
      window.dispatchEvent(new Event('languageChanged'));
      
      // 触发布局调整事件
      window.dispatchEvent(new Event('layoutAdjust'));
      
      // 确保语言偏好被保存
      localStorage.setItem('i18nextLng', code);
      document.documentElement.lang = code;
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }, [i18n]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          aria-label="Change language"
        >
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map(({ code, name, flag }) => {
          const isActive = i18n.language?.startsWith(code);
          return (
            <DropdownMenuItem
              key={code}
              onClick={() => !isActive && handleLanguageChange(code)}
              className={`flex items-center gap-2 ${isActive ? 'bg-accent' : ''}`}
            >
              <span className="text-base leading-none">{flag}</span>
              <span className="flex-1">{name}</span>
              {isActive && (
                <span className="text-xs text-muted-foreground ml-2">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 