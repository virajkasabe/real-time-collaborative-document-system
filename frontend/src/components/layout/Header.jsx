import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Bell, Sun, Moon, X, Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { createDoc } from '../../apis/api';
import NotificationBell from '../notifications/NotificationBell';

export default function Header({ onSearchChange, sidebarCollapsed, setSidebarCollapsed }) {
  const { user, triggerToast } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchVal, setSearchVal] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const displayName = user?.fullName || user?.name || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchVal);
    } else {
      navigate(`/documents?search=${encodeURIComponent(searchVal)}`);
    }
    setIsSearchOpen(false);
  };

  const handleCreateDocument = async () => {
    try {
      let title = "new doc";
      const newDoc = await createDoc(title);
      if (newDoc?.data?.data) {
        triggerToast('Document created successfully!', 'success');
        navigate(`/editor/${newDoc.data.data.doc._id}`);
      }
    } catch (error) {
      triggerToast(`${error.message}`, "warning");
      console.error("err", error);
    }
  };

  return (
    <header 
      className="h-[56px] shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-[#E5E7EB] dark:border-white/5 bg-white dark:bg-[#0B0F19] w-full z-50 transition-colors duration-300"
      style={{ position: 'relative', zIndex: 50 }}
    >

      {/* Left: Mobile Sidebar Toggle */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => setSidebarCollapsed(p => !p)}
          className="md:hidden p-1.5 rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Center: Search - Desktop */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-4 hidden sm:block">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search documents..."
            aria-label="Search documents"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              if (onSearchChange) onSearchChange(e.target.value);
            }}
            className="w-full pl-9 pr-4 py-2 bg-[#F7FAFF] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-full text-sm text-[#081B3A] dark:text-[#E5E7EB] placeholder-[#6B7280]/50 dark:placeholder-[#94A3B8]/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
      </form>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-x-0 top-0 h-16 px-4 bg-white dark:bg-[#0B0F19] border-b border-[#E5E7EB] dark:border-white/5 flex items-center gap-2 sm:hidden z-50">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search documents..."
              autoFocus
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              className="w-full pl-9 pr-4 py-2 bg-[#F7FAFF] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-full text-sm text-[#081B3A] dark:text-[#E5E7EB] placeholder-[#6B7280]/50 dark:placeholder-[#94A3B8]/50 focus:outline-none"
            />
          </form>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB]"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="sm:hidden p-2 rounded-xl text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-slate-100 dark:hover:bg-white/5 transition"
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        {/* New Document */}
        <button
          onClick={handleCreateDocument}
          aria-label="Create new document"
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition cursor-pointer shadow-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Document</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-xl text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Avatar */}
        <button
          aria-label="Profile menu"
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-blue-500/30 hover:ring-blue-500/60 transition flex-shrink-0 cursor-pointer"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              key={user.avatar}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {avatarLetter}
            </div>
          )}
        </button>
      </div>
    </header>
  );
}
