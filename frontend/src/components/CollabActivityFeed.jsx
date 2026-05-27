import React from 'react';

export default function CollabActivityFeed({ activityLogs }) {
  return (
    <div className="space-y-1 select-none mt-1">
      {activityLogs.slice(0, 8).map((log) => {
        return (
          <div
            key={log.id}
            className="flex items-start justify-between py-1.25 px-1.5 hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/70 rounded-md transition-all duration-300 text-[11px]"
          >
            <span className="text-[#081B3A] dark:text-[#E5E7EB] font-medium leading-relaxed truncate pr-2 transition-colors duration-300">
              {log.text}
            </span>
            <span className="text-[9px] text-[#6B7280]/60 dark:text-[#94A3B8]/60 font-semibold shrink-0 transition-colors duration-300">
              {log.time}
            </span>
          </div>
        );
      })}
    </div>
  );
}
