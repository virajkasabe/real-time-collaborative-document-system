import React, { useState } from 'react';
import {
  Check,
  FileText,
  Lock,
  User,
  Users,
  X,
  Mail,
  Calendar,
  Settings,
  Edit2,
  Shield,
  Zap,
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { documentService } from '../../services/documentService';
import { useTheme } from '../../context/ThemeContext';

export default function Profile() {
  const { user, triggerToast } = useAuth();
  const { sidebarOpen } = useOutletContext();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [name, setName] = useState(user?.fullName || user?.name || '');
  const [isEditing, setIsEditing] = useState(false);

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

  // Get theme-based styles
  const getThemeStyles = () => {
    return {
      bgPrimary: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
      bgSecondary: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50',
      bgCard: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
      bgGradient: theme === 'dark' 
        ? 'from-gray-900 to-gray-800' 
        : 'from-primary-50 to-secondary-50',
      textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
      textMuted: theme === 'dark' ? 'text-gray-500' : 'text-gray-600',
      borderColor: theme === 'dark' ? 'border-white/10' : 'border-gray-200',
      borderHover: theme === 'dark' ? 'hover:border-secondary-500/20' : 'hover:border-primary-500/20',
      shadowColor: theme === 'dark' ? 'shadow-secondary-500/5' : 'shadow-primary-500/5',
      shadowHover: theme === 'dark' ? 'hover:shadow-secondary-500/10' : 'hover:shadow-primary-500/10',
      inputBg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50',
      inputBorder: theme === 'dark' ? 'border-white/5' : 'border-gray-200',
      accentColor: theme === 'dark' ? 'text-secondary-500' : 'text-primary-500',
      accentHover: theme === 'dark' ? 'group-hover:text-secondary-500' : 'group-hover:text-primary-500',
    };
  };

  const styles = getThemeStyles();

  return (
    <div className={`p-4 sm:p-5 md:p-8 space-y-4 sm:space-y-6 md:space-y-8 max-w-5xl w-full mx-auto ${theme}`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 pb-4 sm:pb-5 transition-all duration-300 select-none relative border-gradient-to-r from-primary-500 to-secondary-500">
        <div className="absolute bottom-0 left-0 w-20 sm:w-24 md:w-32 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`p-1.5 sm:p-2 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-lg sm:rounded-xl`}>
            <User size={16} className={`sm:text-[20px] ${styles.accentColor}`} />
          </div>
          <div>
            <h2 className={`font-sans font-extrabold text-base sm:text-xl md:text-2xl ${styles.textPrimary} tracking-tight`}>
              Profile Settings
            </h2>
            <p className={`text-[10px] sm:text-xs ${styles.textSecondary} font-medium mt-0.5 flex items-center gap-1.5`}>
              <span className="w-1 h-1 bg-primary-500 rounded-full inline-block"></span>
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
              </Button>
              <Button 
                onClick={() => setIsEditing(true)} 
                icon={Edit2}
                size="sm"
                className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:shadow-primary-500/30 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 text-white"
              >
                <span className="hidden xs:inline">Edit Profile</span>
                <span className="xs:hidden">Edit</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        
        {/* Left Column - Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className={`bg-gradient-to-br ${theme === 'dark' ? 'from-gray-900 to-gray-800' : 'from-primary-50 to-secondary-50'} border ${styles.borderColor} rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl ${styles.shadowColor} flex flex-col items-center text-center space-y-3 sm:space-y-4 transition-all duration-300 ${styles.shadowHover}`}>
            
            {/* Avatar */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center mx-auto shadow-2xl ring-4 ring-primary-500/30 hover:ring-secondary-500/50 transition-all duration-300 overflow-hidden">
                {user?.avatar && user.avatar !== "" ? (
                  <img 
                    src={user.avatar} 
                    alt={user?.fullName || 'User'} 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase">
                    {getInitials()}
                  </span>
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 ${theme === 'dark' ? 'border-gray-900' : 'border-white'}`}>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className={`text-base sm:text-lg md:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mt-2 capitalize`}>
                {user?.fullName || user?.name || user?.email?.split('@')[0] || 'User'}
              </h3>
              <div className="flex items-center justify-center gap-1.5">
                <Mail size={10} sm:size={12} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                <p className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-medium truncate max-w-[150px] sm:max-w-[200px]`}>
                  {user?.email}
                </p>
              </div>
            </div>

            {/* User Badges */}
            <div className={`w-full pt-3 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
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
        </div>

        {/* Right Column - Information and Actions */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          
          {/* Personal Information Card */}
          <div className={`${styles.bgCard} border ${styles.borderColor} rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg ${styles.shadowColor} transition-all duration-300 ${styles.shadowHover}`}>
            <div className="flex items-center gap-2 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b ${styles.borderColor}">
              <div className="p-1 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-lg">
                <Settings size={12} sm:size={14} className="text-white" />
              </div>
              <h3 className={`text-[10px] sm:text-xs font-bold ${styles.textSecondary} uppercase tracking-wider`}>
                Personal Information
              </h3>
              <div className={`flex-1 border-b border-dashed ${styles.borderColor}`}></div>
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
                    className={`border ${styles.inputBorder} focus:border-primary-500 dark:focus:border-secondary-500 focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-secondary-500/20 text-sm sm:text-base ${styles.bgCard}`}
                  />
                  <div className={`absolute right-3 top-8 sm:top-9 ${styles.accentColor}`}>
                    <Edit2 size={14} sm:size={16} />
                  </div>
                </div>

                <div className="relative">
                  <Input
                    label="Email Address"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className={`${styles.inputBg} border ${styles.inputBorder} cursor-not-allowed text-sm sm:text-base`}
                  />
                  <div className="absolute right-3 top-8 sm:top-9 text-gray-500">
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
                      className={`${styles.inputBg} border ${styles.inputBorder} cursor-not-allowed text-sm sm:text-base`}
                    />
                    <div className="absolute right-3 top-8 sm:top-9 text-gray-500">
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
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 text-white"
                  >
                    Save changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {/* Full Name */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 py-2 sm:py-3 px-3 sm:px-4 ${styles.bgSecondary} rounded-lg sm:rounded-xl border ${styles.borderColor} ${styles.borderHover} transition-all group`}>
                  <span className={`text-[10px] sm:text-xs font-semibold ${styles.textSecondary} flex items-center gap-1.5 sm:gap-2`}>
                    <User size={12} sm:size={14} className={styles.accentColor} />
                    <span className="hidden xs:inline">Full Name</span>
                    <span className="xs:hidden">Name</span>
                  </span>
                  <span className={`text-xs sm:text-sm font-bold ${styles.textPrimary} ${styles.accentHover} transition-colors truncate max-w-[150px] sm:max-w-none`}>
                    {user?.fullName || user?.name || 'N/A'}
                  </span>
                </div>

                {/* Email */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 py-2 sm:py-3 px-3 sm:px-4 ${styles.bgSecondary} rounded-lg sm:rounded-xl border ${styles.borderColor} ${styles.borderHover} transition-all group`}>
                  <span className={`text-[10px] sm:text-xs font-semibold ${styles.textSecondary} flex items-center gap-1.5 sm:gap-2`}>
                    <Mail size={12} sm:size={14} className="text-purple-500" />
                    <span className="hidden xs:inline">Email Address</span>
                    <span className="xs:hidden">Email</span>
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-xs group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                    {user?.email || 'N/A'}
                  </span>
                </div>

                {/* Login Type */}
                {user?.userLoginType && (
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 py-2 sm:py-3 px-3 sm:px-4 ${styles.bgSecondary} rounded-lg sm:rounded-xl border ${styles.borderColor} ${styles.borderHover} transition-all group`}>
                    <span className={`text-[10px] sm:text-xs font-semibold ${styles.textSecondary} flex items-center gap-1.5 sm:gap-2`}>
                      <User size={12} sm:size={14} className="text-blue-500" />
                      <span className="hidden xs:inline">Login Type</span>
                      <span className="xs:hidden">Login</span>
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                      {user.userLoginType}
                    </span>
                  </div>
                )}

                {/* Account Status */}
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

                {/* Member Since */}
                {user?.createdAt && (
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 py-2 sm:py-3 px-3 sm:px-4 ${styles.bgSecondary} rounded-lg sm:rounded-xl border ${styles.borderColor}`}>
                    <span className={`text-[10px] sm:text-xs font-semibold ${styles.textSecondary} flex items-center gap-1.5 sm:gap-2`}>
                      <Calendar size={12} sm:size={14} className="text-purple-500" />
                      <span className="hidden xs:inline">Member Since</span>
                      <span className="xs:hidden">Joined</span>
                    </span>
                    <span className={`text-xs sm:text-sm font-bold ${styles.textPrimary}`}>
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
              className={`${styles.bgCard} border ${styles.borderColor} rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg ${styles.shadowColor} hover:shadow-xl ${styles.shadowHover} transition-all duration-300 ${styles.borderHover} group`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform">
                  <FileText size={14} sm:size={18} className={styles.accentColor} />
                </div>
                <div className="text-left">
                  <p className={`text-xs sm:text-sm font-bold ${styles.textPrimary}`}>My Docs</p>
                  <p className={`text-[8px] sm:text-[10px] ${styles.textSecondary} hidden xs:block`}>View all documents</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/shared')}
              className={`${styles.bgCard} border ${styles.borderColor} rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg shadow-purple-500/5 dark:shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/10 transition-all duration-300 hover:border-purple-500/20 dark:hover:border-purple-500/20 group`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform">
                  <Users size={14} sm:size={18} className="text-purple-500" />
                </div>
                <div className="text-left">
                  <p className={`text-xs sm:text-sm font-bold ${styles.textPrimary}`}>Shared</p>
                  <p className={`text-[8px] sm:text-[10px] ${styles.textSecondary} hidden xs:block`}>Shared with you</p>
                </div>
              </div>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className={`${styles.bgCard} border ${styles.borderColor} rounded-lg sm:rounded-xl p-3 sm:p-4 text-center shadow-sm transition-all duration-300 hover:shadow-md`}>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary-500 dark:text-secondary-500">
                {ownedDocsCount}
              </div>
              <div className={`text-[8px] sm:text-[10px] ${styles.textSecondary} font-medium uppercase tracking-wider`}>
                Owned
              </div>
            </div>
            <div className={`${styles.bgCard} border ${styles.borderColor} rounded-lg sm:rounded-xl p-3 sm:p-4 text-center shadow-sm transition-all duration-300 hover:shadow-md`}>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-500">
                {sharedDocsCount}
              </div>
              <div className={`text-[8px] sm:text-[10px] ${styles.textSecondary} font-medium uppercase tracking-wider`}>
                Shared
              </div>
            </div>
            <div className={`${styles.bgCard} border ${styles.borderColor} rounded-lg sm:rounded-xl p-3 sm:p-4 text-center shadow-sm transition-all duration-300 hover:shadow-md`}>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-amber-500">
                {starredDocsCount}
              </div>
              <div className={`text-[8px] sm:text-[10px] ${styles.textSecondary} font-medium uppercase tracking-wider`}>
                Starred
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}