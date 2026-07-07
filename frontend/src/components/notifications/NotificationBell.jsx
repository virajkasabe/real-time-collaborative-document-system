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
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
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