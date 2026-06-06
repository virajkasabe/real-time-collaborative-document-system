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
      className={`inline-flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-white/20 text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 select-none ${className}`}
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

