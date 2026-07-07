import pubClient from "../redis/pubClient.js";
import {
  CURSOR_EVENT,
  SOCKET_EVENT,
} from "./socketEvents.js";

export const mountCursorChangeOperation = (socket) => {
  socket.on(CURSOR_EVENT.CURSOR_CHANGE, async (data) => {
    // console.log("data",data)
    try {
      const { docId, range, userId, username, color } = data;
      // console.log("data",data)

      if (!docId) {
        return socket.emit(SOCKET_EVENT.ERROR, {
          message: "docId is required",
        });
      }
      // socket.to(docId).emit(CURSOR_EVENT.CURSOR_UPDATE, {
      //   userId: userId || socket.user.user_id,
      //   username: username || socket.fullName,
      //   range,
      //   color: color,
      //   socketId: socket.id,
      // });


      await pubClient(docId, data, socket)
    } catch (err) {
      console.error("CURSOR_CHANGE error:", err);
      socket.emit(SOCKET_EVENT.ERROR, { message: "Failed to update cursor" });
    }
  });
};
