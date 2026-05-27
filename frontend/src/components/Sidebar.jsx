<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
=======
import React from 'react';
>>>>>>> 02b645e (Improve dashboard UI and fix theme system)
import { 
  LayoutDashboard, 
  FileText, 
  Users2, 
<<<<<<< HEAD
  Star, 
  Clock, 
  Trash2, 
  User, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import athenuraCircle from '../assets/athenura-circle.png';
import athenuraLogo from '../assets/athenura-logo.png';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark' || document.documentElement.classList.contains('dark');
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname + location.search;
  const { logout, triggerToast } = useAuth();

  const [blendMode, setBlendMode] = useState(
    document.documentElement.classList.contains('dark') 
      ? 'screen' : 'multiply'
  );

  useEffect(() => {
    const updateBlendMode = () => {
      setBlendMode(
        document.documentElement.classList.contains('dark')
          ? 'screen' : 'multiply'
      );
    };

    // Watch for class changes on html element
    const observer = new MutationObserver(updateBlendMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);


  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'All Documents', path: '/documents', icon: FileText },
    { name: 'Shared with me', path: '/shared', icon: Users2 },
    { name: 'Starred', path: '/documents?filter=starred', icon: Star },
    { name: 'Recent', path: '/documents?filter=recent', icon: Clock },
    { name: 'Trash', path: '/documents?filter=trash', icon: Trash2 },
  ];

  const handleLogout = () => {
    logout();
    triggerToast('Logged out successfully', 'success');
    navigate('/login');
  };

  const isActiveLink = (path) => {
    return currentPath === path || 
      (path.includes('?') && currentPath.startsWith(path.split('?')[0]) && currentPath.includes(path.split('?')[1]));
  };

  return (
    <aside 
      className={`glass-panel h-full z-40 flex flex-col justify-between transition-all duration-300 border-r border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#080E1A] select-none text-left shrink-0
        absolute md:static top-0 left-0
        ${sidebarOpen ? 'w-[240px] translate-x-0' : 'w-0 md:w-[64px] -translate-x-full md:translate-x-0 overflow-hidden border-none'}
      `}
    >
      {/* Top Branding & Main Navigation */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Header Branding */}
        {sidebarOpen ? (
          <div className="flex items-center px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <img
              src={athenuraLogo}
              alt="Athenura"
              className="h-9 w-auto object-contain"
              style={{
                maxWidth: '150px',
                mixBlendMode: blendMode
              }}
            />
          </div>
        ) : (
          <div className="h-14 flex items-center justify-center border-b border-[#E5E7EB] dark:border-white/10 shrink-0">
            <img 
              src={athenuraCircle} 
              alt="Athenura" 
              className="w-7 h-7 object-contain"
              style={{ mixBlendMode: blendMode }}
            />
          </div>
        )}

        {/* Primary Navigation Menu */}
        <nav className="mt-3 px-2 space-y-1 shrink-0">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveLink(item.path);
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`w-full flex items-center rounded-lg text-[13.5px] ${isActive ? 'font-semibold' : 'font-medium'} transition-all duration-200 group relative
                  ${sidebarOpen ? 'justify-start gap-2.5 px-3 py-2' : 'justify-center p-2'}
                  ${isActive 
                    ? 'bg-[#0D6EFD]/10 text-[#0D6EFD] shadow-sm dark:shadow-none border border-[#0D6EFD]/25 dark:border-transparent' 
                    : 'text-[#6B7280] dark:text-[#94A3B8]/65 opacity-65 hover:opacity-100 hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/30 border border-transparent'
=======
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
>>>>>>> 02b645e (Improve dashboard UI and fix theme system)
                  }
                `}
              >
                <Icon 
<<<<<<< HEAD
                  size={14} 
                  className={`shrink-0 transition-colors duration-200
                    ${isActive ? 'text-[#0D6EFD]' : 'text-[#6B7280] dark:text-[#94A3B8]/80 group-hover:text-[#081B3A] dark:group-hover:text-[#E5E7EB]'}
                  `}
                />
                {sidebarOpen ? (
                  <span className="truncate">{item.name}</span>
                ) : (
                  <span className="absolute left-18 bg-[#070B14] text-white text-[9px] px-2 py-1.5 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </span>
                )}
              </NavLink>
=======
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
>>>>>>> 02b645e (Improve dashboard UI and fix theme system)
            );
          })}
        </nav>
      </div>

