import React from 'react';

export default function StatsCard({
  title,
  value,
  icon: Icon,
  bgAccent = 'bg-[#0D6EFD]/10',
  textAccent = 'text-[#0D6EFD]'
}) {
  return (
    <div className="glass-card p-4 flex items-center justify-between border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-sm rounded-xl transition-all duration-300 select-none">
      <div className="text-left space-y-1">
        <p className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider transition-colors duration-300">
          {title}
        </p>
        <h3 className="font-sans font-extrabold text-lg text-[#081B3A] dark:text-[#E5E7EB] tracking-tight transition-colors duration-300">
          {value}
        </h3>
      </div>
      <div className={`p-2.5 ${bgAccent} ${textAccent} rounded-lg shrink-0 transition-colors duration-300`}>
        <Icon size={16} />
      </div>
    </div>
  );
}
