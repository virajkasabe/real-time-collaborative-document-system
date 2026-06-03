import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary | secondary | danger | outline | ghost
  size = 'md', // sm | md | lg
  disabled = false,
  loading = false,
  className = '',
  icon: Icon
}) {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all active:scale-[0.98] select-none disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-[#0D6EFD] hover:bg-[#0D6EFD]/95 text-white shadow-sm',
    secondary: 'bg-[#E5E7EB] hover:bg-[#cbd5e1] text-[#081B3A] dark:bg-[#0F172A] dark:hover:bg-[#0B1220] dark:text-[#E5E7EB]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
    outline: 'border border-[#E5E7EB] dark:border-white/10 bg-transparent text-[#081B3A] dark:text-[#E5E7EB] hover:bg-[#F7FAFF] dark:hover:bg-white/5',
    ghost: 'bg-transparent text-[#081B3A] dark:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]'
  };

  const sizes = {
    sm: 'px-2.5 py-1.25 text-[10px]',
    md: 'px-3.5 py-1.5 text-xs',
    lg: 'px-5 py-2 text-sm'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5 shrink-0" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 12 : 14} className="mr-1.5 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
