import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  Star,
  Clock,
  Trash2,
  User,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import SidebarItem from './SidebarItem';
import athenuraLogo from '../../assets/athenura-logo.png';
import athenuraCircle from '../../assets/athenura-circle.png';

export default function Sidebar({ sidebarCollapsed, setSidebarCollapsed }) {
  const { logout, triggerToast } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isOpen = !sidebarCollapsed;
  const onToggle = () => setSidebarCollapsed(p => !p);

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/documents',
      label: 'All Documents',
      icon: FileText
    },
    {
      path: '/documents?filter=shared',
      label: 'Shared with me',
      icon: Users
    },
    {
      path: '/documents?filter=starred',
      label: 'Starred',
      icon: Star
    },
    {
      path: '/documents?filter=recent',
      label: 'Recent',
      icon: Clock
    },
    {
      path: '/documents?filter=trash',
      label: 'Trash',
      icon: Trash2
    },
  ];

  const handleLogout = () => {
    logout();
    triggerToast('Logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <aside
      className={`
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-[52px]' : 'w-[240px]'}
        bg-white dark:bg-[#0B0F19]
        border-r border-[#E5E7EB] dark:border-white/5
        flex flex-col h-full overflow-hidden shrink-0 z-40 select-none text-left
      `}
    >

      {/* Top Branding / Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#E5E7EB] dark:border-white/5 shrink-0 overflow-hidden">
        {isOpen ? (
          <div className="flex items-center gap-2.5">
            <img 
              src={athenuraLogo} 
              alt="Athenura"
              className="h-7 w-auto object-contain"
              style={{
                filter: theme === 'dark'
                  ? 'brightness(0) invert(1)'
                  : 'brightness(0.15)',
              }}
            />
          </div>
        ) : (
          <div className="mx-auto">
            <img 
              src={athenuraCircle} 
              alt="Athenura"
              className="w-7 h-7 object-contain"
              style={{
                filter: theme === 'dark'
                  ? 'brightness(0) invert(1)'
                  : 'brightness(0.15)',
              }}
            />
          </div>
        )}
      </div>

      {/* Sidebar Navigation Content */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden overflow-y-auto">
        {navItems.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            isOpen={isOpen}
          />
        ))}
      </nav>

      {/* Bottom section — Profile + Settings + Logout */}
      <div className="p-2 space-y-1 border-t border-[#E5E7EB] dark:border-white/5 shrink-0">
        {[
          { path: '/profile', label: 'Profile', icon: User },
          { path: '/settings', label: 'Settings', icon: Settings },
        ].map((item) => (
          <SidebarItem key={item.path} item={item} isOpen={isOpen} />
        ))}

        {/* Logout — gray default, red on hover */}
        <button
          onClick={handleLogout}
          aria-label="Logout"
          className={`
            flex items-center gap-2.5 px-3 py-2 rounded-lg
            w-full text-gray-400 hover:text-red-400
            hover:bg-red-500/10 transition-all duration-200 cursor-pointer
            ${!isOpen ? 'justify-center' : ''}
          `}
        >
          <LogOut size={16} className="shrink-0" />
          {isOpen && (
            <span className="text-[13px] font-medium">Logout</span>
          )}
        </button>

        {/* Collapse button at bottom of sidebar */}
        <div className="border-t border-[#E5E7EB] dark:border-white/5 pt-1 mt-1">
          <button
            onClick={() => setSidebarCollapsed(p => !p)}
            className="w-full flex items-center justify-center p-2 rounded-lg text-[#9CA3AF] hover:text-[#1a56db] hover:bg-[#f0f4ff] dark:hover:bg-[#0F172A] transition-colors cursor-pointer"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronsRight size={14} />
            ) : (
              <ChevronsLeft size={14} />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
