import { useSocket } from '../context/SocketContext.jsx';
import { useEffect, useRef } from 'react';

export const useSocketHooks = (eventHandlers) => {
  const { socket } = useSocket();
  const handlersRef = useRef(eventHandlers);
  const listenersRef = useRef({});

  // Keep handlers ref updated
  useEffect(() => {
    handlersRef.current = eventHandlers;
  });

  useEffect(() => {
    if (!socket) return;

    // Remove old listeners first
    Object.entries(listenersRef.current).forEach(([event, wrapper]) => {
      socket.off(event, wrapper);
    });
    listenersRef.current = {};

    // Register new listeners with wrapper
    Object.keys(handlersRef.current).forEach((event) => {
      const wrapper = (...args) => {
        handlersRef.current[event]?.(...args);
      };
      listenersRef.current[event] = wrapper;
      socket.on(event, wrapper);
    });

    // Cleanup on unmount
    return () => {
      Object.entries(listenersRef.current).forEach(
        ([event, wrapper]) => {
          socket.off(event, wrapper);
        }
      );
    };
  }, [socket]);
};
