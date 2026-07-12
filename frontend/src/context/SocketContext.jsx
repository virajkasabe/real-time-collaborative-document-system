import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { CONNECT_DISCONNET_EVENT } from "../utils/constants";
import { useSocketStore } from '../stores/socketStore';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { setConnection } = useSocketStore();
  const [isConnected, setIsConnected] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  const connectSocket = useCallback(() => {
    // Prevent duplicate connections
    if (socketRef.current) {
      if (socketRef.current.connected || socketRef.current.active) {
        return socketRef.current;
      }
    }

    console.log("🔌 Connecting socket...");

    let newSocket;
    try {
      newSocket = io(
        import.meta.env.VITE_SOCKET_URL || "/",
        {
          path: "/socket.io",
          withCredentials: true,
          transports: ["websocket", "polling"],
          autoConnect: true,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 3,
          timeout: 5000,
        }
      );

      newSocket.on(CONNECT_DISCONNET_EVENT.CONNECT, () => {
        console.log("✅ Socket Connected:", newSocket.id);
        setIsConnected(true);
        setSocketReady(true);
        setConnection({ isConnected: true, socketReady: true });
      });

      newSocket.on(CONNECT_DISCONNET_EVENT.DISCONNECT, (reason) => {
        console.log("❌ Socket Disconnected:", reason);
        console.warn('Socket disconnected:', reason);
        setIsConnected(false);
        setSocketReady(false);
        if (reason === 'io server disconnect') {
          newSocket.connect(); // reconnect if server dropped connection
        }
      });

      newSocket.on(CONNECT_DISCONNET_EVENT.CONNECT_ERROR, (err) => {
        console.log("🚫 Socket Error:", err.message);
        console.warn('Socket connection failed:', err.message);
        console.warn('Socket unavailable:', err.message);
        setIsConnected(false);
        setSocketReady(false);

        if (err.message === "Authentication error") {
          // Avoid redirect loops
          if (!window.location.pathname.includes('/login')) {
            window.location.href = "/login";
          }
        }
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

    } catch (err) {
      console.warn('Socket init failed:', err);
    }

    return newSocket;
  }, []);

  const disconnectSocket = useCallback(() => {
    if (!socketRef.current) return;

    console.log("🔌 Disconnecting socket...");

    socketRef.current.removeAllListeners();
    socketRef.current.disconnect();
    socketRef.current = null;
    setSocket(null);
    
    setIsConnected(false);
    setSocketReady(false);
    setConnection({ isConnected: false, socketReady: false });
  }, []);

  useEffect(() => {
    connectSocket();
    return disconnectSocket;
  }, [connectSocket, disconnectSocket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        socketReady,
        connectSocket,
        disconnectSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }
  return context;
};