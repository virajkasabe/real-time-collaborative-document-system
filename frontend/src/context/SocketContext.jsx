import React, { createContext, useContext, useState, useEffect } from 'react';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const listeners = {};
    const mockSocket = {
      on: (event, cb) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(cb);
      },
      off: (event, cb) => {
        if (!listeners[event]) return;
        listeners[event] = listeners[event].filter(l => l !== cb);
      },
      emitMockNotification: (data) => {
        if (listeners['notification']) {
          listeners['notification'].forEach(cb => cb(data));
        }
      }
    };
    
    setSocket(mockSocket);

    // Periodic mock notification generator for demonstration
    const interval = setInterval(() => {
      const types = ['COLLAB_INVITED', 'COLLAB_ACCEPTED', 'COLLAB_DECLINED'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      let notification = {};
      if (randomType === 'COLLAB_INVITED') {
        notification = {
          type: 'COLLAB_INVITED',
          inviter: 'Marcus Aurelius',
          title: 'Meditations Blueprint',
          createdAt: new Date().toISOString()
        };
      } else if (randomType === 'COLLAB_ACCEPTED') {
        notification = {
          type: 'COLLAB_ACCEPTED',
          accepterName: 'Seneca the Younger',
          documentTitle: 'Letters from a Stoic',
          createdAt: new Date().toISOString()
        };
      } else {
        notification = {
          type: 'COLLAB_DECLINED',
          documentTitle: 'On the Shortness of Life',
          createdAt: new Date().toISOString()
        };
      }

      mockSocket.emitMockNotification(notification);
    }, 20000); // 20-second interval

    return () => clearInterval(interval);
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
