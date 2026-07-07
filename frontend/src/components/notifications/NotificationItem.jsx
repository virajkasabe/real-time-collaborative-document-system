import React from 'react';
import { FiBell, FiMail, FiUserCheck, FiUserX } from 'react-icons/fi';

export default function NotificationItem({ notification, onRead }) {
  const getIcon = (type) => {
    switch (type) {
      case 'COLLAB_INVITED':
<<<<<<< HEAD
        return <FiMail className="text-[#2563EB] text-base" />;
      case 'COLLAB_ACCEPTED':
        return <FiUserCheck className="text-green-500 text-base" />;
      case 'COLLAB_DECLINED':
        return <FiUserX className="text-red-500 text-base" />;
      default:
        return <FiBell className="text-gray-400 text-base" />;
    };
=======
        return <FiMail className="text-[#2563EB] text-base sm:text-lg" />;
      case 'COLLAB_ACCEPTED':
        return <FiUserCheck className="text-emerald-500 text-base sm:text-lg" />;
      case 'COLLAB_DECLINED':
        return <FiUserX className="text-rose-500 text-base sm:text-lg" />;
      default:
        return <FiBell className="text-slate-400 text-base sm:text-lg" />;
    }
>>>>>>> wind-breathing
  };

  const getBg = (type) => {
    switch (type) {
      case 'COLLAB_INVITED':
<<<<<<< HEAD
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'COLLAB_ACCEPTED':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'COLLAB_DECLINED':
        return 'bg-red-100 dark:bg-red-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-700';
=======
        return 'bg-blue-100 dark:bg-blue-500/20 border border-blue-200/50 dark:border-blue-400/20';
      case 'COLLAB_ACCEPTED':
        return 'bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200/50 dark:border-emerald-400/20';
      case 'COLLAB_DECLINED':
        return 'bg-rose-100 dark:bg-rose-500/20 border border-rose-200/50 dark:border-rose-400/20';
      default:
        return 'bg-slate-100 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/30';
>>>>>>> wind-breathing
    }
  };

  const getMessage = (n) => {
    switch (n.type) {
      case 'COLLAB_INVITED':
<<<<<<< HEAD
        return `${n.inviterName} invited you to collaborate on "${n.docname}"`;
      case 'COLLAB_ACCEPTED':
        return `${n.accepterName} accepted your invite for "${n.docname}"`;
      case 'COLLAB_DECLINED':
        return `Invite for "${n.docname}" was declined`;
=======
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
              "{n.docname || n.documentTitle}"
            </span>
          </span>
        );
      case 'COLLAB_DECLINED':
        return (
          <span>
            {'Invite for '}
            <span className="font-medium text-[#0F172A] dark:text-gray-200">
              "{n.docname || n.documentTitle}"
            </span>
            {' was declined'}
          </span>
        );
>>>>>>> wind-breathing
      default:
        return 'New notification';
    }
  };

<<<<<<< HEAD
  return (
    <div
      onClick={() => onRead(notification.id)}
      className={`flex items-start gap-3 p-4 cursor-pointer transition-colors duration-150 border-b border-gray-50 dark:border-gray-700/30 hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
        !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
      }`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getBg(notification.type)}`}>
        {getIcon(notification.type)}
=======
  // Format expiry date - handle both string and Date object
  const formatExpiry = (expiry) => {
    if (!expiry) return 'No expiry date';
    
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

  return (
    <div
      onClick={() => onRead(notification.notificationId || notification.id)}
      className={`group relative flex items-start gap-3 sm:gap-4 p-3 sm:p-4 cursor-pointer transition-all duration-200 border-b border-slate-100 dark:border-slate-700/30 hover:bg-gradient-to-r hover:from-slate-50/80 hover:to-transparent dark:hover:from-slate-700/20 dark:hover:to-transparent ${
        !notification.read 
          ? 'bg-gradient-to-r from-blue-50/80 via-blue-50/40 to-transparent dark:from-blue-500/10 dark:via-blue-500/5 dark:to-transparent' 
          : 'hover:bg-slate-50/50 dark:hover:bg-slate-700/10'
      }`}
    >
      {/* Icon with enhanced styling */}
      <div className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${getBg(notification.type)}`}>
        {getIcon(notification.type)}
        {!notification.read && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#2563EB] rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse" />
        )}
>>>>>>> wind-breathing
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
<<<<<<< HEAD
        <p className="text-sm text-[#0F172A] dark:text-gray-200 leading-snug break-words">
          {getMessage(notification)}
        </p>
        <p className="text-xs text-[#94A3B8] dark:text-gray-500 mt-1">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.read && (
        <div className="w-2 h-2 bg-[#2563EB] rounded-full flex-shrink-0 mt-1.5" />
      )}
    </div>
  );
}
=======
        <p className="text-xs sm:text-sm text-[#0F172A] dark:text-gray-200 leading-relaxed break-words">
          {getMessage(notification)}
        </p>
        
        {/* Enhanced timestamp with icon */}
        <div className="flex items-center gap-1.5 mt-1">
          <svg className="w-3 h-3 text-[#94A3B8] dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] sm:text-xs text-[#94A3B8] dark:text-gray-500 font-medium truncate">
            {formatExpiry(notification.expiry)}
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
>>>>>>> wind-breathing
