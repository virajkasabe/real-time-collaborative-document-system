import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useDocStore } from '../stores/docStore';
import { Events } from './typedEvents';
import type { Socket } from 'socket.io-client';

export function useSocketTyped(docId: string | undefined) {
  const { socket } = useSocket();
  const upsertCollaborator = useDocStore((s) => s.upsertCollaborator);
  const removeCollaborator = useDocStore((s) => s.removeCollaborator);
  const setCollaborators = useDocStore((s) => s.setCollaborators);
  const setActiveDoc = useDocStore((s) => s.setActiveDoc);

  useEffect(() => {
    if (!socket || !docId) return;

    setActiveDoc(docId);

    const handleActiveUsers = (payload: any) => {
      const users = payload?.users ?? payload?.data ?? [];
      if (Array.isArray(users)) setCollaborators(users);
    };

    const handleJoin = (payload: any) => {
      const u = payload?.user ?? payload;
      if (u) upsertCollaborator(u);
    };

    const handleLeft = (payload: any) => {
      const userId = payload?.userId ?? payload?.user?._id ?? payload?.user?.id;
      if (userId) removeCollaborator(String(userId));
    };

    socket.on(Events.Document.ACTIVE_USERS, handleActiveUsers);
    socket.on(Events.Document.NEW_USER_JOIN, handleJoin);
    socket.on(Events.Document.USER_LEFT, handleLeft);

    return () => {
      socket.off(Events.Document.ACTIVE_USERS, handleActiveUsers);
      socket.off(Events.Document.NEW_USER_JOIN, handleJoin);
      socket.off(Events.Document.USER_LEFT, handleLeft);
    };
  }, [socket, docId, setActiveDoc, setCollaborators, upsertCollaborator, removeCollaborator]);

  return { socket: socket as Socket | null };
}

