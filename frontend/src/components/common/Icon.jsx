import React from 'react';
import * as LucideIcons from 'lucide-react';

export const Icon = ({ name, size = 16, className = '' }) => {
  const LucideIcon = LucideIcons[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} />;
};

export default Icon;
