import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useCallback } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const handleLanguageChange = useCallback(async (code: string) => {
    try {
      console.log('Changing language to:', code);
      console.log('Current language:', i18n.language);
      
      await i18n.changeLanguage(code);
      
      console.log('Language changed successfully');
      console.log('New language:', i18n.language);
      
      // 强制重新渲染
      window.dispatchEvent(new Event('languageChanged'));
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
        >
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map(({ code, name, flag }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={`flex items-center gap-2 ${i18n.language?.startsWith(code) ? 'bg-accent' : ''}`}
          >
            <span className="text-base leading-none">{flag}</span>
            <span className="flex-1">{name}</span>
            {i18n.language?.startsWith(code) && (
              <span className="text-xs text-muted-foreground ml-2">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 