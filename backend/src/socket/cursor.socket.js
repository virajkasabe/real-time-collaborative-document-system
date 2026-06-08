import { CURSOR_EVENT, SOCKET_EVENT } from "./socketEvents.js";

export const mountCursorChangeOperation = (socket) => {
  socket.on(CURSOR_EVENT.CURSOR_CHANGE, async (data) => {
    try {
      const { docId, range, userId, username, color } = data;

      if (!docId) {
        return socket.emit(SOCKET_EVENT.ERROR, {
          message: "docId is required",
        });
      }
      socket.to(docId).emit(CURSOR_EVENT.CURSOR_UPDATE, {
        userId: userId || socket.user.user_id,
        username: username || socket.fullName,
        range,
        color: color,
        socketId: socket.id,
      });

      const payload = {
        event: CURSOR_EVENT.CURSOR_UPDATE,
        payload: {
          userId: socket.user._id,
          fullName: socket.user.fullName,
          range,
          docId,
        },
      };
      await pubClient(docId, payload);
    } catch (err) {
      console.error("CURSOR_CHANGE error:", err);
      socket.emit(SOCKET_EVENT.ERROR, { message: "Failed to update cursor" });
    }
  });
};
