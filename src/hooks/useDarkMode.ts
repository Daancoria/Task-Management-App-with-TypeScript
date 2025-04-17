import { useEffect, useState } from 'react';

export const useDarkMode = (): [boolean, () => void] => {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;

    if (enabled) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [enabled]);

  const toggle = () => setEnabled(prev => !prev);

  return [enabled, toggle];
};
