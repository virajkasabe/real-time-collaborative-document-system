import React from 'react';

export default function TeamActivityTable({ teamMembers }) {
  return (
    <div className="space-y-1 select-none mt-1">
      {teamMembers.map((member) => {
        const isActive = member.status === 'Active';
        const isIdle = member.status === 'Idle';
        
        return (
          <div 
            key={member.id || member.email}
            className="flex items-center justify-between py-1.25 px-1.5 hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/70 rounded-md transition-all duration-300 cursor-default"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-5 h-5 rounded-full object-cover border border-[#E5E7EB] dark:border-white/10 transition-colors duration-300"
                />
                <span className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white dark:border-[#070B14] transition-colors duration-300
                  ${isActive ? 'bg-emerald-500' : isIdle ? 'bg-amber-450' : 'bg-slate-650'}
                `} />
              </div>
              <span className="font-semibold text-[11px] text-[#081B3A] dark:text-slate-200 transition-colors duration-300 truncate">
                {member.name}
              </span>
            </div>
            
            <span className="text-[9px] text-[#6B7280] dark:text-[#94A3B8] font-bold shrink-0 transition-colors duration-300">
              {isActive ? 'Online' : isIdle ? 'Idle' : 'Offline'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
