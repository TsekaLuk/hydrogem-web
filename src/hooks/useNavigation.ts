import { useState, useCallback, useEffect } from 'react';

export function useNavigation() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.slice(1) || 'chat';
    return hash;
  });

  const navigate = useCallback((route: string) => {
    window.location.hash = route;
    setCurrentRoute(route);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'chat';
      setCurrentRoute(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return {
    currentRoute,
    navigate,
  };
}