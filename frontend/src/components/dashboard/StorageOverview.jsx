import React from 'react';
import { Database } from 'lucide-react';
import { formatBytes } from '../../utils/helpers';
import { STORAGE_LIMIT, INITIAL_STORAGE_USED } from '../../utils/constants';

export default function StorageOverview() {
  const used = INITIAL_STORAGE_USED;
  const limit = STORAGE_LIMIT;
  const percentage = ((used / limit) * 100).toFixed(1);

  return (
    <div className="glass-card p-4 border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] shadow-sm rounded-xl transition-all duration-300 select-none text-left space-y-3.5">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider transition-colors duration-300">
          Cloud Storage overview
        </h4>
        <Database size={13} className="text-[#0D6EFD]" />
      </div>

      <div className="space-y-1.5">
        {/* Progress Bar */}
        <div className="w-full bg-[#E5E7EB] dark:bg-white/5 rounded-full h-2 overflow-hidden transition-colors duration-300">
          <div 
            className="bg-[#0D6EFD] h-2 rounded-full transition-all duration-500" 
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Labels details */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#081B3A] dark:text-[#E5E7EB] transition-colors duration-300">
          <span>{percentage}% Used</span>
          <span className="text-[#6B7280] dark:text-[#94A3B8]/60 font-medium">
            {formatBytes(used)} of {formatBytes(limit)}
          </span>
        </div>
      </div>

      {/* Categories Breakdown */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] pt-1.5 border-t border-[#E5E7EB] dark:border-white/10 transition-all duration-300">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0D6EFD]" />
          <span className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">Documents</span>
          <span className="text-[#6B7280] dark:text-[#94A3B8]/60 font-medium ml-auto">1.2 GB</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">Collaborations</span>
          <span className="text-[#6B7280] dark:text-[#94A3B8]/60 font-medium ml-auto">0.4 GB</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="font-bold text-[#081B3A] dark:text-[#E5E7EB]">System Logs</span>
          <span className="text-[#6B7280] dark:text-[#94A3B8]/60 font-medium ml-auto">0.24 GB</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB] dark:bg-white/10" />
          <span className="font-bold text-[#6B7280] dark:text-[#94A3B8]">Available</span>
          <span className="text-[#6B7280] dark:text-[#94A3B8]/60 font-medium ml-auto">3.16 GB</span>
        </div>
      </div>

    </div>
  );
}
