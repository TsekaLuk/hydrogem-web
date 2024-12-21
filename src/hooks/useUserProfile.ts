import { useState, useEffect } from 'react';
import { UserProfile, UserActivity } from '@/types/user';

export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to fetch user profile
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        const mockProfile: UserProfile = {
          id: userId,
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
        };
        
        setProfile(mockProfile);
      } catch (err) {
        setError('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      // In a real app, this would be an API call
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err) {
      setError('Failed to update profile');
      return false;
    }
  };

  return {
    profile,
    activities,
    isLoading,
    error,
    updateProfile,
  };
}