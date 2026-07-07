import Doc from "../module/document/document.model.js";
import {
  deleteCollaboration,
  getCollaboration,
  getNotification,
  setDocument,
} from "../redis/client.js";
import ApiError from "../utils/ApiError.js";
import { fetchDoc, secureUser } from "../utils/helper.js";
import { acceptCollab, declineCollab } from "./collaboration.js";
import {
  COLLABORATION_ERROR_EVENT,
  COLLABORATION_EVENT,
  INVITATION_EVENT,
  NOTIFICATION_EVENT,
  SOCKET_EVENT,
} from "./socketEvents.js";


export const mountRecivedRealTimeNotification = (socket, io) => {

  socket.on(INVITATION_EVENT.ACCEPT_INVITATION, async (data) => {
    await acceptCollab(io,socket,data)
  })

  socket.on(INVITATION_EVENT.DECLINE_INVITATION, async (data) => {
    await declineCollab(io,socket,data)
  })

};


export const mountPendingNotification = async (socket, io) => {
  const payload = await getNotification(socket.user.email);

  const userNotifications = payload.filter((i)=>{
     return  i.accepterEmail === socket.user.email
  })

  if (payload?.length >= 0) {
    io.to(socket.user._id).emit(NOTIFICATION_EVENT.NOTIFICATION_RECIVED, userNotifications)
  }
};



