import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  Sun, 
  Moon, 
  SearchX, 
  User, 
  LogOut, 
  ShieldAlert,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  theme, 
  toggleTheme, 
  onCreateClick, 
  notifications, 
  markNotificationsRead,
  onInviteClick,
  onShareClick
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-10.5 bg-[#FFFFFF]/85 dark:bg-[#070B14]/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-white/10 sticky top-0 z-30 px-4 flex items-center justify-between select-none transition-colors duration-300">
      {/* Search Bar (Linear style) */}
      <div className="flex-1 max-w-[280px] relative">
        <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-[#6B7280] dark:text-slate-500">
          <Search size={12} />
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#F7FAFF] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-md pl-6.5 pr-4 py-0.75 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#0D6EFD] focus:border-[#0D6EFD] text-[#081B3A] dark:text-slate-200 placeholder-[#6B7280]/40 dark:placeholder-[#94A3B8]/40 transition-all font-semibold duration-300"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-2 inset-y-0 flex items-center text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-slate-200"
          >
            <SearchX size={12} />
          </button>
        )}
      </div>

      {/* Right Navbar Utility Controls */}
      <div className="flex items-center gap-1.5 ml-3">
        {/* Simple Create Document Button */}
        <button
          onClick={onCreateClick}
          className="flex items-center gap-1 px-3 py-1 bg-[#0D6EFD] hover:bg-[#0D6EFD]/90 text-white text-xs font-bold rounded-lg active:scale-95 transition-all shadow-sm shrink-0"
        >
          <Plus size={13} />
          <span>Create Document</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-slate-200 hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors duration-300"
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? (
            <Sun size={15} className="text-amber-500" />
          ) : (
            <Moon size={15} className="text-[#081B3A]" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`p-1.5 rounded-md text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-slate-200 hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors duration-300 relative
              ${showNotifications ? 'bg-[#E5E7EB]/50 dark:bg-[#0F172A] text-[#081B3A] dark:text-slate-200' : ''}
            `}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#0D6EFD] ring-1 ring-white dark:ring-[#0F172A] rounded-full"></span>
            )}
          </button>

          {/* Notifications Dropdown Panel (12px rounded, flat borders) */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 glass-card shadow-md p-1.5 z-50 border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] transition-colors duration-300">
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[#E5E7EB] dark:border-white/10">
                <span className="font-bold text-xs text-[#081B3A] dark:text-slate-250">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => {
                      markNotificationsRead();
                      setShowNotifications(false);
                    }}
                    className="text-[10px] text-[#0D6EFD] hover:text-[#0D6EFD]/80 font-bold"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              <div className="max-h-60 overflow-y-auto mt-1 space-y-0.5">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-[#6B7280] dark:text-[#94A3B8] text-[11px] font-medium">No notifications.</div>
                ) : (
                  notifications.map((notif) => {
                    let Icon = MessageSquare;
                    let iconColor = 'text-[#0D6EFD] bg-[#0D6EFD]/10';
                    if (notif.type === 'alert') {
                      Icon = ShieldAlert;
                      iconColor = 'text-rose-500 bg-rose-500/10';
                    } else if (notif.type === 'success') {
                      Icon = CheckCircle;
                      iconColor = 'text-emerald-500 bg-emerald-500/10';
                    }

                    return (
                      <div 
                        key={notif.id}
                        className={`flex gap-2.5 p-2 rounded-lg text-left transition-colors duration-300 cursor-pointer
                          ${notif.read 
                            ? 'hover:bg-[#E5E7EB]/30 dark:hover:bg-[#0F172A]/40 text-[#6B7280] dark:text-[#94A3B8]' 
                            : 'bg-[#F7FAFF] dark:bg-[#0F172A]/40 hover:bg-[#E5E7EB]/30 dark:hover:bg-[#0F172A]/70 text-[#081B3A] dark:text-slate-200 font-bold'
                          }
                        `}
                      >
                        <div className={`p-1.5 rounded shrink-0 h-7 w-7 flex items-center justify-center ${iconColor}`}>
                          <Icon size={13} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] leading-tight">
                            {notif.text}
                          </p>
                          <span className="text-[9px] text-[#6B7280] dark:text-[#94A3B8]/60 mt-0.5 block">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center rounded-full hover:ring-2 hover:ring-[#0D6EFD]/35 transition-colors duration-300"
          >
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
              alt="Leader avatar" 
              className="w-7 h-7 rounded-full object-cover border border-[#E5E7EB] dark:border-[#0D6EFD]/25 transition-colors duration-300"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 glass-card shadow-md p-1.5 z-50 border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] transition-colors duration-300">
              <div className="px-2 py-1.5 border-b border-[#E5E7EB] dark:border-white/10">
                <p className="font-bold text-xs text-[#081B3A] dark:text-slate-200">Eleanor Vance</p>
                <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]/60 truncate">eleanor@company.com</p>
              </div>
              
              <div className="mt-1 space-y-0.5">
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    onInviteClick();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[11px] font-semibold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/40 transition-colors duration-300"
                >
                  <User size={13} className="text-[#0D6EFD]" />
                  <span>Invite Team Member</span>
                </button>
                
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    onShareClick();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[11px] font-semibold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/40 transition-colors duration-300"
                >
                  <Plus size={13} className="text-[#0D6EFD]" />
                  <span>Share Document Admin</span>
                </button>
                
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert("Mock Logout");
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[11px] font-semibold text-rose-600 hover:bg-rose-50 border-t border-[#E5E7EB] dark:border-white/10 mt-1 transition-colors duration-300"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
