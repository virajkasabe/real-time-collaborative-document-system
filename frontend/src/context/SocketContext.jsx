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

const SocketContext = createContext();

export function SocketProvider({ children }) {
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

    const newSocket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        withCredentials: true,
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: 5,
      }
    );

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on(CONNECT_DISCONNET_EVENT.CONNECT, () => {
      console.log("✅ Socket Connected:", newSocket.id);
      setIsConnected(true);
      setSocketReady(true);
    });

    newSocket.on(CONNECT_DISCONNET_EVENT.DISCONNECT, (reason) => {
      console.log("❌ Socket Disconnected:", reason);
      setIsConnected(false);
      setSocketReady(false);
    });

    newSocket.on(CONNECT_DISCONNET_EVENT.CONNECT_ERROR, (err) => {
      console.log("🚫 Socket Error:", err.message);
      setIsConnected(false);
      setSocketReady(false);

      if (err.message === "Authentication error") {
        // Avoid redirect loops
        if (!window.location.pathname.includes('/login')) {
          window.location.href = "/login";
        }
      }
    });

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