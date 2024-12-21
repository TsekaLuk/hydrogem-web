import { UserProfileHeader } from './UserProfileHeader';
import { UserProfileStats } from './UserProfileStats';
import { UserProfileCard } from './UserProfileCard';
import { UserSettings } from '@/components/settings/UserSettings';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useState } from 'react';

export function UserProfilePage() {
  const { profile, isLoading } = useUserProfile('current-user');
  const [showSettings, setShowSettings] = useState(false);

  if (isLoading || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <UserProfileHeader user={profile} />
      <UserProfileStats user={profile} />
      
      {showSettings ? (
        <UserSettings />
      ) : (
        <UserProfileCard
          user={profile}
          onEditProfile={() => setShowSettings(true)}
          onViewActivity={() => {
            // TODO: Implement activity view
            console.log('View activity');
          }}
        />
      )}
    </div>
  );
}