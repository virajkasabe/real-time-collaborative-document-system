import React from 'react';

export default function RibbonButton({
  icon: Icon,
  label,
  onClick,
  active = false,
  disabled = false,
  size = 'large', // 'large' | 'small'
  tooltip,
  shortcut,
  title,
}) {
  const isLarge = size === 'large';
  
  // Base wrapper styles using Tailwind utility classes
  const baseClass = "relative inline-flex items-center justify-center font-sans transition-all duration-200 outline-none select-none shrink-0 cursor-pointer disabled:opacity-40 disabled:pointer-events-none";
  
  // Layout classes for large (vertical) vs small (horizontal) buttons
  const layoutClass = isLarge
    ? "flex flex-col w-[56px] h-[52px] rounded-lg text-center justify-center gap-1 hover:bg-[#0D6EFD]/10 dark:hover:bg-[#0D6EFD]/20 hover:text-[#0D6EFD] dark:hover:text-blue-400 group"
    : "flex flex-row px-2 py-1 h-[24px] rounded-md gap-1.5 text-xs hover:bg-[#0D6EFD]/10 dark:hover:bg-[#0D6EFD]/20 hover:text-[#0D6EFD] dark:hover:text-blue-400 align-middle w-full text-left justify-start";

  // Color classes for active/inactive state
  const stateClass = active
    ? "bg-[#0D6EFD]/15 text-[#0D6EFD] dark:bg-[#0D6EFD]/30 dark:text-blue-400 font-semibold border border-[#0D6EFD]/25"
    : "text-[#081B3A] dark:text-[#E5E7EB] border border-transparent";

  const displayTitle = title || tooltip || label;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={shortcut ? `${displayTitle} (${shortcut})` : displayTitle}
      aria-label={displayTitle}
      className={`${baseClass} ${layoutClass} ${stateClass}`}
    >
      {Icon && (
        <Icon
          size={isLarge ? 20 : 14}
          className={`shrink-0 transition-transform duration-200 ${isLarge ? "group-hover:scale-105" : ""} ${active ? "text-[#0D6EFD]" : "text-[#6B7280] dark:text-[#94A3B8]"}`}
        />
      )}
      <span className={isLarge ? "text-[10px] leading-tight font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis w-full px-0.5" : "text-[11px] leading-none whitespace-nowrap"}>
        {label}
      </span>
    </button>
  );
}
