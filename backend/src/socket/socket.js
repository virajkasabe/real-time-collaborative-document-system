import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ENV } from "../config/ENV.js";
import { getPendingNotification, getUser, setUser } from "../redis/client.js";
import ApiError from "../utils/ApiError.js";
import { fetchDoc, secureUser } from "../utils/helper.js";
import {
  mountDocumentRecivedOperation,
  mountDocumentSendOperation,
  mountJoinDocumentEvent,
} from "./document.socket.js";
import { mountNotificationEvent, mountPendingNotification } from "./notification.socket.js";
import {
  CONNECT_DISCONNET_EVENT,
  DOCUMENT_EVENT
 } from "./socketEvents.js";


export const initializeSocketIO = (io) => {
  return io.on(CONNECT_DISCONNET_EVENT.CONNECTION, async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      let token = cookies?.accessToken;

      if (!token) {
        token = token.handshake.auth?.token;
      }

      if (!token) {
        throw new ApiError(
          401,
          "UN-AUTHORIZED HANDSHAKED , TOKEN IS MISSING ⛔"
        );
      }

      const decodedToken = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
      if (!decodedToken) {
        throw new ApiError(401, "Token Expired or Invalid 🤳");
      }

      // TODO : USER SEARCH ON REDIS OR MONGO
      let  user = await secureUser(decodedToken._id)

      // ?? when didn't didn't find anywhere then token invalid or un-authorized
      if (!user) {
        throw new ApiError(401, "UN-AUTHORIZED TOKEN , TOKEN IS INVALID ⛔");
      }

      socket.user = user;

      socket.join(socket.user._id.toString());
      socket.emit(CONNECT_DISCONNET_EVENT.CONNECTED);
      console.log(
        "🤝🌐🔗 USER CONNECTED USER ID : ",
        socket.user._id.toString()
      );


      // event mounted here
      await mountPendingNotification(socket)
      mountJoinDocumentEvent(socket, io);
      mountNotificationEvent(socket);
      mountDocumentRecivedOperation(socket);
      mountDocumentSendOperation(socket);
      mountRecivedRealTimeNotification(socket)
      
      // mountJoinDocumentNewUser(socket)
      // mountNotificationEvent()

      socket.on(CONNECT_DISCONNET_EVENT.DISCONNECT, () => {
        console.log("⛓️‍💥🚨 USER DISS-CONNECTED USER ID : ", user._id.toString());
        if(socket.docId) {
            socket.to(socket.docId).emit(DOCUMENT_EVENT.USER_LEFT, {
                   messag : `${socket.user.fullName} was offine`,
                   userId : socket.user._id
            })
        }
        socket.leave(socket.user._id.toString())
      });

    } catch (error) {
      socket.emit(
        CONNECT_DISCONNET_EVENT.SOCKET_ERROR,
        error?.message || "Something went wrong"
      );
    }
  });
};

export const emitSocketEvent = (req, roomId, event, payload) => {
  req.app.get("io").in(roomId).emit(event, payload);
};
