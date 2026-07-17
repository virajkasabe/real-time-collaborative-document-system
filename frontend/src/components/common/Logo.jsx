import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function Logo() {
  const { theme } = useTheme();
  return (
    <div className="flex items-center gap-2">
      {/* SVG logo that changes with theme */}
      <svg width="32" height="32" viewBox="0 0 32 32" className="flex-shrink-0">
        <circle
          cx="16" cy="16" r="14"
          fill={theme === 'dark' ? '#2563EB' : '#1D4ED8'}
        />
        <text
          x="16" y="21"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold">
          A
        </text>
      </svg>
      <span className={`font-bold text-lg hidden sm:block
        ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Athenura
      </span>
    </div>
  );
}
