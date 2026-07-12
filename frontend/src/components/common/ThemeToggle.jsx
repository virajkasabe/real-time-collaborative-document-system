import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => {
        console.log("ThemeToggle: Button clicked. Current theme state:", theme);
        toggleTheme();
      }}
      className={`inline-flex items-center justify-center bg-[#f4f6fa] dark:bg-[#1e293b] border border-[#E5E7EB] dark:border-white/10 text-[#374151] dark:text-white rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 select-none ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun 
          size={18} 
          className="text-amber-500 hover:rotate-90 transition-transform duration-500" 
        />
      ) : (
        <Moon 
          size={18} 
          className="text-indigo-600 hover:-rotate-12 transition-transform duration-500" 
        />
      )}
    </button>
  );
}

