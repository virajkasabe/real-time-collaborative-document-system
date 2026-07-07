<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiTrash2, FiCheck, FiX, FiMail, FiUserCheck, FiUserX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useSocketHooks } from '../../hooks/useSocketHooks';
import { NOTIFICATION_EVENT } from '../../constants/events';

export default function NotificationBell() {
  const { user, acceptInvitation, declineInvitation, triggerToast } = useAuth();
  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('collabdocs_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('collabdocs_notification_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('collabdocs_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('collabdocs_notification_count', count.toString());
  }, [count]);

  // Real-time socket events integration
  useSocketHooks({
    [NOTIFICATION_EVENT.NOTIFICATION_RECEIVED]: (data) => {
      // Deduplicate by tokenId if it's an invite
      if (data.tokenId && notifications.some(n => n.tokenId === data.tokenId)) {
        return;
      }
      const newNotif = {
        ...data,
        id: data.id || Date.now() + Math.random(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      setCount((prev) => prev + 1);
    }
  });


  if (!user) return null;

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => {
        if (n.id === id && !n.read) {
          setCount(c => Math.max(0, c - 1));
          return { ...n, read: true };
        }
        return n;
      })
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setCount(0);
  };

  const handleClearAll = () => {
    setNotifications([]);
    setCount(0);
  };

  const handleAccept = async (e, notif) => {
    e.stopPropagation();
    try {
      await acceptInvitation(notif.accepterEmail, notif.tokenId);
      triggerToast('Collaboration invitation accepted successfully!', 'success');
      setNotifications(prev =>
        prev.map(n => n.id === notif.id ? { ...n, read: true, status: 'accepted' } : n)
      );
      if (!notif.read) {
        setCount(c => Math.max(0, c - 1));
      }
    } catch (err) {
      triggerToast(err.message || 'Failed to accept invitation', 'error');
    }
  };

  const handleDecline = async (e, notif) => {
    e.stopPropagation();
    try {
      await declineInvitation(notif.accepterEmail, notif.tokenId);
      triggerToast('Collaboration invitation declined successfully!', 'success');
      setNotifications(prev =>
        prev.map(n => n.id === notif.id ? { ...n, read: true, status: 'rejected' } : n)
      );
      if (!notif.read) {
        setCount(c => Math.max(0, c - 1));
      }
    } catch (err) {
      triggerToast(err.message || 'Failed to decline invitation', 'error');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'COLLAB_INVITE':
        return <FiMail className="text-[#2563EB] text-base" />;
      case 'INVITE_ACCEPTED':
        return <FiUserCheck className="text-green-500 text-base" />;
      case 'INVITE_REJECTED':
        return <FiUserX className="text-red-500 text-base" />;
      default:
        return <FiBell className="text-gray-400 text-base" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'COLLAB_INVITE':
        return 'bg-blue-105 dark:bg-blue-900/30';
      case 'INVITE_ACCEPTED':
        return 'bg-green-105 dark:bg-green-900/30';
      case 'INVITE_REJECTED':
        return 'bg-red-105 dark:bg-red-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}


      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
      >
        <FiBell className="text-[#0F172A] dark:text-white text-lg" />
        
        {/* Unread Badge */}
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold animate-pulse">
            {count > 9 ? '9+' : count}
=======
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';
import { useAuth } from '../../context/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
        aria-label="Notifications"
      >
        <FiBell className="text-[#0F172A] dark:text-white text-base sm:text-lg" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-[20px] bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold animate-pulse px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
>>>>>>> wind-breathing
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
<<<<<<< HEAD
        <div className="absolute right-0 top-12 w-[380px] bg-white dark:bg-[#1E2535] border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl z-[100] overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700/50">
            <div className="text-left">
              <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                Notifications
              </h3>
              {count > 0 && (
                <p className="text-xs text-[#64748B] dark:text-gray-400 mt-0.5">
                  {count} unread
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {count > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-[#2563EB] font-semibold hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-red-500 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <FiTrash2 size={12} />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center select-none">
                <FiBell className="text-gray-300 dark:text-gray-600 text-4xl mb-3 animate-bounce" style={{ animationDuration: '3s' }} />
                <p className="text-sm font-semibold text-[#64748B] dark:text-gray-400">
                  No notifications yet
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={`flex items-start gap-3 p-4 cursor-pointer transition-colors duration-150 border-b border-gray-50 dark:border-gray-700/30 hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                    !notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getBg(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm text-[#0F172A] dark:text-gray-200 leading-snug break-words">
                      {notif.title}
                    </p>
                    <p className="text-xs text-[#94A3B8] dark:text-gray-500 mt-1">
                      From: <span className="font-semibold text-gray-700 dark:text-gray-300">{notif.inviterName}</span>
                    </p>
                    <p className="text-[11px] text-gray-450 dark:text-gray-400 mt-0.5">
                      Doc: <span className="font-medium">{notif.documentTitle}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>

                    {/* Action Buttons for COLLAB_INVITE type */}
                    {notif.type === 'COLLAB_INVITE' && (
                      <div className="mt-3 flex items-center gap-2">
                        {notif.status === 'accepted' ? (
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                            <FiCheck /> Accepted
                          </span>
                        ) : notif.status === 'rejected' ? (
                          <span className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                            <FiX /> Declined
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={(e) => handleAccept(e, notif)}
                              className="px-2.5 py-1 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                            >
                              <FiCheck size={12} />
                              Accept
                            </button>
                            <button
                              onClick={(e) => handleDecline(e, notif)}
                              className="px-2.5 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-[11px] font-bold flex items-center gap-1 hover:bg-gray-150 dark:hover:bg-gray-700 transition-colors"
                            >
                              <FiX size={12} />
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Unread dot */}
                  {!notif.read && (
                    <div className="w-2 h-2 bg-[#2563EB] rounded-full flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer - View All */}
          {notifications.length > 0 && (
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-sm text-[#2563EB] font-semibold p-3 hover:underline border-t border-gray-100 dark:border-gray-700"
            >
              View all notifications →
            </Link>
          )}
        </div>
      )}

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
=======
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 md:hidden bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          
          <div className="absolute right-0 top-12 w-[calc(100vw-24px)] sm:w-[380px] max-w-[380px] bg-white dark:bg-[#1E2535] border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-slideDown">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700/50 gap-2 sm:gap-0">
              <div className="text-left">
                <h3 className="font-bold text-sm sm:text-base text-[#0F172A] dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-[#64748B] dark:text-gray-400 mt-0.5">
                    {unreadCount} unread
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      markAllAsRead();
                      // Optionally close dropdown after action
                    }}
                    className="text-xs text-[#2563EB] font-semibold hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={() => {
                      clearAll();
                      // Optionally close dropdown after action
                    }}
                    className="text-xs text-red-500 font-semibold hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[300px] sm:max-h-[360px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 text-center select-none">
                  <FiBell className="text-gray-300 dark:text-gray-600 text-3xl sm:text-4xl mb-3 animate-bounce" style={{ animationDuration: '3s' }} />
                  <p className="text-sm font-semibold text-[#64748B] dark:text-gray-400">
                    No notifications yet
                  </p>
                  <p className="text-xs text-gray-450 dark:text-gray-500 mt-1">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={markAsRead}
                  />
                ))
              )}
            </div>

            {/* Footer - View All */}
            {notifications.length > 0 && (
              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
                className="block text-center text-sm text-[#2563EB] font-semibold p-3 hover:underline border-t border-gray-100 dark:border-gray-700 transition-colors duration-200"
              >
                View all notifications →
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
>>>>>>> wind-breathing
