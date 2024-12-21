import { createContext, useContext, useState, useCallback } from 'react';
import { UserProfile } from '@/types/user';

interface UserProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>({
    id: 'user-1',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'operator',
    status: 'online',
    department: 'Operations',
    lastActive: new Date(),
    createdAt: new Date(),
    preferences: {
      notifications: true,
      theme: 'system',
      language: 'en',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      setError(null);
      // In a real app, make API call here
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err) {
      setError('Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <UserProfileContext.Provider value={{ profile, isLoading, error, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfileContext() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfileContext must be used within a UserProfileProvider');
  }
  return context;
}