import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verifica se há um tema salvo no localStorage
    const savedTheme = localStorage.getItem('webpoker-theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }

    // Default sempre para light (ignora preferência do sistema)
    return 'light';
  });

  useEffect(() => {
    // Aplica o tema ao documento
    document.documentElement.setAttribute('data-theme', theme);

    // Salva no localStorage
    localStorage.setItem('webpoker-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');

  return {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};
