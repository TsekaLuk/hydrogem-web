import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useCallback } from 'react';
import { ProfileSettings } from './ProfileSettings';
import { NotificationSettings } from './NotificationSettings';
import { SecuritySettings } from './SecuritySettings';
import { ThemeSettings } from './ThemeSettings';

interface SettingsModalProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsModal({ defaultOpen = false, onOpenChange }: SettingsModalProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [activeTab, setActiveTab] = useState('profile');
  const { t } = useTranslation('common');

  // 同步外部和内部的open状态
  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      // 确保在组件卸载时移除body上的pointer-events样式
      document.body.style.removeProperty('pointer-events');
    };
  }, []);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    
    // 在对话框关闭时，确保移除body上的pointer-events样式
    if (!newOpen) {
      document.body.style.removeProperty('pointer-events');
    }
    
    onOpenChange?.(newOpen);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
      <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={() => {
          // 确保在Escape关闭对话框时也移除pointer-events
          document.body.style.removeProperty('pointer-events');
        }}
      >
        <DialogHeader>
          <DialogTitle>{t('settings.title')}</DialogTitle>
          <DialogDescription>
            {t('settings.description')}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">{t('settings.tabs.profile')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('settings.tabs.notifications')}</TabsTrigger>
            <TabsTrigger value="security">{t('settings.tabs.security')}</TabsTrigger>
            <TabsTrigger value="appearance">{t('settings.tabs.appearance')}</TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <TabsContent value="profile" className="m-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{t('settings.profile.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('settings.profile.description')}</p>
                </div>
                <ProfileSettings />
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="m-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{t('settings.notifications.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('settings.notifications.description')}</p>
                </div>
                <NotificationSettings />
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="m-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{t('settings.security.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('settings.security.description')}</p>
                </div>
                <SecuritySettings />
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="m-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{t('settings.appearance.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('settings.appearance.description')}</p>
                </div>
                <ThemeSettings />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}