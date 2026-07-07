import pubClient from "../redis/pubClient.js";
import {
  CURSOR_EVENT,
  SOCKET_EVENT,
} from "./socketEvents.js";

export const mountCursorChangeOperation = (socket) => {
  socket.on(CURSOR_EVENT.CURSOR_CHANGE, async (data) => {
<<<<<<< HEAD
    // console.log("data",data)
    try {
      const { docId, range, userId, username, color } = data;
      // console.log("data",data)
=======
    try {
      const { docId, range, userId, username, color } = data;
>>>>>>> wind-breathing

      if (!docId) {
        return socket.emit(SOCKET_EVENT.ERROR, {
          message: "docId is required",
        });
      }
<<<<<<< HEAD
      // socket.to(docId).emit(CURSOR_EVENT.CURSOR_UPDATE, {
      //   userId: userId || socket.user.user_id,
      //   username: username || socket.fullName,
      //   range,
      //   color: color,
      //   socketId: socket.id,
      // });

=======
>>>>>>> wind-breathing

      await pubClient(docId, data, socket)
    } catch (err) {
      console.error("CURSOR_CHANGE error:", err);
      socket.emit(SOCKET_EVENT.ERROR, { message: "Failed to update cursor" });
    }
  });
};
