import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  searchTerm: '',
  setSearchTerm: () => {},
  themeVars: {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const persisted = localStorage.getItem('app-theme');
      if (persisted === 'light' || persisted === 'dark') return persisted;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'light';
    } catch {
      return 'light';
    }
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('app-theme', theme);
      const root = document.documentElement;
      if (theme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const isDark = theme === 'dark';

  const themeVars = useMemo(() => ({
    pageBg: isDark ? '#0b0f1a' : '#f8f9fa',
    panelBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
    containerText: isDark ? '#fff' : '#111',
    subtleText: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    primaryGradient: 'linear-gradient(90deg,#3b82f6,#8b5cf6)',
    dangerGradient: 'linear-gradient(90deg,#ef4444,#f97316)',
  }), [isDark]);

  const value = useMemo(() => ({
    theme,
    isDark,
    toggleTheme,
    searchTerm,
    setSearchTerm,
    themeVars
  }), [theme, isDark, searchTerm, themeVars]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;