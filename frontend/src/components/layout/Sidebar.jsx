import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users2, 
  Star, 
  Clock, 
  Trash2, 
  User, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  FolderOpen,
  Archive,
  LayoutGrid,
  LogOut,
  Edit
} from 'lucide-react';
import { BRAND_NAME } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname + location.search;
  const { logout, triggerToast } = useAuth();

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'All Documents', path: '/documents', icon: FileText },
    { name: 'Shared with me', path: '/shared', icon: Users2 },
    { name: 'Starred', path: '/documents?filter=starred', icon: Star },
    { name: 'Recent', path: '/documents?filter=recent', icon: Clock },
    { name: 'Trash', path: '/documents?filter=trash', icon: Trash2 },
  ];

  const folders = [
    { name: 'My Documents', path: '/documents', icon: FolderOpen },
    { name: 'Shared', path: '/shared', icon: Users2 },
    { name: 'Drafts', path: '/documents?filter=drafts', icon: Edit },
    { name: 'Templates', path: '/dashboard', icon: LayoutGrid },
    { name: 'Archive', path: '/documents?filter=archive', icon: Archive }
  ];

  const handleLogout = () => {
    logout();
    triggerToast('Logged out successfully', 'success');
    navigate('/');
  };

  const isActiveLink = (path) => {
    return currentPath === path || 
      (path.includes('?') && currentPath.startsWith(path.split('?')[0]) && currentPath.includes(path.split('?')[1]));
  };

  return (
    <aside 
      className={`glass-panel fixed top-0 left-0 h-full z-45 flex flex-col justify-between transition-all duration-300 border-r border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#080E1A] select-none text-left
        ${sidebarOpen ? 'w-[200px]' : 'w-12'}
      `}
    >
      {/* Top Branding & Main Navigation */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Header Branding */}
        <div className="h-14 flex items-center gap-2 px-3 border-b border-[#E5E7EB] dark:border-white/10 shrink-0">
          <div className="text-[#0D6EFD] shrink-0">
            <FolderOpen size={16} />
          </div>
          {sidebarOpen && (
            <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#081B3A] dark:text-[#E5E7EB]">
              {BRAND_NAME}
            </span>
          )}
        </div>

        {/* Primary Navigation Menu */}
        <nav className="mt-2.5 px-1.5 space-y-0.75 shrink-0">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveLink(item.path);
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13.5px] ${isActive ? 'font-semibold' : 'font-medium'} transition-all duration-200 group relative
                  ${isActive 
                    ? 'bg-[#0D6EFD]/10 text-[#0D6EFD] shadow-sm dark:shadow-none border border-[#0D6EFD]/25 dark:border-transparent' 
                    : 'text-[#6B7280] dark:text-[#94A3B8]/65 opacity-65 hover:opacity-100 hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/30 border border-transparent'
                  }
                `}
              >
                <Icon 
                  size={14} 
                  className={`shrink-0 transition-colors duration-200
                    ${isActive ? 'text-[#0D6EFD]' : 'text-[#6B7280] dark:text-[#94A3B8]/80 group-hover:text-[#081B3A] dark:group-hover:text-[#E5E7EB]'}
                  `}
                />
                {sidebarOpen ? (
                  <span className="truncate">{item.name}</span>
                ) : (
                  <span className="absolute left-11 bg-[#070B14] text-white text-[9px] px-2 py-1.5 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Folders Section (Only visible/expanded when sidebar open) */}
        {sidebarOpen && (
          <div className="mt-4 px-3 shrink-0">
            <h5 className="text-[10px] font-extrabold tracking-wider text-[#6B7280] dark:text-slate-500 uppercase mb-1 px-1">
              Folders
            </h5>
            <div className="space-y-0.75">
              {folders.map((folder) => {
                const Icon = folder.icon;
                const isActive = isActiveLink(folder.path);

                return (
                  <NavLink
                    key={folder.name}
                    to={folder.path}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-[13px] ${isActive ? 'font-semibold' : 'font-medium'} transition-all duration-200 group
                      ${isActive 
                        ? 'text-[#0D6EFD]' 
                        : 'text-[#6B7280] dark:text-[#94A3B8]/65 opacity-65 hover:opacity-100 hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/30 dark:hover:bg-[#0F172A]/20'
                      }
                    `}
                  >
                    <Icon size={13} className="shrink-0 text-[#6B7280] dark:text-slate-500 group-hover:text-[#0D6EFD]" />
                    <span className="truncate">{folder.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sidebar Menu */}
      <div className="p-1.5 border-t border-[#E5E7EB] dark:border-white/10 bg-slate-50/50 dark:bg-[#060B14] shrink-0">
        <div className="space-y-0.75">
          {/* Profile Shortcut */}
          <NavLink
            to="/profile"
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13.5px] ${isActiveLink('/profile') ? 'font-semibold' : 'font-medium'} transition-all duration-200 group relative
              ${isActiveLink('/profile')
                ? 'bg-[#0D6EFD]/10 text-[#0D6EFD]'
                : 'text-[#6B7280] dark:text-[#94A3B8]/65 opacity-65 hover:opacity-100 hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/30'
              }
            `}
          >
            <User size={14} className="shrink-0 text-[#6B7280] dark:text-[#94A3B8]/80 group-hover:text-[#E5E7EB]" />
            {sidebarOpen ? (
              <span className="truncate">Profile</span>
            ) : (
              <span className="absolute left-11 bg-[#070B14] text-white text-[9px] px-2 py-1.5 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Profile
              </span>
            )}
          </NavLink>

          {/* Settings Shortcut */}
          <NavLink
            to="/settings"
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13.5px] ${isActiveLink('/settings') ? 'font-semibold' : 'font-medium'} transition-all duration-200 group relative
              ${isActiveLink('/settings')
                ? 'bg-[#0D6EFD]/10 text-[#0D6EFD]'
                : 'text-[#6B7280] dark:text-[#94A3B8]/65 opacity-65 hover:opacity-100 hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/30'
              }
            `}
          >
            <Settings size={14} className="shrink-0 text-[#6B7280] dark:text-[#94A3B8]/80 group-hover:text-[#E5E7EB]" />
            {sidebarOpen ? (
              <span className="truncate">Settings</span>
            ) : (
              <span className="absolute left-11 bg-[#070B14] text-white text-[9px] px-2 py-1.5 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Settings
              </span>
            )}
          </NavLink>

          {/* Logout Trigger */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13.5px] font-medium text-rose-600 dark:text-rose-500 opacity-70 hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200 cursor-pointer relative group"
          >
            <LogOut size={14} className="shrink-0 text-rose-500 group-hover:scale-105 transition-transform" />
            {sidebarOpen ? (
              <span className="truncate">Logout</span>
            ) : (
              <span className="absolute left-11 bg-[#070B14] text-white text-[9px] px-2 py-1.5 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Logout
              </span>
            )}
          </button>

          {/* Collapse Sidebar Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13.5px] font-medium text-[#6B7280] dark:text-[#94A3B8]/65 opacity-65 hover:opacity-100 hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/30 transition-all duration-200 cursor-pointer relative group"
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft size={14} className="shrink-0" />
                <span className="truncate">Collapse Sidebar</span>
              </>
            ) : (
              <>
                <ChevronRight size={14} className="shrink-0" />
                <span className="absolute left-11 bg-[#070B14] text-white text-[9px] px-2 py-1.5 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Expand Sidebar
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
