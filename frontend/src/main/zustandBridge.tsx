import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useSocketStore } from '../stores/socketStore';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

// Bridge existing Context-based auth/socket state into Zustand stores.
// This keeps the current app working while we migrate feature-by-feature.
export function ZustandBridge() {
  const { user, isAuthenticated, loading } = useAuth();
  const { socketReady, isConnected } = useSocket();

  const setAuth = useAuthStore((s) => s.setAuth);
  const setConnection = useSocketStore((s) => s.setConnection);

  useEffect(() => {
    setAuth({ user, isAuthenticated });
  }, [user, isAuthenticated, setAuth]);

  useEffect(() => {
    // Preserve existing loading semantics.
    // Zustand store has `loading`; Context already has it.
    useAuthStore.setState({ loading });
  }, [loading]);

  useEffect(() => {
    setConnection({ isConnected, socketReady });
  }, [isConnected, socketReady, setConnection]);

  return null;
}

