import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
<<<<<<< HEAD
import { NOTIFICATION_EVENT } from '../utils/constants';
=======
import { COLLABORATION_ERROR_EVENT, INVITATION_EVENT, NOTIFICATION_EVENT } from '../utils/constants';
>>>>>>> wind-breathing

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const { socket } = useSocket();
  const { user } = useAuth();

  const dismissToast = useCallback((id) => {
<<<<<<< HEAD
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
=======
    setToasts(prev => prev.filter(t => t.id!== id));
  }, []);

  const showToast = useCallback((data) => {
    // data array ho ya single object, dono handle karo
    const dataArray = Array.isArray(data)? data : [data];
    if (!dataArray.length) return;

    const newToasts = dataArray.map((notify) => ({
     ...notify,
      id: notify.notificationId || Date.now() + Math.random(), // fallback id
      message: notify.message || notify.title || 'New notification' // fallback
    }));

    setToasts((prev) => [...prev,...newToasts]);

    newToasts.forEach((toast) => {
      setTimeout(() => {
        dismissToast(toast.id);
      }, 3000); // 2 sec thoda kam hai, 3 sec rakho
    });
  }, [dismissToast]);

  const addNotification = useCallback((notification) => {
    if (!notification) return;

    const notificationsArray = Array.isArray(notification)? notification : [notification];
    const validNotifications = notificationsArray.filter(n => n && Object.keys(n).length > 0);
    if (validNotifications.length === 0) return;

    const newNotifications = validNotifications.map(n => ({
     ...n,
      id: n.notificationId,
      read: n.read || false
    }));  

    setNotifications(prev => [...newNotifications,...prev]);
    setUnreadCount(prev => prev + newNotifications.length);
  }, []);

  // Listen for real-time notifications
>>>>>>> wind-breathing
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
<<<<<<< HEAD
=======
      console.log("handleNotification", data)
>>>>>>> wind-breathing
      addNotification(data);
      showToast(data);
    };

<<<<<<< HEAD
    socket.on(NOTIFICATION_EVENT.RECIVED_REAL_TIME_NOTIFICATION, handleNotification);
    socket.on(NOTIFICATION_EVENT.NOTIFICATION_RECIVED , handleNotification);


    return () => {
      socket.off(NOTIFICATION_EVENT.RECIVED_REAL_TIME_NOTIFICATION, handleNotification);
      socket.off(NOTIFICATION_EVENT.NOTIFICATION_RECIVED, handleNotification);
=======
    const handleError = (data) => {
      console.error("Socket Error:", data)
      // Error ko bhi notification me daal de
      const errorNotif = {
        notificationId: `err-${Date.now()}`,
        message: data.message || 'Something went wrong',
        type: 'error',
        read: false
      }
      addNotification(errorNotif);
      showToast(errorNotif); // ab array bhej rahe
      // yaha socket.off mat lagana
    }

    // Sab listeners ek sath
    socket.on(NOTIFICATION_EVENT.RECIVED_REAL_TIME_NOTIFICATION, handleNotification);
    socket.on(NOTIFICATION_EVENT.NOTIFICATION_RECIVED, handleNotification);
    socket.on(INVITATION_EVENT.ACCEPT_INVITATION, handleNotification);
    socket.on(INVITATION_EVENT.DECLINE_INVITATION, handleNotification);
    socket.on(COLLABORATION_ERROR_EVENT.ERROR_DECLINE_COLLABORATION, handleError); // error handler

    return () => {
      // Cleanup: same function reference pass karna zaroori
      socket.off(NOTIFICATION_EVENT.RECIVED_REAL_TIME_NOTIFICATION, handleNotification);
      socket.off(NOTIFICATION_EVENT.NOTIFICATION_RECIVED, handleNotification);
      socket.off(INVITATION_EVENT.ACCEPT_INVITATION, handleNotification);
      socket.off(INVITATION_EVENT.DECLINE_INVITATION, handleNotification);
      socket.off(COLLABORATION_ERROR_EVENT.ERROR_DECLINE_COLLABORATION, handleError);
>>>>>>> wind-breathing
    }
  }, [socket, addNotification, showToast]);

  const markAsRead = (id) => {
    setNotifications(prev => {
<<<<<<< HEAD
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      const unread = updated.filter(n => !n.read).length;
=======
      const updated = prev.map(n => n.id === id? {...n } : n);
      const unread = updated.filter(n =>!n.read).length;
>>>>>>> wind-breathing
      setUnreadCount(unread);
      return updated;
    });
  };
<<<<<<< HEAD

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
=======
  
  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))                              
    console.log("clearNotification", id)
  }


  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true })))
>>>>>>> wind-breathing
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
<<<<<<< HEAD
=======
      clearNotification,
>>>>>>> wind-breathing
      clearAll,
      showToast,
      dismissToast
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

<<<<<<< HEAD
export const useNotifications = () => useContext(NotificationContext);
=======
export const useNotifications = () => useContext(NotificationContext);
>>>>>>> wind-breathing
