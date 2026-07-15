import React from 'react';

export default function RibbonGroup({ label, children }) {
  return (
    <div className="ribbon-group flex flex-col items-center justify-between h-[76px] px-3 py-0.5 box-border relative shrink-0 min-w-max">
      {/* Controls Container */}
      <div className="flex items-center gap-1.5 h-[52px] justify-center w-full">
        {children}
      </div>
      
      {/* Group Label */}
      <span className="ribbon-group-label text-[9px] font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#94A3B8]/80 mt-auto text-center select-none pt-0.5 whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
