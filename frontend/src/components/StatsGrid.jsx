import React from 'react';

export default function StatsGrid({ stats }) {
  return (
    <div className="select-none py-1 space-y-1">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-[#081B3A] dark:text-[#E5E7EB] tracking-tight flex items-center gap-1.5 transition-colors duration-300">
          <span>Good Morning, Madhu</span>
          <span className="text-xs">👋</span>
        </h2>
        
        {/* Blinking sync badge */}
        <div className="inline-flex items-center gap-1.5 px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-bold rounded-full uppercase tracking-widest">
          <span className="relative flex h-1 w-1 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500" />
          </span>
          <span>Sync Active</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-medium transition-colors duration-300">
        <span>{stats.totalDocuments} Documents</span>
        <span className="text-[#E5E7EB] dark:text-white/10 transition-colors duration-300">•</span>
        <span>{stats.activeTeamMembers} Team Members</span>
        <span className="text-[#E5E7EB] dark:text-white/10 transition-colors duration-300">•</span>
        <span>{stats.liveCollaborations} Live Sessions</span>
      </div>
    </div>
  );
}
