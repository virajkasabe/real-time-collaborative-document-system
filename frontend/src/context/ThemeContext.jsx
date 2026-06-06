import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'light' ? 'light' : 'dark'; // Default is dark
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    console.log("ThemeContext: useEffect triggered. Setting theme in storage and classes to:", theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      console.log("ThemeContext: added class 'dark' to documentElement and body. Current classes:", document.documentElement.classList.toString());
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      console.log("ThemeContext: removed class 'dark' from documentElement and body. Current classes:", document.documentElement.classList.toString());
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
