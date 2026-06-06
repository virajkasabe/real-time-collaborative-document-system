import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Bell, LogOut, User, FolderDot } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { documentService } from '../../services/documentService';
import Button from '../common/Button';

export default function Navbar({ onSearchChange }) {
  const { user, logout, triggerToast } = useAuth();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchVal);
    } else {
      navigate(`/documents?search=${encodeURIComponent(searchVal)}`);
    }
  };

  const handleCreateDocument = () => {
    const newDoc = documentService.create('Untitled Document', 'blank', user?.email, user?.name);
    if (newDoc) {
      triggerToast('Document created successfully!', 'success');
      navigate(`/editor/${newDoc.id}`);
    }
  };

  return (
    <header className="h-14 bg-white/85 dark:bg-[#070B14]/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-white/10 sticky top-0 z-30 px-6 flex items-center justify-between transition-colors duration-300">
      
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
      <div className="flex items-center gap-3">
        
        {/* Create Document button */}
        <Button size="md" onClick={handleCreateDocument} icon={Plus} className="text-[13px] font-semibold px-3 h-9 inline-flex items-center shadow-sm shadow-blue-500/10">
          New Document
        </Button>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notifications mock bell */}
        <button
          onClick={() => triggerToast('No unread notifications', 'info')}
          className="p-1.5 rounded-lg text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A] transition-colors duration-300"
        >
          <Bell size={15} />
        </button>

        {/* Profile Circle Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center rounded-full hover:ring-2 hover:ring-[#0D6EFD]/35 transition-all duration-300 shrink-0"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256'}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB] dark:border-[#0D6EFD]/25 transition-colors duration-300"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 glass-card shadow-md p-1.5 z-50 border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-[#0F172A] transition-colors duration-300 rounded-xl text-left select-none">
              <div className="px-2.5 py-1.5 border-b border-[#E5E7EB] dark:border-white/10">
                <p className="font-bold text-xs text-[#081B3A] dark:text-[#E5E7EB] truncate">{user?.name}</p>
                <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]/60 truncate">{user?.email}</p>
              </div>

              <div className="mt-1.5 space-y-0.5">
                <button
                  onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[11px] font-semibold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/40 transition-colors duration-300"
                >
                  <User size={13} className="text-[#0D6EFD]" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[11px] font-semibold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#081B3A] dark:hover:text-[#E5E7EB] hover:bg-[#E5E7EB]/40 dark:hover:bg-[#0F172A]/40 transition-colors duration-300"
                >
                  <FolderDot size={13} className="text-[#0D6EFD]" />
                  <span>System Settings</span>
                </button>
                <button
                  onClick={() => { setProfileOpen(false); logout(); navigate('/login'); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-t border-[#E5E7EB] dark:border-white/10 mt-1 transition-colors duration-300"
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
