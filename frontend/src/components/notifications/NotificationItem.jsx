import React from 'react';
import { FiBell, FiMail, FiUserCheck, FiUserX, FiCheck, FiX, FiUserPlus } from 'react-icons/fi';

export default function NotificationItem({ notification, onRead }) {
  // Avatar component with fallback to first letter
  const UserAvatar = ({ name, size = 'md', status }) => {
    const getInitials = (name) => {
      if (!name) return '?';
      const names = name.trim().split(' ');
      if (names.length === 1) return names[0].charAt(0).toUpperCase();
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'w-8 h-8 text-xs';
        case 'lg':
          return 'w-14 h-14 text-lg';
        default:
          return 'w-9 h-9 sm:w-11 sm:h-11 text-sm';
      }
    };

    const getAvatarColors = (name) => {
      if (!name) return 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
      
      const colors = [
        'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
        'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
        'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
        'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
        'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      ];
      
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    };

    // Status badge for accepted/declined/pending
    const StatusBadge = () => {
      if (!status) return null;
      
      if (status === 'accepted') {
        return (
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white dark:border-slate-800">
            <FiCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
          </div>
        );
      }
      
      if (status === 'declined') {
        return (
          <div className="absolute -bottom-1 -right-1 bg-rose-500 rounded-full p-0.5 border-2 border-white dark:border-slate-800">
            <FiX className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
          </div>
        );
      }
      
      if (status === 'pending') {
        return (
          <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 border-2 border-white dark:border-slate-800">
            <FiUserPlus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
          </div>
        );
      }
      
      return null;
    };

    return (
      <div className="relative flex-shrink-0">
        <div className={`rounded-full flex items-center justify-center font-bold ${getSizeClasses()} ${getAvatarColors(name)}`}>
          {getInitials(name)}
        </div>
        <StatusBadge />
      </div>
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case 'COLLAB_INVITED':
        return <FiMail className="text-[#2563EB] text-base sm:text-lg" />;
      case 'COLLAB_ACCEPTED':
        return <FiUserCheck className="text-emerald-500 text-base sm:text-lg" />;
      case 'COLLAB_DECLINED':
        return <FiUserX className="text-rose-500 text-base sm:text-lg" />;
      default:
        return <FiBell className="text-slate-400 text-base sm:text-lg" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'COLLAB_INVITED':
        return 'bg-blue-100 dark:bg-blue-500/20 border border-blue-200/50 dark:border-blue-400/20';
      case 'COLLAB_ACCEPTED':
        return 'bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200/50 dark:border-emerald-400/20';
      case 'COLLAB_DECLINED':
        return 'bg-rose-100 dark:bg-rose-500/20 border border-rose-200/50 dark:border-rose-400/20';
      default:
        return 'bg-slate-100 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/30';
    }
  };

  const getStatusBadge = (type) => {
    switch (type) {
      case 'COLLAB_ACCEPTED':
        return {
          label: 'Accepted',
          icon: <FiCheck className="w-3 h-3" />,
          className: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400/20'
        };
      case 'COLLAB_DECLINED':
        return {
          label: 'Declined',
          icon: <FiX className="w-3 h-3" />,
          className: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-400/20'
        };
      case 'COLLAB_INVITED':
        return {
          label: 'Pending',
          icon: <FiUserPlus className="w-3 h-3" />,
          className: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-400/20'
        };
      default:
        return null;
    }
  };

  const getUserName = (notification) => {
    if (notification.type === 'COLLAB_INVITED') {
      return notification.senderName;
    } else if (notification.type === 'COLLAB_ACCEPTED') {
      return notification.accepterName;
    } else if (notification.type === 'COLLAB_DECLINED') {
      return notification.declineUserName;
    }
    return 'User';
  };

  const getStatusForAvatar = (type) => {
    switch (type) {
      case 'COLLAB_ACCEPTED':
        return 'accepted';
      case 'COLLAB_DECLINED':
        return 'declined';
      case 'COLLAB_INVITED':
        return 'pending';
      default:
        return null;
    }
  };

  const getMessage = (n) => {
    switch (n.type) {
      case 'COLLAB_INVITED':
        return (
          <span>
            <span className="font-semibold text-[#2563EB] dark:text-blue-400">
              {n.senderName}
            </span>
            {' invited you to collaborate on '}
            <span className="font-medium text-[#0F172A] dark:text-gray-200">
              "{n.documentTitle}"
            </span>
          </span>
        );
      case 'COLLAB_ACCEPTED':
        return (
          <span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {n.accepterName || 'Someone'}
            </span>
            {' accepted your invite for '}
            <span className="font-medium text-[#0F172A] dark:text-gray-200">
              "{n.docname || n.documentName}"
            </span>
          </span>
        );
      case 'COLLAB_DECLINED':
        return (
          <span>
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              {n.declineUserName || 'A collaborator'}
            </span>
            {' has declined your invitation to collaborate on '}
            <span className="font-medium text-[#0F172A] dark:text-gray-200">
              "{n.docname || n.documentName}"
            </span>
            {n.reason && (
              <span className="text-slate-500 dark:text-slate-400 text-xs block mt-1 italic">
                Reason: {n.reason}
              </span>
            )}
            <span className="text-slate-500 dark:text-slate-400 text-xs block mt-1">
              {n.declinedAt ? `Declined on ${formatExpiry(n.declinedAt)}` : 'Invitation was declined'}
            </span>
          </span>
        );
      default:
        return 'New notification';
    }
  };

  // Format expiry date - handle both string and Date object
  const formatExpiry = (expiry) => {
    if (!expiry) return new Date().toLocaleString();
    
    try {
      const date = new Date(expiry);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return expiry; // Return as-is if it's already formatted
      }
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return expiry;
    }
  };

  const statusBadge = getStatusBadge(notification.type);
  const avatarStatus = getStatusForAvatar(notification.type);
  const isCollaborationType = ['COLLAB_INVITED', 'COLLAB_ACCEPTED', 'COLLAB_DECLINED'].includes(notification.type);

  return (
    <div
      onClick={() => onRead(notification.notificationId || notification.id)}
      className={`group relative flex items-start gap-3 sm:gap-4 p-3 sm:p-4 cursor-pointer transition-all duration-200 border-b border-slate-100 dark:border-slate-700/30 hover:bg-gradient-to-r hover:from-slate-50/80 hover:to-transparent dark:hover:from-slate-700/20 dark:hover:to-transparent ${
        !notification.read 
          ? 'bg-gradient-to-r from-blue-50/80 via-blue-50/40 to-transparent dark:from-blue-500/10 dark:via-blue-500/5 dark:to-transparent' 
          : 'hover:bg-slate-50/50 dark:hover:bg-slate-700/10'
      }`}
    >
      {/* Avatar or Icon with enhanced styling */}
      {isCollaborationType ? (
        <UserAvatar 
          name={getUserName(notification)} 
          size="md"
          status={avatarStatus}
        />
      ) : (
        <div className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${getBg(notification.type)}`}>
          {getIcon(notification.type)}
          {!notification.read && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#2563EB] rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse" />
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs sm:text-sm text-[#0F172A] dark:text-gray-200 leading-relaxed break-words">
            {getMessage(notification)}
          </p>
          {/* Status Badge - shown for collaboration types */}
          {statusBadge && isCollaborationType && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge.className}`}>
              {statusBadge.icon}
              {statusBadge.label}
            </span>
          )}
        </div>
        
        {/* Enhanced timestamp with icon */}
        <div className="flex items-center gap-1.5 mt-1">
          <svg className="w-3 h-3 text-[#94A3B8] dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] sm:text-xs text-[#94A3B8] dark:text-gray-500 font-medium truncate">
            {formatExpiry(notification.expiry) || formatExpiry(notification.createdAt) || new Date().toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action indicator - hidden on mobile, visible on hover */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
        <svg className="w-5 h-5 text-[#94A3B8] dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Touch-friendly arrow on mobile */}
      <div className="flex-shrink-0 sm:hidden text-[#94A3B8] dark:text-gray-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Unread dot - moved to right side */}
      {!notification.read && (
        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#2563EB] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      )}
    </div>
  );
}