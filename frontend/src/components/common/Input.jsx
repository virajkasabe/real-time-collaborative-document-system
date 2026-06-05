import React from 'react';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  name,
  required = false
}) {
  return (
    <div className={`flex flex-col gap-1 w-full text-left ${className}`}>
      {label && (
        <label className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider transition-colors duration-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-[#070B14] text-[#081B3A] dark:text-[#E5E7EB] placeholder-[#6B7280]/40 dark:placeholder-[#94A3B8]/40 focus:outline-none focus:ring-1 focus:ring-[#0D6EFD] focus:border-[#0D6EFD] shadow-sm transition-all duration-300
          ${error 
            ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' 
            : 'border-[#E5E7EB] dark:border-white/10'
          }
        `}
      />
      {error && (
        <span className="text-[9px] font-semibold text-rose-500 mt-0.5 ml-0.5">
          {error}
        </span>
      )}
    </div>
  );
}
