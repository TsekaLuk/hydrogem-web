import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { useEffect, useState, useCallback } from 'react';

export function ThemeSettings() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('app-font-size') || 'normal';
  });

  const handleThemeChange = useCallback((value: string) => {
    setTheme(value);
  }, [setTheme]);

  const handleFontSizeChange = useCallback((value: string) => {
    setFontSize(value);
    localStorage.setItem('app-font-size', value);
    
    // 移除所有字体大小类
    document.body.classList.remove('text-sm', 'text-base', 'text-lg');
    
    // 添加新的字体大小类
    switch (value) {
      case 'small':
        document.body.classList.add('text-sm');
        break;
      case 'normal':
        document.body.classList.add('text-base');
        break;
      case 'large':
        document.body.classList.add('text-lg');
        break;
    }
  }, []);

  // 初始化字体大小
  useEffect(() => {
    const savedFontSize = localStorage.getItem('app-font-size') || 'normal';
    setFontSize(savedFontSize);
    handleFontSizeChange(savedFontSize);
    
    // 组件卸载时清理
    return () => {
      // 如果需要清理任何副作用，可以在这里进行
    };
  }, [handleFontSizeChange]);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">{t('settings.appearance.theme')}</h4>
        <RadioGroup
          value={theme}
          onValueChange={handleThemeChange}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem
              value="light"
              id="light"
              className="peer sr-only"
            />
            <Label
              htmlFor="light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3 h-6 w-6"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
              <span className="text-sm font-normal">
                {t('settings.appearance.light')}
              </span>
            </Label>
          </div>

          <div>
            <RadioGroupItem
              value="dark"
              id="dark"
              className="peer sr-only"
            />
            <Label
              htmlFor="dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3 h-6 w-6"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              <span className="text-sm font-normal">
                {t('settings.appearance.dark')}
              </span>
            </Label>
          </div>

          <div>
            <RadioGroupItem
              value="system"
              id="system"
              className="peer sr-only"
            />
            <Label
              htmlFor="system"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3 h-6 w-6"
              >
                <rect width="20" height="14" x="2" y="3" rx="2" />
                <line x1="8" x2="16" y1="21" y2="21" />
                <line x1="12" x2="12" y1="17" y2="21" />
              </svg>
              <span className="text-sm font-normal">
                {t('settings.appearance.system')}
              </span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-3">{t('settings.appearance.fontSize')}</h4>
          <RadioGroup
            value={fontSize}
            onValueChange={handleFontSizeChange}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem
                value="small"
                id="small"
                className="peer sr-only"
              />
              <Label
                htmlFor="small"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-sm">A</span>
                <span className="text-sm font-normal">
                  {t('settings.appearance.small')}
                </span>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="normal"
                id="normal"
                className="peer sr-only"
              />
              <Label
                htmlFor="normal"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-base">A</span>
                <span className="text-sm font-normal">
                  {t('settings.appearance.normal')}
                </span>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="large"
                id="large"
                className="peer sr-only"
              />
              <Label
                htmlFor="large"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-lg">A</span>
                <span className="text-sm font-normal">
                  {t('settings.appearance.large')}
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}