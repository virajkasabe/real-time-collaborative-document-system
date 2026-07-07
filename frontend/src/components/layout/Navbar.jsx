import React, {
  useEffect,
  useState,
} from 'react';

import {
  Menu,
  Plus,
  Search,
<<<<<<< HEAD
=======
  X,
>>>>>>> wind-breathing
} from 'lucide-react';
import {
  FiLogOut,
  FiSettings,
  FiUser,
} from 'react-icons/fi';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { createDoc } from '../../apis/api';
import athenuraLogo from '../../assets/athenura-logo.png';
import { useAuth } from '../../context/AuthContext';
<<<<<<< HEAD

import { useTheme } from '../../context/ThemeContext';

import { documentService } from '../../utils/documentService';

import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';
import NotificationBell from '../notifications/NotificationBell';
=======
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';
import NotificationBell from '../notifications/NotificationBell';
import { randomUser } from '../../../public';
>>>>>>> wind-breathing

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
<<<<<<< HEAD
  const [searchVal, setSearchVal] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
=======
  
  const [searchVal, setSearchVal] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
>>>>>>> wind-breathing

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchVal);
    } else {
      navigate(`/documents?search=${encodeURIComponent(searchVal)}`);
    }
<<<<<<< HEAD
  };

  const handleCreateDocument = async() => {
   let title = "new doc";
    try {
      const newDoc = await createDoc();
      console.log(`new doc`, newDoc)
    if (newDoc.data.data) {
      triggerToast('Document created successfully!', 'success');
      navigate(`/editor/${newDoc.data.data.doc._id}`);
    }
=======
    setIsSearchOpen(false);
  };

  const handleCreateDocument = async() => {
    let title = "new doc";
    try {
      const newDoc = await createDoc();
      console.log(`new doc`, newDoc)
      if (newDoc.data.data) {
        triggerToast('Document created successfully!', 'success');
        navigate(`/editor/${newDoc.data.data.doc._id}`);
      }
>>>>>>> wind-breathing
    } catch (error) {
      triggerToast(`${error.message}`, "warning")
      console.error("err",error)
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    triggerToast('Logged out successfully', 'success');
    navigate('/login');
  };

<<<<<<< HEAD
  return (
    <header className="h-14 bg-white/85 dark:bg-[#070B14]/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-white/10 sticky top-0 z-30 px-6 flex items-center justify-between transition-colors duration-300">
      
      {/* Mobile Sidebar Toggle & Logo */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-1.5 mr-2 rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors duration-300 cursor-pointer"
=======
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.profile-dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="h-14 bg-white/85 dark:bg-[#070B14]/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-white/10 sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between transition-colors duration-300">
      
      {/* Mobile Sidebar Toggle & Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-1.5 mr-1 sm:mr-2 rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors duration-300 cursor-pointer"
>>>>>>> wind-breathing
          aria-label="Toggle Sidebar"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center md:hidden">
          <img 
            src={athenuraLogo}
            alt="Athenura"
<<<<<<< HEAD
            className="h-8 w-auto object-contain"
            style={{ 
              maxWidth: '140px',
=======
            className="h-7 sm:h-8 w-auto object-contain"
            style={{ 
              maxWidth: '100px sm:max-w-[140px]',
>>>>>>> wind-breathing
              filter: isDark 
                ? 'brightness(10)' 
                : 'brightness(0.2)',
              opacity: '0.95'
            }}
          />
        </div>
      </div>

<<<<<<< HEAD
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-[420px] relative">
=======
      {/* Search Bar - Desktop */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-[420px] relative mx-4">
>>>>>>> wind-breathing
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

<<<<<<< HEAD
      {/* Utilities Control */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Create Document button */}
        <Button size="md" onClick={handleCreateDocument} icon={Plus} className="text-[13px] font-semibold px-3 h-9 inline-flex items-center shadow-sm shadow-blue-500/10">
          New Document
=======
      {/* Search Bar - Mobile */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-0 h-14 px-3 bg-white/95 dark:bg-[#070B14]/95 backdrop-blur-md flex items-center gap-2 md:hidden z-40 animate-slideDown">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#6B7280] dark:text-slate-500">
              <Search size={15} />
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchVal}
              autoFocus
              onChange={(e) => {
                setSearchVal(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              className="w-full h-9 bg-[#F7FAFF] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-xl pl-10 pr-4 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]/50 text-[#081B3A] dark:text-[#E5E7EB] placeholder-[#6B7280]/50 dark:placeholder-[#94A3B8]/50 transition-all font-medium duration-300"
            />
          </form>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Utilities Control */}
      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="md:hidden p-2 rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors duration-300"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        {/* Create Document button */}
        <Button 
          size="md" 
          onClick={handleCreateDocument} 
          icon={Plus} 
          className="text-[13px] font-semibold px-2 sm:px-3 h-8 sm:h-9 inline-flex items-center shadow-sm shadow-blue-500/10 text-xs sm:text-[13px]"
        >
          <span className="hidden sm:inline">New Document</span>
          <span className="sm:hidden">New</span>
>>>>>>> wind-breathing
        </Button>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notifications bell */}
        <NotificationBell />

        {/* Profile Circle Dropdown */}
<<<<<<< HEAD
        <div className="relative">
=======
        <div className="relative profile-dropdown">
>>>>>>> wind-breathing
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center rounded-full hover:ring-2 hover:ring-[#0D6EFD]/35 transition-all duration-300 shrink-0 cursor-pointer"
          >
<<<<<<< HEAD
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-indigo-600 flex items-center justify-center ring-2 ring-blue-500/30 hover:ring-blue-500/60 transition-all duration-200 flex-shrink-0">
              <span className="text-white text-sm font-extrabold uppercase">
                {
                    user.avatar === "" ? 
                    (
                        user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'
                    ) 
                    : 
                    (
                       <img src={user.avatar} alt="" className='rounded-full w-20 h-8 object-cover' />
                    )
=======
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-indigo-600 flex items-center justify-center ring-2 ring-blue-500/30 hover:ring-blue-500/60 transition-all duration-200 flex-shrink-0">
              <span className="text-white text-xs sm:text-sm font-extrabold uppercase">
                {
                  user.avatar === "" ? 
                  (
                    user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'
                  ) 
                  : 
                  (
                    <img src={user.avatar || randomUser } alt="" className='rounded-full w-8 h-8 sm:w-9 sm:h-9 object-cover' />
                  )
>>>>>>> wind-breathing
                }
              </span>
            </div>
          </button>

          {dropdownOpen && (
<<<<<<< HEAD
            <div className="absolute right-0 top-12 w-[260px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 text-left">
              {/* Header with avatar + name + email */}
              <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                {/* Avatar circle */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white font-bold text-base uppercase">
                    {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>

                {/* Name + email */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#0F172A] dark:text-white truncate capitalize">
                    {user?.fullName || user?.email?.split('@')[0] || 'User'}
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
=======
            <>
              {/* Backdrop for mobile */}
              <div 
                className="fixed inset-0 z-40 md:hidden" 
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-12 w-[260px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 text-left animate-slideDown">
                {/* Header with avatar + name + email */}
                <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                  {/* Avatar circle */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white font-bold text-base uppercase">
                      {
                        user.avatar === "" ? 
                        (
                          user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'
                        ) 
                        : 
                        (
                          <img src={user.avatar || randomUser } alt="" className='rounded-full w-10 h-10 object-cover' />
                        )
                      }
                    </span>
                  </div>

                  {/* Name + email */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#0F172A] dark:text-white truncate capitalize">
                      {user?.fullName || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-[#64748B] dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link to="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <FiUser className="text-[#2563EB] text-sm"/>
                    </div>
                    <span className="text-sm font-semibold text-[#0F172A] dark:text-white">
                      My Profile
                    </span>
                  </Link>

                  <Link to="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                      <FiSettings className="text-gray-500 text-sm"/>
                    </div>
                    <span className="text-sm font-semibold text-[#0F172A] dark:text-white">
                      System Settings
                    </span>
                  </Link>

                  <div className="h-px bg-gray-100 dark:bg-gray-700 mx-4 my-1"/>

                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <FiLogOut className="text-red-500 text-sm"/>
                    </div>
                    <span className="text-sm font-semibold text-red-500">
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            </>
>>>>>>> wind-breathing
          )}
        </div>

      </div>
    </header>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> wind-breathing
