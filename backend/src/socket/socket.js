import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ENV } from "../config/ENV.js";
import ApiError from "../utils/ApiError.js";
import { secureUser } from "../utils/helper.js";
import {
  mountDocumentRecivedOperation,
  // mountDocumentSendOperation,
  mountJoinDocumentEvent,
  startDocumentFlushScheduler,
} from "./document.socket.js";
import {
  mountPendingNotification,
  mountRecivedRealTimeNotification,
} from "./notification.socket.js";
import { CONNECT_DISCONNET_EVENT, DOCUMENT_EVENT } from "./socketEvents.js";

export const initializeSocketIO = (io) => {
  startDocumentFlushScheduler()
  return io.on(CONNECT_DISCONNET_EVENT.CONNECTION, async (socket) => {
    try {
      console.log("🚀 ~ file: socket.js:22 ~ socket.handshake.headers:", socket);
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      console.log("🚀 ~ file: socket.js:23 ~ cookies:", socket);

      let token = cookies?.accessToken;

      console.log("🚀 ~ file: socket.js:26 ~ token from header:", socket.header);

      if(!token){
         token = socket.header("Authorization")?.replace("Bearer ", "");
      }  
      
      console.log("🚀 ~ file: socket.js:24 ~ token:", token);

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
      let user = await secureUser(decodedToken._id);

      // ?? when didn't didn't find anywhere then token invalid or un-authorized
      if (!user) {
        throw new ApiError(401, "UN-AUTHORIZED TOKEN , TOKEN IS INVALID ⛔");
      }

      socket.user = user;

      socket.join(socket.user._id.toString());
      socket.emit(CONNECT_DISCONNET_EVENT.CONNECTED);
      console.log(`🤝 USER CONNECTED | USER : ${socket.user.fullName}`);

      // event mounted here
       mountPendingNotification(socket);
      mountJoinDocumentEvent(socket, io);
      mountDocumentRecivedOperation(socket);
      mountRecivedRealTimeNotification(socket);

      // mountDocumentSendOperation(socket);
      // mountNotificationEvent(socket);
      // mountJoinDocumentNewUser(socket)
      // mountNotificationEvent()

      socket.on(CONNECT_DISCONNET_EVENT.DISCONNECT, () => {
        console.log("⛓️‍💥🚨 USER DISS-CONNECTED USER : ", user.fullName);
        if (socket.docId) {
          socket.to(socket.docId).emit(DOCUMENT_EVENT.USER_LEFT, {
            messag: `${socket.user.fullName} was offine`,
            userId: socket.user._id,
          });
        }
        socket.leave(socket.user._id.toString());
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
