import Doc from "../module/document/document.model.js";
import {
  deleteCollaboration,
  getCollaboration,
  getPendingNotification,
  deletePendingNotification,
  setDocument,
} from "../redis/client.js";
import { fetchDoc } from "../utils/helper.js";
import {
  COLLABORATION_EVENT,
  INVITATION_EVENT,
  NOTIFICATION_EVENT,
} from "./socketEvents.js";

export const mountRecivedRealTimeNotification = (socket) => {
  // Real-time invites and responses are now handled via HTTP API in collab.controller.js
  // and delivered via socket rooms, so we keep these as placeholders or no-ops.
  socket.on(INVITATION_EVENT.ACCEPT_INVITATION, async (data) => {
    console.log("Accept invitation via socket received:", data);
  });

  socket.on(INVITATION_EVENT.DECLINE_INVITATION, async (data) => {
    console.log("Decline invitation via socket received:", data);
  });
};

export const mountPendingNotification = async (socket) => {
  try {
    const payload = await getPendingNotification(socket.user.email);
    if (payload && payload.length > 0) {
      payload.forEach((notif) => {
        socket.emit(NOTIFICATION_EVENT.NOTIFICATION_RECEIVED, notif);
      });
      // Clear pending queue from Redis now that they have been dispatched
      await deletePendingNotification(socket.user.email);
    }
  } catch (error) {
    console.error("Error mounting pending notifications:", error);
  }
};
