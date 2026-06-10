import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const { socket } = useSocket();
  const { user } = useAuth();

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((data) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...data, id }]);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  }, [dismissToast]);

  const addNotification = useCallback((notification) => {
    const newNotif = {
      ...notification,
      id: Date.now() + Math.random(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  // Listen for real-time notifications via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      addNotification(data);
      showToast(data);
    };

    socket.on('notification', handleNotification);

    return () => socket.off('notification', handleNotification);
  }, [socket, addNotification, showToast]);

  const markAsRead = (id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      const unread = updated.filter(n => !n.read).length;
      setUnreadCount(unread);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      toasts,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      showToast,
      dismissToast
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
