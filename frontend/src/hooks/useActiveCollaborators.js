import { useEffect, useState } from "react";
import { DOCUMENT_EVENT } from "../utils/constants";


export function useActiveCollaborators(socket, currentUser, showToast) {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleJoin = (data) => {
      if (!data?.user?._id || data.user._id === currentUser?._id) return;
      setActiveUsers((prev) => {
        if (prev.some((u) => u._id === data.user._id)) return prev;
        return [...prev, data.user];
      });
    };

    const handleLeft = ({ userId }) => {
      if (!userId) return;
      setActiveUsers((prev) => {
        const leaving = prev.find((u) => u._id === userId);
        if (leaving) showToast(`${leaving.fullName || 'A collaborator'} left the document`, 'info');
        return prev.filter((u) => u._id !== userId);
      });
    };

    socket.on(DOCUMENT_EVENT.NEW_USER_JOIN, handleJoin);
    socket.on(DOCUMENT_EVENT.USER_LEFT, handleLeft);
    return () => {
      socket.off(DOCUMENT_EVENT.NEW_USER_JOIN, handleJoin);
      socket.off(DOCUMENT_EVENT.USER_LEFT, handleLeft);
    };
  }, [socket, currentUser, showToast]);

  return activeUsers;
}