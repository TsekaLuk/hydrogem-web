import { User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/ui/avatar';
import { useTranslation } from 'react-i18next';

export function UserMenu() {
  const [showSettings, setShowSettings] = useState(false);
  const { t } = useTranslation();

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-8 w-8 rounded-full p-0"
          >
            <Avatar className="h-8 w-8 flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56" 
          align="end" 
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{t('user.name')}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {t('user.email')}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('user.settings')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('user.logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showSettings && (
        <SettingsModal 
          defaultOpen={true}
          onOpenChange={setShowSettings}
        />
      )}
    </>
  );
}