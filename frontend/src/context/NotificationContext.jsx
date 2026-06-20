import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { NOTIFICATION_EVENT } from '../utils/constants';

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
    if(data.length !== 0) {
      const id = 'r'; // Date.now();
      setToasts(prev => [...prev, { ...data, id }]);
      setTimeout(() => {
        dismissToast(id);
      }, 2000);
    }
  }, [dismissToast]);

  const addNotification = useCallback((notification) => {

    if (!notification) return;
    
    // Convert to array if single notification
    const notificationsArray = Array.isArray(notification) 
      ? notification 
      : [notification];
    
    // Filter out empty notifications
    const validNotifications = notificationsArray.filter(n => 
      n && Object.keys(n).length > 0
    );
    
    if (validNotifications.length === 0) return;
    
    // Create new notifications with IDs
    const newNotifications = validNotifications.map(n => ({
      ...n,
      id: Date.now() + Math.random() + Math.random(),
      read: false
    }));
    
    // Update state
      setNotifications(prev => [...newNotifications, ...prev]);
      setUnreadCount(prev => prev + newNotifications.length);
  }, []);

  // Listen for real-time notifications via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      addNotification(data);
      showToast(data);
    };

    socket.on(NOTIFICATION_EVENT.RECIVED_REAL_TIME_NOTIFICATION, handleNotification);
    socket.on(NOTIFICATION_EVENT.NOTIFICATION_RECIVED , handleNotification);


    return () => {
      socket.off(NOTIFICATION_EVENT.RECIVED_REAL_TIME_NOTIFICATION, handleNotification);
      socket.off(NOTIFICATION_EVENT.NOTIFICATION_RECIVED, handleNotification);
    }
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
