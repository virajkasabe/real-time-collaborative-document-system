import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ATHENURA_LOGO } from '../../assets';

export default function AthenuraLogo({ 
  className = "h-8", 
  isDark,
  style = {}
}) {
  const { theme } = useTheme();
  
  // If isDark is explicitly passed, use it. Otherwise default to current theme context
  const finalIsDark = typeof isDark === 'boolean' ? isDark : (theme === 'dark');

  return (
    <img 
      src={ATHENURA_LOGO}
      alt="Athenura"
      className={`w-auto object-contain ${className}`}
      style={{ 
        maxWidth: '150px',
        mixBlendMode: finalIsDark ? 'screen' : 'multiply',
        ...style
      }}
    />
  );
}

