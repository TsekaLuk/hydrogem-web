import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSettings } from './ProfileSettings';
import { NotificationSettings } from './NotificationSettings';
import { SecuritySettings } from './SecuritySettings';
import { ThemeSettings } from './ThemeSettings';
import { useUserProfile } from '@/hooks/useUserProfile';

export function UserSettings() {
  const { profile, updateProfile } = useUserProfile('current-user');
  const [activeTab, setActiveTab] = useState('profile');

  if (!profile) return null;

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileSettings profile={profile} onUpdate={updateProfile} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings 
            preferences={profile.preferences} 
            onUpdate={updateProfile} 
          />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        <TabsContent value="appearance">
          <ThemeSettings 
            theme={profile.preferences.theme}
            onUpdate={(theme) => updateProfile({ 
              preferences: { ...profile.preferences, theme } 
            })}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}