<<<<<<< HEAD
      {/* Bottom Sidebar Menu */}
      <div className={`border-t border-[#E5E7EB] dark:border-white/10 bg-slate-50/50 dark:bg-[#060B14] shrink-0 ${sidebarOpen ? 'p-3' : 'p-2'}`}>
        <div className="space-y-1">
          {/* Profile Shortcut */}
          <NavLink
            to="/profile"
            className={`w-full flex items-center rounded-lg text-[13.5px] ${isActiveLink('/profile') ? 'font-semibold' : 'font-medium'} transition-all duration-200 group relative
              ${sidebarOpen ? 'justify-start gap-2.5 px-3 py-2' : 'justify-center p-2'}
              ${isActiveLink('/profile')
                ? 'bg-[#0D6EFD]/10 text-[#0D6EFD]'
                : 'text-[#6B7280] dark:text-[#94A3B8]/65 opacity-65 hover:opacity-100 hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/30'
              }
            `}
          >
            <User size={14} className="shrink-0 text-[#6B7280] dark:text-[#94A3B8]/80 group-hover:text-[#081B3A] dark:group-hover:text-[#E5E7EB]" />
            {sidebarOpen ? (
              <span className="truncate">Profile</span>
            ) : (
              <span className="absolute left-18 bg-[#070B14] text-white text-[9px] px-2 py-1.5 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Profile
              </span>
            )}
          </NavLink>

          {/* Settings Shortcut */}
          <NavLink
            to="/settings"
            className={`w-full flex items-center rounded-lg text-[13.5px] ${isActiveLink('/settings') ? 'font-semibold' : 'font-medium'} transition-all duration-200 group relative
              ${sidebarOpen ? 'justify-start gap-2.5 px-3 py-2' : 'justify-center p-2'}
              ${isActiveLink('/settings')
                ? 'bg-[#0D6EFD]/10 text-[#0D6EFD]'
                : 'text-[#6B7280] dark:text-[#94A3B8]/65 opacity-65 hover:opacity-100 hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/30'
              }
            `}
          >
            <Settings size={14} className="shrink-0 text-[#6B7280] dark:text-[#94A3B8]/80 group-hover:text-[#081B3A] dark:group-hover:text-[#E5E7EB]" />
            {sidebarOpen ? (
              <span className="truncate">Settings</span>
            ) : (
              <span className="absolute left-18 bg-[#070B14] text-white text-[9px] px-2 py-1.5 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Settings
              </span>
            )}
          </NavLink>

          {/* Logout Trigger */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center rounded-lg text-[13.5px] font-medium text-rose-600 dark:text-rose-500 opacity-70 hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200 cursor-pointer relative group
              ${sidebarOpen ? 'justify-start gap-2.5 px-3 py-2' : 'justify-center p-2'}
            `}
          >
            <LogOut size={14} className="shrink-0 text-rose-500 group-hover:scale-105 transition-transform" />
            {sidebarOpen ? (
              <span className="truncate">Logout</span>
            ) : (
              <span className="absolute left-18 bg-[#070B14] text-white text-[9px] px-2 py-1.5 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Logout
              </span>
            )}
          </button>

          {/* Collapse Sidebar Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`w-full flex items-center rounded-lg text-[13.5px] font-medium text-[#6B7280] dark:text-[#94A3B8]/65 opacity-65 hover:opacity-100 hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/30 transition-all duration-200 cursor-pointer relative group
              ${sidebarOpen ? 'justify-start gap-2.5 px-3 py-2' : 'justify-center p-2'}
            `}
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft size={14} className="shrink-0" />
                <span className="truncate">Collapse Sidebar</span>
              </>
            ) : (
              <>
                <ChevronRight size={14} className="shrink-0" />
                <span className="absolute left-18 bg-[#070B14] text-white text-[9px] px-2 py-1.5 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  Expand Sidebar
                </span>
              </>
            )}
          </button>
=======
      {/* Sidebar Footer - Clean borderless avatar circle */}
      <div className="p-2 border-t border-[#E5E7EB] dark:border-white/10 flex items-center justify-center transition-colors duration-300">
        <div className="relative shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
            alt="Eleanor Vance Avatar" 
            className="w-5.5 h-5.5 rounded-full object-cover border border-[#E5E7EB] dark:border-[#0D6EFD]/25 transition-colors duration-300"
          />
          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-emerald-500 border border-white dark:border-[#0B1220] rounded-full transition-colors duration-300" />
>>>>>>> 02b645e (Improve dashboard UI and fix theme system)
        </div>
      </div>
    </aside>
  );
}
