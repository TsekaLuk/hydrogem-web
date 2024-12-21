import { useCallback } from 'react';

export function useSound() {
  const playAlertSound = useCallback(() => {
    const audio = new Audio('/alert.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Handle browsers that block autoplay
      console.warn('Audio playback was blocked');
    });
  }, []);

  return { playAlertSound };
}