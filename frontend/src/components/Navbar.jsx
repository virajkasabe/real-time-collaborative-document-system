import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Plus, Menu } from 'lucide-react';
import ThemeToggle from './common/ThemeToggle';
import { useAuth } from '../context/AuthContext';

import { documentService } from '../utils/documentService';

import Button from './common/Button';
import NotificationBell from './notifications/NotificationBell';
import athenuraLogo from '../assets/athenura-logo.png';
import { useTheme } from '../context/ThemeContext';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { createDoc } from '../apis/api';

export default function Navbar({ onSearchChange, sidebarOpen, setSidebarOpen }) {
  const { user, logout, triggerToast } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
  const navigate = useNavigate();

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      forceUpdate(n => n + 1);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);
  const [searchVal, setSearchVal] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchVal);
    } else {
      navigate(`/documents?search=${encodeURIComponent(searchVal)}`);
    }
  };

  const handleCreateDocument = async() => {
    let title = "new doc";
    const newDoc = await createDoc(title);
    if (newDoc.data.doc) {
      triggerToast('Document created successfully!', 'success');
      navigate(`/editor/${newDoc.data.doc._id}`);
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    triggerToast('Logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <header className="h-14 bg-white/85 dark:bg-[#070B14]/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-white/10 sticky top-0 z-30 px-6 flex items-center justify-between transition-colors duration-300">
      
      {/* Mobile Sidebar Toggle & Logo */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-1.5 mr-2 rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors duration-300 cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center md:hidden">
          <img 
            src={athenuraLogo}
            alt="Athenura"
            className="h-8 w-auto object-contain"
            style={{ 
              maxWidth: '140px',
              filter: isDark 
                ? 'brightness(10)' 
                : 'brightness(0.2)',
              opacity: '0.95'
            }}
          />
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-[420px] relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#6B7280] dark:text-slate-500">
          <Search size={15} />
        </div>
        <input
          type="text"
          placeholder="Search documents..."
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value);
            if (onSearchChange) onSearchChange(e.target.value);
          }}
          className="w-full h-9 bg-[#F7FAFF] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-xl pl-10 pr-4 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]/50 text-[#081B3A] dark:text-[#E5E7EB] placeholder-[#6B7280]/50 dark:placeholder-[#94A3B8]/50 transition-all font-medium duration-300"
        />
      </form>

      {/* Utilities Control */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Create Document button */}
        <Button size="md" onClick={handleCreateDocument} icon={Plus} className="text-[13px] font-semibold px-3 h-9 inline-flex items-center shadow-sm shadow-blue-500/10">
          New Document
        </Button>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notifications bell */}
        <NotificationBell />

        {/* Profile Circle Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center rounded-full hover:ring-2 hover:ring-[#0D6EFD]/35 transition-all duration-300 shrink-0 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-indigo-600 flex items-center justify-center ring-2 ring-blue-500/30 hover:ring-blue-500/60 transition-all duration-200 flex-shrink-0">
              <span className="text-white text-sm font-extrabold uppercase">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-[260px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 text-left">
              {/* Header with avatar + name + email */}
              <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                {/* Avatar circle */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white font-bold text-base uppercase">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>

                {/* Name + email */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#0F172A] dark:text-white truncate capitalize">
                    {user?.name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-[#64748B] dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link to="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <FiUser className="text-[#2563EB] text-sm"/>
                  </div>
                  <span className="text-sm font-semibold text-[#0F172A] dark:text-white">
                    My Profile
                  </span>
                </Link>

                <Link to="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                    <FiSettings className="text-gray-500 text-sm"/>
                  </div>
                  <span className="text-sm font-semibold text-[#0F172A] dark:text-white">
                    System Settings
                  </span>
                </Link>

                <div className="h-px bg-gray-100 dark:bg-gray-700 mx-4 my-1"/>

                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <FiLogOut className="text-red-500 text-sm"/>
                  </div>
                  <span className="text-sm font-semibold text-red-500">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
