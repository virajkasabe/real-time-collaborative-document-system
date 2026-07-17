import React, { useState, useRef } from 'react';
import {
  Check,
  FileText,
  Lock,
  Star,
  User,
  Users,
  X,
  Mail,
  Calendar,
  Award,
  Settings,
  Edit2,
  Shield,
  Zap,
  Menu,
  ChevronRight,
  Camera,
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { documentService } from '../../services/documentService';

export default function Profile() {
  const { user, triggerToast, updateUser } = useAuth();
  const { sidebarOpen } = useOutletContext();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.fullName || user?.name || '');
  const [isEditing, setIsEditing] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar || ''
  );
  const avatarInputRef = useRef(null);

  // Avatar click handler — triggers file input
  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  // File selected handler
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      triggerToast('Select an image file', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      triggerToast('Max 2MB allowed', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setAvatarPreview(base64);          // immediate UI update
      
      // Save to localStorage
      const stored = JSON.parse(
        localStorage.getItem('collabdocs_user') || '{}'
      );
      const updatedUser = { ...stored, avatar: base64 };
      localStorage.setItem('collabdocs_user', JSON.stringify(updatedUser));

      if (updateUser) {
        updateUser({ avatar: base64 });    // update context
      }
      triggerToast('Avatar updated!', 'success');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!name.trim()) return;

    if (user) {
      const updatedUser = { ...user, fullName: name.trim(), name: name.trim() };
      localStorage.setItem('collabdocs_user', JSON.stringify(updatedUser));
    }

    triggerToast('Profile updated successfully!', 'success');
    setIsEditing(false);

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const allDocs = documentService.getAll();
  const ownedDocsCount = allDocs.filter(d => d.owner?.email === user?.email).length;
  const sharedDocsCount = documentService.getShared(user?.email).length;
  const starredDocsCount = documentService.getStarred().filter(d => 
    d.owner?.email === user?.email || d.sharedUsers?.some(u => u.email === user?.email)
  ).length;

  // Get user initials
  const getInitials = () => {
    if (user?.fullName) {
      const names = user.fullName.split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return user.fullName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="p-4 sm:p-5 md:p-8 space-y-4 sm:space-y-6 md:space-y-8 max-w-5xl w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-gradient-to-r from-[#0D6EFD] to-[#6C63FF] pb-4 sm:pb-5 transition-all duration-300 select-none relative">
        <div className="absolute bottom-0 left-0 w-20 sm:w-24 md:w-32 h-0.5 bg-gradient-to-r from-[#0D6EFD] to-[#6C63FF] rounded-full"></div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#0D6EFD]/10 to-[#6C63FF]/10 rounded-lg sm:rounded-xl">
            <User size={16} className="sm:text-[20px] text-[#0D6EFD] dark:text-[#6C63FF]" />
          </div>
          <div>
            <h2 className="font-sans font-extrabold text-base sm:text-xl md:text-2xl text-[#081B3A] dark:text-white tracking-tight">
              Profile Settings
            </h2>
            <p className="text-[10px] sm:text-xs text-[#6B7280] dark:text-[#94A3B8] font-medium mt-0.5 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-[#0D6EFD] rounded-full inline-block"></span>
              <span className="hidden xs:inline">Manage your personal information and account preferences</span>
              <span className="xs:hidden">Manage your profile</span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 sm:mt-0">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => { setIsEditing(false); setName(user?.fullName || user?.name || ''); }} 
                icon={X}
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800/30 dark:text-red-400 dark:hover:bg-red-900/20 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5"
              >
                <span className="hidden xs:inline">Cancel</span>
                <span className="xs:hidden">✕</span>
              </Button>
              <Button 
                onClick={handleSave} 
                type="submit" 
                variant="primary" 
                icon={Check}
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5"
              >
                <span className="hidden xs:inline">Save changes</span>
                <span className="xs:hidden">Save</span>
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => navigate('/reset-password')} 
                icon={Lock}
                size="sm"
                className="border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-800/30 dark:text-amber-400 dark:hover:bg-amber-900/20 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5"
              >
                <span className="hidden sm:inline">Reset Password</span>
                {/* <Lock size={14} className="sm:hidden" /> */}
              </Button>
              <Button 
                onClick={() => setIsEditing(true)} 
                icon={Edit2}
                size="sm"
                className="bg-gradient-to-r from-[#0D6EFD] to-[#6C63FF] hover:shadow-lg hover:shadow-[#0D6EFD]/30 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5"
              >
                <span className="hidden xs:inline">Edit Profile</span>
                <span className="xs:hidden">Edit</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        
        {/* Left: Profile Summary Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#0F172A] to-[#1A2332] dark:from-[#0F172A] dark:to-[#1A2332] border border-[#E5E7EB] dark:border-white/10 rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl shadow-[#0D6EFD]/5 dark:shadow-[#6C63FF]/5 flex flex-col items-center text-center space-y-3 sm:space-y-4 transition-all duration-300 hover:shadow-2xl hover:shadow-[#0D6EFD]/10 dark:hover:shadow-[#6C63FF]/10">
          <div className="relative w-24 h-24 mx-auto">
            {/* Avatar image or initial */}
            <div
              onClick={handleAvatarClick}
              className="w-24 h-24 rounded-full overflow-hidden
                cursor-pointer group relative
                ring-4 ring-blue-500/30 shadow-xl">

              {avatarPreview || user?.avatar ? (
                <img
                  key={avatarPreview || user?.avatar}
                  src={avatarPreview || user?.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={() => setAvatarPreview('')}
                />
              ) : (
                <div className="w-full h-full rounded-full
                  bg-gradient-to-br from-[#2563EB] to-indigo-600
                  flex items-center justify-center">
                  <span className="text-white text-4xl font-extrabold
                    uppercase">
                    {user?.fullName?.charAt(0) ||
                     user?.email?.charAt(0) ||
                     'U'}
                  </span>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60
                opacity-0 hover:opacity-100 transition-opacity
                rounded-full flex flex-col items-center
                justify-center gap-1">
                <Camera size={18} className="text-white" />
                <span className="text-white text-[10px] font-medium">
                  Change
                </span>
              </div>
            </div>

            {/* Hidden file input — OUTSIDE the clickable div */}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />

            {/* Remove photo button */}
            {(avatarPreview || user?.avatar) && (
              <button
                type="button"
                onClick={() => {
                  setAvatarPreview('');
                  if (updateUser) updateUser({ avatar: '' });
                  const stored = JSON.parse(
                    localStorage.getItem('collabdocs_user') || '{}'
                  );
                  stored.avatar = '';
                  localStorage.setItem(
                    'collabdocs_user',
                    JSON.stringify(stored)
                  );
                  triggerToast('Avatar removed', 'success');
                }}
                className="absolute -bottom-1 -right-1
                  bg-red-500 hover:bg-red-600 text-white
                  rounded-full w-6 h-6 flex items-center
                  justify-center text-xs transition cursor-pointer"
                title="Remove photo">
                ✕
              </button>
            )}
          </div>

          {/* Helper text */}
          <p className="text-[11px] text-gray-500 text-center mt-2">
            Click to change • Max 2MB
          </p>

          <div className="space-y-1 sm:space-y-1.5">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mt-2 capitalize">
              {user?.fullName || user?.name || user?.email?.split('@')[0] || 'User'}
            </h3>
            <div className="flex items-center justify-center gap-1.5">
              <Mail size={10} sm:size={12} className="text-[#94A3B8]" />
              <p className="text-[10px] sm:text-xs text-[#94A3B8] font-medium truncate max-w-[150px] sm:max-w-[200px]">
                {user?.email}
              </p>
            </div>
          </div>

          {/* User Info Badges */}
          <div className="w-full pt-3 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {user?.isEmailVerified && (
                <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[8px] sm:text-[10px] font-semibold">
                  <Shield size={10} sm:size={12} />
                  Verified
                </span>
              )}
              {user?.userLoginType && (
                <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-blue-500/20 text-blue-400 rounded-full text-[8px] sm:text-[10px] font-semibold">
                  <User size={10} sm:size={12} />
                  {user.userLoginType}
                </span>
              )}
              {user?.createdAt && (
                <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-purple-500/20 text-purple-400 rounded-full text-[8px] sm:text-[10px] font-semibold">
                  <Calendar size={10} sm:size={12} />
                  {formatDate(user.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Information Column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          
          {/* Personal Information Card */}
          <div className="bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg shadow-[#0D6EFD]/5 dark:shadow-[#6C63FF]/5 transition-all duration-300 hover:shadow-xl hover:shadow-[#0D6EFD]/10 dark:hover:shadow-[#6C63FF]/10">
            <div className="flex items-center gap-2 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-[#E5E7EB] dark:border-white/10">
              <div className="p-1 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-lg">
                <Settings size={12} sm:size={14} className="text-white" />
              </div>
              <h3 className="text-[10px] sm:text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider">
                Personal Information
              </h3>
              <div className="flex-1 border-b border-dashed border-[#E5E7EB] dark:border-white/5"></div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
                <div className="relative">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="border-[#E5E7EB] dark:border-white/10 focus:border-[#0D6EFD] dark:focus:border-[#6C63FF] focus:ring-2 focus:ring-[#0D6EFD]/20 dark:focus:ring-[#6C63FF]/20 text-sm sm:text-base"
                  />
                  <div className="absolute right-3 top-8 sm:top-9 text-[#0D6EFD] dark:text-[#6C63FF]">
                    <Edit2 size={14} sm:size={16} />
                  </div>
                </div>

                <div className="relative">
                  <Input
                    label="Email Address"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-[#F8FAFC] dark:bg-[#0A0F1A] border-[#E5E7EB] dark:border-white/5 cursor-not-allowed text-sm sm:text-base"
                  />
                  <div className="absolute right-3 top-8 sm:top-9 text-[#6B7280]">
                    <Lock size={14} sm:size={16} />
                  </div>
                </div>

                {user?.userLoginType && (
                  <div className="relative">
                    <Input
                      label="Login Type"
                      type="text"
                      value={user.userLoginType}
                      disabled
                      className="bg-[#F8FAFC] dark:bg-[#0A0F1A] border-[#E5E7EB] dark:border-white/5 cursor-not-allowed text-sm sm:text-base"
                    />
                    <div className="absolute right-3 top-8 sm:top-9 text-[#6B7280]">
                      <User size={14} sm:size={16} />
                    </div>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => { setIsEditing(false); setName(user?.fullName || user?.name || ''); }} 
                    icon={X}
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800/30 dark:text-red-400 dark:hover:bg-red-900/20 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    icon={Check}
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5"
                  >
                    Save changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 py-2 sm:py-3 px-3 sm:px-4 bg-[#F8FAFC] dark:bg-[#0A0F1A] rounded-lg sm:rounded-xl border border-[#E5E7EB] dark:border-white/5 hover:border-[#0D6EFD]/20 dark:hover:border-[#6C63FF]/20 transition-all group">
                  <span className="text-[10px] sm:text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8] flex items-center gap-1.5 sm:gap-2">
                    <User size={12} sm:size={14} className="text-[#0D6EFD] dark:text-[#6C63FF]" />
                    <span className="hidden xs:inline">Full Name</span>
                    <span className="xs:hidden">Name</span>
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#081B3A] dark:text-white group-hover:text-[#0D6EFD] dark:group-hover:text-[#6C63FF] transition-colors truncate max-w-[150px] sm:max-w-none">
                    {user?.fullName || user?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 py-2 sm:py-3 px-3 sm:px-4 bg-[#F8FAFC] dark:bg-[#0A0F1A] rounded-lg sm:rounded-xl border border-[#E5E7EB] dark:border-white/5 hover:border-[#0D6EFD]/20 dark:hover:border-[#6C63FF]/20 transition-all group">
                  <span className="text-[10px] sm:text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8] flex items-center gap-1.5 sm:gap-2">
                    <Mail size={12} sm:size={14} className="text-purple-500" />
                    <span className="hidden xs:inline">Email Address</span>
                    <span className="xs:hidden">Email</span>
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#081B3A] dark:text-white truncate max-w-[150px] sm:max-w-xs group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                    {user?.email || 'N/A'}
                  </span>
                </div>
                {user?.userLoginType && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 py-2 sm:py-3 px-3 sm:px-4 bg-[#F8FAFC] dark:bg-[#0A0F1A] rounded-lg sm:rounded-xl border border-[#E5E7EB] dark:border-white/5 hover:border-[#0D6EFD]/20 dark:hover:border-[#6C63FF]/20 transition-all group">
                    <span className="text-[10px] sm:text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8] flex items-center gap-1.5 sm:gap-2">
                      <User size={12} sm:size={14} className="text-blue-500" />
                      <span className="hidden xs:inline">Login Type</span>
                      <span className="xs:hidden">Login</span>
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#081B3A] dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {user.userLoginType}
                    </span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-lg sm:rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                  <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 sm:gap-2">
                    <Zap size={12} sm:size={14} />
                    <span className="hidden xs:inline">Account Status</span>
                    <span className="xs:hidden">Status</span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    {user?.isEmailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                {user?.createdAt && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 py-2 sm:py-3 px-3 sm:px-4 bg-[#F8FAFC] dark:bg-[#0A0F1A] rounded-lg sm:rounded-xl border border-[#E5E7EB] dark:border-white/5">
                    <span className="text-[10px] sm:text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8] flex items-center gap-1.5 sm:gap-2">
                      <Calendar size={12} sm:size={14} className="text-purple-500" />
                      <span className="hidden xs:inline">Member Since</span>
                      <span className="xs:hidden">Joined</span>
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#081B3A] dark:text-white">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button 
              onClick={() => navigate('/documents')}
              className="bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg shadow-[#0D6EFD]/5 dark:shadow-[#6C63FF]/5 hover:shadow-xl hover:shadow-[#0D6EFD]/10 dark:hover:shadow-[#6C63FF]/10 transition-all duration-300 hover:border-[#0D6EFD]/20 dark:hover:border-[#6C63FF]/20 group"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#0D6EFD]/20 to-[#6C63FF]/20 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform">
                  <FileText size={14} sm:size={18} className="text-[#0D6EFD] dark:text-[#6C63FF]" />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-bold text-[#081B3A] dark:text-white">My Docs</p>
                  <p className="text-[8px] sm:text-[10px] text-[#6B7280] dark:text-[#94A3B8] hidden xs:block">View all documents</p>
                </div>
              </div>
            </button>
            <button 
              onClick={() => navigate('/shared')}
              className="bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg shadow-purple-500/5 dark:shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/10 transition-all duration-300 hover:border-purple-500/20 dark:hover:border-purple-500/20 group"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform">
                  <Users size={14} sm:size={18} className="text-purple-500" />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-bold text-[#081B3A] dark:text-white">Shared</p>
                  <p className="text-[8px] sm:text-[10px] text-[#6B7280] dark:text-[#94A3B8] hidden xs:block">Shared with you</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}