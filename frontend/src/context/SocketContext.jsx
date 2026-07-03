import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { CONNECT_DISCONNET_EVENT } from "../utils/constants";

const SocketContext = createContext();

let socketInstance = null;

export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [socketReady, setSocketReady] = useState(false);

  const connectSocket = useCallback(() => {
    // Prevent duplicate connections
    if (socketInstance) {
      if (socketInstance.connected || socketInstance.active) {
        return socketInstance;
      }
    }

    console.log("🔌 Connecting socket...");

    socketInstance = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        withCredentials: true, // Browser sends HttpOnly cookies automatically
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: 5,
      }
    );

    socketInstance.on(CONNECT_DISCONNET_EVENT.CONNECT, () => {
      console.log("✅ Socket Connected:", socketInstance.id);
      setIsConnected(true);
      setSocketReady(true);
    });

    socketInstance.on(CONNECT_DISCONNET_EVENT.DISCONNECT, (reason) => {
      console.log("❌ Socket Disconnected:", reason);
      setIsConnected(false);
      setSocketReady(false);
    });

    socketInstance.on(CONNECT_DISCONNET_EVENT.CONNECT_ERROR, (err) => {
      console.log("🚫 Socket Error:", err.message);

      setIsConnected(false);
      setSocketReady(false);

      if (err.message === "Authentication error") {
        window.location.href = "/login";
      }
    });

    return socketInstance;
  }, []);

  const disconnectSocket = useCallback(() => {
    if (!socketInstance) return;

    console.log("🔌 Disconnecting socket...");

    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;

    setIsConnected(false);
    setSocketReady(false);
  }, []);

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketInstance,
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