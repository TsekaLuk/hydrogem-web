import { useEffect, useRef } from 'react';

interface NotificationSoundProps {
  type: 'success' | 'error' | 'warning';
}

export function NotificationSound({ type }: NotificationSoundProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
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
    
    audioRef.current = audio;
    audio.play().catch(() => {
      // Handle browsers that block autoplay
      console.warn('Audio playback was blocked');
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [type]);

  return null;
}