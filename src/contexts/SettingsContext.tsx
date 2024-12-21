import { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
    desktop: boolean;
  };
  language: string;
  timezone: string;
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
  };
}

const defaultSettings: Settings = {
  theme: 'system',
  notifications: {
    email: true,
    push: true,
    sound: true,
    desktop: true,
  },
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  accessibility: {
    reducedMotion: false,
    highContrast: false,
  },
};

interface SettingsContextType {
  settings: Settings;
  isLoading: boolean;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useLocalStorage('user-settings', defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  const updateSettings = useCallback(async (updates: Partial<Settings>) => {
    setIsLoading(true);
    try {
      // Simulate API call in real app
      await new Promise(resolve => setTimeout(resolve, 500));
      setSettings(prev => ({ ...prev, ...updates }));
    } finally {
      setIsLoading(false);
    }
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, [setSettings]);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}