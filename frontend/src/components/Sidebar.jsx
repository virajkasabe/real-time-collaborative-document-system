import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users2, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Clock, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  FolderDot
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-docs', name: 'My Documents', icon: FileText },
    { id: 'shared-docs', name: 'Shared Documents', icon: Users2 },
    { id: 'team-members', name: 'Team Members', icon: Users },
    { id: 'activity-logs', name: 'Activity', icon: ClipboardList },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'version-history', name: 'Version History', icon: Clock },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`glass-panel fixed top-0 left-0 h-full z-40 flex flex-col justify-between transition-colors duration-300
        ${sidebarOpen ? 'w-40' : 'w-10'}
      `}
    >
      {/* Sidebar Header */}
      <div>
        <div className="h-10.5 flex items-center justify-between px-3 border-b border-[#E5E7EB] dark:border-white/10 transition-colors duration-300">
          <div className="flex items-center gap-1.5 overflow-hidden select-none">
            <div className="text-[#0D6EFD] shrink-0">
              <FolderDot size={15} />
            </div>
            {sidebarOpen && (
              <span className="font-sans font-bold text-[12px] text-[#081B3A] dark:text-[#E5E7EB] tracking-tight transition-colors duration-300">
                CollabDocs
              </span>
            )}
          </div>
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-0.5 rounded text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors duration-300"
          >
            {sidebarOpen ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
          </button>
        </div>

        {/* Navigation Items (Notion/Linear compact style) */}
        <nav className="mt-2 px-1.5 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2 px-2 py-0.75 rounded-md text-[10.5px] font-semibold transition-all duration-300 group relative
                  ${isActive 
                    ? 'bg-[#F7FAFF] dark:bg-[#0F172A] text-[#0D6EFD] shadow-sm dark:shadow-none border border-[#E5E7EB] dark:border-transparent' 
                    : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/30 border border-transparent'
                  }
                `}
              >
                <Icon 
                  size={13} 
                  className={`shrink-0 transition-colors duration-300
                    ${isActive ? 'text-[#0D6EFD]' : 'text-[#6B7280] dark:text-[#94A3B8]/80 group-hover:text-[#081B3A] dark:group-hover:text-slate-350'}
                  `}
                />
                
                {sidebarOpen ? (
                  <span className="truncate">{item.name}</span>
                ) : (
                  /* Tooltip on collapse */
                  <span className="absolute left-9 bg-slate-950 text-white text-[9px] px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer - Clean borderless avatar circle */}
      <div className="p-2 border-t border-[#E5E7EB] dark:border-white/10 flex items-center justify-center transition-colors duration-300">
        <div className="relative shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
            alt="Eleanor Vance Avatar" 
            className="w-5.5 h-5.5 rounded-full object-cover border border-[#E5E7EB] dark:border-[#0D6EFD]/25 transition-colors duration-300"
          />
          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-500 border border-white dark:border-[#0B1220] rounded-full transition-colors duration-300" />
        </div>
      </div>
    </aside>
  );
}
