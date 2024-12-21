import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { UserProfile } from '@/types/user';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  language: string;
}

const defaultSettings: Settings = {
  theme: 'system',
  notifications: {
    email: true,
    push: true,
    sound: true,
  },
  language: 'en',
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>('user-settings', defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  const updateSettings = useCallback(async (updates: Partial<Settings>) => {
    try {
      setIsLoading(true);
      // In a real app, you would make an API call here
      setSettings((prev) => ({ ...prev, ...updates }));
      return true;
    } catch (error) {
      console.error('Failed to update settings:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, [setSettings]);

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
  };
}