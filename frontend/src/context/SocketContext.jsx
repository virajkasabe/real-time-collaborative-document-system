import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client'
import { CONNECT_DISCONNET_EVENT } from '../utils/constants';
import { LocalStorage } from '../apis';
const SocketContext = createContext();
let socketInstance = null;

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketReady, setSocketReady] = useState(false);

  const connectSocket = useCallback(()=>{

    const token = LocalStorage.get("accessToken")
    if(!token) {
       console.log("🧑🏼‍🦯‍➡️ auth handsheck token not found")
       return null;
    }

    if(socketInstance?.socket) {
      console.log(`socket instance already connected: ${socketInstance.id}`)
      return socketInstance;
    }

    if(socketInstance?.active) {
      console.log(`Socket already connecting`)
      return socketInstance;
    }

    console.log(`New Socket Connecting`)

    socketInstance = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        auth : { token },
        transports : ['websocket'],
        withCredentials : true,
        autoConnect : true,
        reconnection : true,
        reconnectionDelay : 500,
        reconnectionAttempts : 5
      }
    )

    socketInstance.on(CONNECT_DISCONNET_EVENT.CONNECTION, ()=> {
      console.log(`Socket connected : ${socketInstance.auth}`)
      setIsConnected(true);
      setSocketReady(true);
    })


    socketInstance.on(CONNECT_DISCONNET_EVENT.CONNECTED, ()=> {
      console.log(`Socket connected : `,socketInstance.id)
      setIsConnected(true);
      setSocketReady(true);
    })


    socketInstance.on(CONNECT_DISCONNET_EVENT.DISCONNECT, (resonse)=> {
      console.log(`Socket ${CONNECT_DISCONNET_EVENT.DISCONNECT} : ${resonse}`)
      setIsConnected(false);
    })

    socketInstance.on(CONNECT_DISCONNET_EVENT.SOCKET_ERROR, (error)=>{
      console.log(`Socket Connect Error : ${error.message}`)
      setIsConnected(false);
      if(error.message === "Authentication error") {
        LocalStorage.remove("accessToken");
        window.location.href("/login")
      }
    });

    socketRef.current = socketInstance;
    return socketInstance;
  },[]);


  const disconnecteSocket = useCallback(()=>{
    console.log(`MANUAL DISCONNECTE`);
      if(socketInstance) {
        socketInstance.removeAllListeners();
        socketInstance.disconnect();
        socketInstance = null;
        socketInstance.current = null;
        setIsConnected(false);
        setSocketReady(false);
      }
  },[]);



  const initSocketWithToken = useCallback((token)=>{
    LocalStorage.set("accessToken", token);
    disconnecteSocket();
    setTimeout(()=> connectSocket(),80)
  },[connectSocket, disconnecteSocket])


  const updateSocketToken = useCallback((newToken)=> {
    if(!socketInstance) return;
    LocalStorage.set("accessToken", newToken);
    socketInstance.auth = {token : newToken};
    if(!socketInstance.connected) {
      socketInstance.connect();
    }
  },[])

  useEffect(()=>{
    const token = LocalStorage.get("accessToken");
    console.log(`Token Mount :${token} ? Missing : missing`)

    if(token && !socketInstance) {
      connectSocket()
    }

    return () => {
      console.log("SocketProvider unmounting - keeping socket alive");
    }

  },[connectSocket])

  return (
    <SocketContext.Provider value={{ 
      socket : socketInstance,
      isConnected,
      socketReady,
      connectSocket,
      disconnecteSocket,
      initSocketWithToken,
      updateSocketToken
     }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if(!context) {
      throw new Error("useSocket must be used inside SocketProvider");
  }
  return context;
}

