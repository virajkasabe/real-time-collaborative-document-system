import { useSocket } from '../context/SocketContext.jsx';
import { useEffect, useRef } from 'react';

export const useSocketHooks = (eventHandlers) => {
  const { socket } = useSocket();
  const handlersRef = useRef(eventHandlers);
  const listenersRef = useRef({});


  useEffect(() => {
    handlersRef.current = eventHandlers;
  });

  useEffect(() => {
    if (!socket) return;

    Object.entries(listenersRef.current).forEach(([event, wrapper]) => {
      socket.off(event, wrapper);
    });
    listenersRef.current = {};

    Object.keys(handlersRef.current).forEach((event) => {
      const wrapper = (...args) => {
        handlersRef.current[event]?.(...args);
      };
      listenersRef.current[event] = wrapper;
      socket.on(event, wrapper);
    });

    return () => {
      Object.entries(listenersRef.current).forEach(
        ([event, wrapper]) => {
          socket.off(event, wrapper);
        }
      );
    };
  }, [socket]);
};
