import { useCallback } from 'react';
import { useSettings } from './useSettings';

export function useNotificationSound() {
  const { settings } = useSettings();

  const playSound = useCallback((type: 'success' | 'error' | 'warning') => {
    if (!settings.notifications.sound) return;

    const audio = new Audio();
    audio.volume = 0.5;
    
    switch (type) {
      case 'success':
        audio.src = '/sounds/success.mp3';
        break;
      case 'error':
        audio.src = '/sounds/error.mp3';
        break;
      case 'warning':
        audio.src = '/sounds/warning.mp3';
        break;
    }
    
    audio.play().catch(() => {
      console.warn('Audio playback was blocked');
    });
  }, [settings.notifications.sound]);

  return { playSound };
}