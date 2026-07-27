import React, { useState } from 'react';
import { FiBell, FiMail, FiUserCheck, FiUserX, FiCheck, FiX, FiTrash2, FiUserPlus, FiUserMinus } from 'react-icons/fi';
import { useNotifications } from '../context/NotificationContext';
import { useSocket } from '../context/SocketContext';
import { INVITATION_EVENT } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, clearNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');
  const { socket } = useSocket()
  const { triggerToast } = useAuth()
  
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'invites', label: 'Invites' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'declined', label: 'Declined' }
  ];

  const acceptCollab = (acceptNotif) => {
    markAsRead(acceptNotif.id)
    socket.emit(INVITATION_EVENT.ACCEPT_INVITATION, acceptNotif)
    triggerToast("User joined successfully", 'success')
    clearNotification(acceptNotif.notificationId)
  }

  const declinedCollab = (declineNotif) => {
    markAsRead(declineNotif.id)
    socket.emit(INVITATION_EVENT.DECLINE_INVITATION, declineNotif)
    triggerToast("User declined the collaboration", 'fail')
    clearNotification(declineNotif.notificationId)
  }

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'invites':
        return notifications.filter(n => n.type === 'COLLAB_INVITED');
      case 'accepted':
        return notifications.filter(n => n.type === 'COLLAB_ACCEPTED');
      case 'declined':
        return notifications.filter(n => n.type === 'COLLAB_DECLINED');
      default:
        return notifications;
    }
  };

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case 'unread':
        return {
          title: "You're all caught up! 🎉",
          desc: "No unread notifications left."
        };
      case 'invites':
        return {
          title: "No pending invites",
          desc: "You haven't received any document collaboration invites."
        };
      case 'accepted':
        return {
          title: "No accepted invites yet",
          desc: "None of your invites have been accepted yet."
        };
      case 'declined':
        return {
          title: "No declined invites",
          desc: "You have no declined invitations."
        };
      default:
        return {
          title: "No notifications yet",
          desc: "We will notify you when something happens!"
        };
    }
  };

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
          return 'w-10 h-10 text-sm';
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

    // Status badge for accepted/declined
    const StatusBadge = () => {
      if (!status) return null;
      
      if (status === 'accepted') {
        return (
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white dark:border-[#0F172A]">
            <FiCheck className="w-3 h-3 text-white" />
          </div>
        );
      }
      
      if (status === 'declined') {
        return (
          <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-0.5 border-2 border-white dark:border-[#0F172A]">
            <FiX className="w-3 h-3 text-white" />
          </div>
        );
      }
      
      if (status === 'pending') {
        return (
          <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-0.5 border-2 border-white dark:border-[#0F172A]">
            <FiUserPlus className="w-3 h-3 text-white" />
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

  const getStatusBadge = (type) => {
    switch (type) {
      case 'COLLAB_ACCEPTED':
        return {
          label: 'Accepted',
          icon: <FiCheck className="w-3 h-3" />,
          className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
        };
      case 'COLLAB_DECLINED':
        return {
          label: 'Declined',
          icon: <FiX className="w-3 h-3" />,
          className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
        };
      case 'COLLAB_INVITED':
        return {
          label: 'Pending',
          icon: <FiUserPlus className="w-3 h-3" />,
          className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
        };
      default:
        return null;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'COLLAB_INVITED':
        return <FiMail className="text-[#2563EB] dark:text-blue-400 text-lg sm:text-xl" />;
      case 'COLLAB_ACCEPTED':
        return <FiUserCheck className="text-green-500 text-lg sm:text-xl" />;
      case 'COLLAB_DECLINED':
        return <FiUserX className="text-red-500 text-lg sm:text-xl" />;
      default:
        return <FiBell className="text-gray-400 text-lg sm:text-xl" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'COLLAB_INVITED':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'COLLAB_ACCEPTED':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'COLLAB_DECLINED':
        return 'bg-red-100 dark:bg-red-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  const getMessage = (n) => {
    switch (n.type) {
      case 'COLLAB_INVITED':
        return `${n.senderName} invited you to collaborate on "${n.documentTitle}"`;
      
      case 'COLLAB_ACCEPTED':
        return `${n.accepterName} accepted your invitation to collaborate on "${n.documentName}"`;
      
      case 'COLLAB_DECLINED':
        const declineReason = n.reason 
          ? ` (Reason: ${n.reason})` 
          : '';
        const decliner = n.declineUserName || 'A collaborator';
        const documentName = n.docname || n.documentName || 'your document';
        
        return `${decliner} declined your collaboration invitation for "${documentName}"${declineReason}`;
      
      default:
        return 'New notification';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return new Date().toLocaleString();
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return timestamp;
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  const getUserName = (notif) => {
    if (notif.type === 'COLLAB_INVITED') {
      return notif.senderName;
    } else if (notif.type === 'COLLAB_ACCEPTED') {
      return notif.accepterName;
    } else if (notif.type === 'COLLAB_DECLINED') {
      return notif.declineUserName;
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

  const filtered = getFilteredNotifications();
  const empty = getEmptyStateMessage();

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-4xl w-full mx-auto select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#E5E7EB] dark:border-white/10 pb-4 sm:pb-5 transition-all duration-300">
        <div className="text-left">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-sans font-extrabold text-lg sm:text-xl md:text-2xl text-[#081B3A] dark:text-white tracking-tight">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] sm:text-[11px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-medium mt-1">
            Stay updated with your collaborative project activities
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3 sm:px-3.5 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-white/10 text-[10px] sm:text-xs font-bold text-[#081B3A] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 sm:px-3.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900/30 text-[10px] sm:text-xs font-bold text-red-650 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <FiTrash2 size={13} />
              <span className="hidden xs:inline">Clear all</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-white/5 pb-0.5 gap-1 sm:gap-2 scrollbar-none overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2.5 sm:px-4 py-2 border-b-2 text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
              activeTab === tab.id
                ? 'border-[#2563EB] text-[#2563EB] dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List Container */}
      <div className="space-y-2 sm:space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/5 rounded-[20px] p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-sm transition-all duration-300">
            <FiBell className="text-gray-300 dark:text-gray-600 text-4xl sm:text-5xl mb-4" />
            <h3 className="text-sm sm:text-base font-bold text-[#081B3A] dark:text-white">
              {empty.title}
            </h3>
            <p className="text-xs text-gray-450 dark:text-gray-500 mt-1 max-w-xs px-4">
              {empty.desc}
            </p>
          </div>
        ) : (
          filtered.map(notif => {
            const statusBadge = getStatusBadge(notif.type);
            const avatarStatus = getStatusForAvatar(notif.type);
            
            return (
              <div
                key={notif.id}
                onClick={() => !notif.read && markAsRead(notif.id)}
                className={`bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-white/5 rounded-[16px] sm:rounded-[20px] p-3 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all duration-300 hover:shadow-md ${
                  !notif.read ? 'border-l-4 border-l-[#2563EB]' : ''
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4 text-left w-full">
                  {/* Avatar with status indicator */}
                  {['COLLAB_INVITED', 'COLLAB_ACCEPTED', 'COLLAB_DECLINED'].includes(notif.type) ? (
                    <UserAvatar 
                      name={getUserName(notif)} 
                      size="md"
                      status={avatarStatus}
                    />
                  ) : (
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getBg(notif.type)}`}>
                      {getIcon(notif.type)}
                    </div>
                  )}

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white leading-snug break-words">
                        {getMessage(notif)}
                      </p>
                      {/* Status Badge */}
                      {statusBadge && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge.className}`}>
                          {statusBadge.icon}
                          {statusBadge.label}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                      {formatTimestamp(notif.createdAt)}
                    </p>
                    {notif.type === 'COLLAB_DECLINED' && notif.reason && (
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 italic mt-0.5">
                        Reason: {notif.reason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 ml-auto sm:ml-0 w-full sm:w-auto justify-end">
                  {notif.type === 'COLLAB_INVITED' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          acceptCollab(notif);
                        }}
                        className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-[10px] sm:text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm flex-1 sm:flex-none justify-center"
                      >
                        <FiCheck size={13} />
                        <span className="hidden xs:inline">Accept</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          declinedCollab(notif);
                        }}
                        className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-250 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex-1 sm:flex-none justify-center"
                      >
                        <FiX size={13} />
                        <span className="hidden xs:inline">Decline</span>
                      </button>
                    </>
                  )}
                  {!notif.read && notif.type !== 'COLLAB_INVITED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notif.id);
                      }}
                      className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-250 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs font-bold cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex-1 sm:flex-none justify-center"
                    >
                      <span className="hidden xs:inline">Mark read</span>
                      <span className="xs:hidden">Read</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}