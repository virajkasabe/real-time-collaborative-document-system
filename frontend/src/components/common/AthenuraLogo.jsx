import React from 'react';
import athenuraLogo from '../../assets/athenura-logo.png';
import { useTheme } from '../../context/ThemeContext';

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
      src={athenuraLogo}
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

