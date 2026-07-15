import { useState, useEffect } from 'react';
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
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import athenuraCircle from '../assets/athenura-circle.png';
import athenuraLogo from '../assets/athenura-logo.png';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { theme } = useTheme();
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
      className={`glass-panel h-full z-40 flex flex-col justify-between transition-all duration-300 border-r border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#080E1A] select-none text-left shrink-0 relative
        absolute md:static top-0 left-0
        ${sidebarOpen 
          ? 'w-[240px] translate-x-0 overflow-y-auto' 
          : 'w-0 md:w-[64px] -translate-x-full md:translate-x-0 overflow-hidden md:overflow-visible border-none md:border-r'
        }
      `}
    >


      {/* Top Branding & Main Navigation */}
      <div className={`flex-1 flex flex-col min-h-0 ${sidebarOpen ? 'overflow-y-auto' : 'overflow-visible md:overflow-visible'}`}>
        {/* Header Branding */}
        <div className="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-700/50 shrink-0 relative overflow-hidden">
          {/* Full Logo for expanded state */}
          <img
            src={athenuraLogo}
            alt="Athenura"
            className={`absolute h-8 w-auto object-contain transition-all duration-300 left-4 ${
              sidebarOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
            }`}
            style={{
              maxWidth: '140px',
              mixBlendMode: blendMode
            }}
          />
          {/* Circle Logo for collapsed state */}
          <img 
            src={athenuraCircle} 
            alt="Athenura" 
            className={`absolute w-7 h-7 object-contain transition-all duration-300 left-1/2 -translate-x-1/2 ${
              !sidebarOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
            }`}
            style={{ mixBlendMode: blendMode }}
          />
        </div>

        {/* Primary Navigation Menu */}
        <nav className="mt-3 px-2 space-y-1 shrink-0">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveLink(item.path);
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`w-full flex items-center rounded-lg text-[13.5px] ${isActive ? 'font-semibold text-[#0D6EFD]' : 'font-medium text-[#6B7280] dark:text-[#94A3B8]/65 hover:text-[#081B3A] dark:hover:text-[#E5E7EB]'} transition-all duration-300 group relative h-10 px-3
                  ${sidebarOpen ? 'justify-start gap-2.5' : 'justify-center'}
                  ${isActive 
                    ? 'bg-[#0D6EFD]/10 dark:bg-[#0D6EFD]/20 shadow-sm' 
                    : 'hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/30'
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#0D6EFD] rounded-r-full" />
                )}
                
                <Icon 
                  size={18} 
                  className={`shrink-0 transition-colors duration-300
                    ${isActive ? 'text-[#0D6EFD]' : 'text-[#6B7280] dark:text-[#94A3B8]/80 group-hover:text-[#081B3A] dark:group-hover:text-[#E5E7EB]'}
                  `}
                />
                
                <span className={`truncate transition-all duration-300 whitespace-nowrap text-left ${
                  sidebarOpen ? 'opacity-100 translate-x-0 w-auto ml-2.5' : 'opacity-0 -translate-x-2 w-0 pointer-events-none'
                }`}>
                  {item.name}
                </span>

                {!sidebarOpen && (
                  <div className="absolute left-[70px] top-1/2 -translate-y-1/2 bg-[#0F172A] dark:bg-[#1E293B] text-white dark:text-gray-100 text-xs px-2.5 py-1.5 rounded-md shadow-xl border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-200 whitespace-nowrap z-50 flex items-center font-medium">
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#0F172A] dark:bg-[#1E293B] border-l border-b border-white/10"></div>
                    <span className="relative z-10">{item.name}</span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sidebar Menu */}
      <div className={`border-t border-[#E5E7EB] dark:border-white/10 bg-slate-50/50 dark:bg-[#060B14] shrink-0 ${sidebarOpen ? 'p-3' : 'p-2'} ${sidebarOpen ? 'overflow-y-auto' : 'overflow-visible md:overflow-visible'}`}>
        <div className="space-y-1.5">
          {/* Profile Shortcut */}
          <NavLink
            to="/profile"
            className={`w-full flex items-center rounded-lg text-[13.5px] ${isActiveLink('/profile') ? 'font-semibold text-[#0D6EFD]' : 'font-medium text-[#6B7280] dark:text-[#94A3B8]/65 hover:text-[#081B3A] dark:hover:text-[#E5E7EB]'} transition-all duration-300 group relative h-10 px-3
              ${sidebarOpen ? 'justify-start gap-2.5' : 'justify-center'}
              ${isActiveLink('/profile')
                ? 'bg-[#0D6EFD]/10 dark:bg-[#0D6EFD]/20 shadow-sm'
                : 'hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/30'
              }
            `}
          >
            {isActiveLink('/profile') && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#0D6EFD] rounded-r-full" />
            )}
            <User size={18} className={`shrink-0 transition-colors duration-300 ${isActiveLink('/profile') ? 'text-[#0D6EFD]' : 'text-[#6B7280] dark:text-[#94A3B8]/80 group-hover:text-[#081B3A] dark:group-hover:text-[#E5E7EB]'}`} />
            <span className={`truncate transition-all duration-300 whitespace-nowrap text-left ${
              sidebarOpen ? 'opacity-100 translate-x-0 w-auto ml-2.5' : 'opacity-0 -translate-x-2 w-0 pointer-events-none'
            }`}>
              Profile
            </span>
            {!sidebarOpen && (
              <div className="absolute left-[70px] top-1/2 -translate-y-1/2 bg-[#0F172A] dark:bg-[#1E293B] text-white dark:text-gray-100 text-xs px-2.5 py-1.5 rounded-md shadow-xl border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-200 whitespace-nowrap z-50 flex items-center font-medium">
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#0F172A] dark:bg-[#1E293B] border-l border-b border-white/10"></div>
                <span className="relative z-10">Click to expand sidebar</span>
              </div>
            )}
          </NavLink>

          {/* Settings Shortcut */}
          <NavLink
            to="/settings"
            className={`w-full flex items-center rounded-lg text-[13.5px] ${isActiveLink('/settings') ? 'font-semibold text-[#0D6EFD]' : 'font-medium text-[#6B7280] dark:text-[#94A3B8]/65 hover:text-[#081B3A] dark:hover:text-[#E5E7EB]'} transition-all duration-300 group relative h-10 px-3
              ${sidebarOpen ? 'justify-start gap-2.5' : 'justify-center'}
              ${isActiveLink('/settings')
                ? 'bg-[#0D6EFD]/10 dark:bg-[#0D6EFD]/20 shadow-sm'
                : 'hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/30'
              }
            `}
          >
            {isActiveLink('/settings') && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#0D6EFD] rounded-r-full" />
            )}
            <Settings size={18} className={`shrink-0 transition-colors duration-300 ${isActiveLink('/settings') ? 'text-[#0D6EFD]' : 'text-[#6B7280] dark:text-[#94A3B8]/80 group-hover:text-[#081B3A] dark:group-hover:text-[#E5E7EB]'}`} />
            <span className={`truncate transition-all duration-300 whitespace-nowrap text-left ${
              sidebarOpen ? 'opacity-100 translate-x-0 w-auto ml-2.5' : 'opacity-0 -translate-x-2 w-0 pointer-events-none'
            }`}>
              Settings
            </span>
            {!sidebarOpen && (
              <div className="absolute left-[70px] top-1/2 -translate-y-1/2 bg-[#0F172A] dark:bg-[#1E293B] text-white dark:text-gray-100 text-xs px-2.5 py-1.5 rounded-md shadow-xl border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-200 whitespace-nowrap z-50 flex items-center font-medium">
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#0F172A] dark:bg-[#1E293B] border-l border-b border-white/10"></div>
                <span className="relative z-10">Settings</span>
              </div>
            )}
          </NavLink>

          {/* Logout Trigger */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center rounded-lg text-[13.5px] font-medium text-rose-600 dark:text-rose-500 opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer relative h-10 px-3 group
              ${sidebarOpen ? 'justify-start gap-2.5' : 'justify-center'}
              hover:bg-rose-50 dark:hover:bg-rose-950/20
            `}
          >
            <LogOut size={18} className="shrink-0 text-rose-500 group-hover:scale-105 transition-transform duration-300" />
            <span className={`truncate transition-all duration-300 whitespace-nowrap text-left ${
              sidebarOpen ? 'opacity-100 translate-x-0 w-auto ml-2.5' : 'opacity-0 -translate-x-2 w-0 pointer-events-none'
            }`}>
              Logout
            </span>
            {!sidebarOpen && (
              <div className="absolute left-[70px] top-1/2 -translate-y-1/2 bg-[#0F172A] dark:bg-[#1E293B] text-white dark:text-gray-100 text-xs px-2.5 py-1.5 rounded-md shadow-xl border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-200 whitespace-nowrap z-50 flex items-center font-medium">
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#0F172A] dark:bg-[#1E293B] border-l border-b border-white/10"></div>
                <span className="relative z-10">Logout</span>
              </div>
            )}
          </button>


        </div>
      </div>
    </aside>
  );
}
