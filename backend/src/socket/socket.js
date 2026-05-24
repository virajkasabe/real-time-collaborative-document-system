import cookie from "cookie";
import jwt from "jsonwebtoken";
<<<<<<< HEAD

import { ENV } from "../config/ENV.js";
import ApiError from "../utils/ApiError.js";
import { secureUser } from "../utils/helper.js";
import { mountCursorChangeOperation } from "./cursor.socket.js";
import {
  mountDocumentRecivedOperation,
  mountJoinDocumentEvent,
  startDocumentFlushScheduler,
} from "./document.socket.js";
import {
  mountPendingNotification,
  mountRecivedRealTimeNotification,
} from "./notification.socket.js";
import {
  CONNECT_DISCONNET_EVENT,
  DOCUMENT_EVENT,
} from "./socketEvents.js";

export const initializeSocketIO = (io) => {
  startDocumentFlushScheduler()
  return io.on(CONNECT_DISCONNET_EVENT.CONNECTION, async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      let token = cookies?.accessToken;
      if(!token){
         token = socket.header("Authorization")?.replace("Bearer ", "");
      }  
      if (!token) {
        token = token.handshake.auth?.token;
=======
import { ENV } from "../config/ENV.js";
import { getUser, setUser } from "../redis/client.js";
import ApiError from "../utils/ApiError.js";
import { CONNECT_DISCONNET_EVENT, DOCUMENT_EVENT } from "./socketEvents.js";

const mountJoinDocumentEvent = (socket) => {
  socket.on(DOCUMENT_EVENT.JOIN_DOCUMENT, (docId) => {
    console.log("USER JOIN THE DOCUMENT ⚓, DOC ID", docId);
    socket.join(docId);
  });

  //  TODO : NOTIFY OTHER USER TO JOIN NEW USERS JOIN IN DOCUMENT
  // ** : WRITE HERE THIS LOGIC
};

export const initializeSocketIO = (io) => {
  return io.on(CONNECT_DISCONNET_EVENT.CONNECTION, async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      let token = cookies?.accessToken;

      if (!token) {
        token = token.handshake.auth?.token;
        console.log("TOKEN FOUND IN HANDSHAKE AUTH 🛜", token);
>>>>>>> f7ad83d (feat(backend): implement core backend functionality with environment configuration, database connection, and socket integration)
      }

      if (!token) {
        throw new ApiError(
          401,
          "UN-AUTHORIZED HANDSHAKED , TOKEN IS MISSING ⛔"
        );
      }

      const decodedToken = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
<<<<<<< HEAD
      if (!decodedToken) {
        throw new ApiError(401, "Token Expired or Invalid 🤳");
      }

      // TODO : USER SEARCH ON REDIS OR MONGO
      let user = await secureUser(decodedToken._id);
=======

      // TODO : USER SEARCH ON REDIS OR MONGO
      let user;

      //  ?? user serach in redis
      user = await getUser(decodedToken._id);

      // ?? when not find in redis then search on mongo
      if (!user) {
        user = await User.findById(decodedToken._id);
        //  ** user find in mongo then add on redis
        if (user) {
          await setUser(decodedToken._id, user);
        }
      }
>>>>>>> f7ad83d (feat(backend): implement core backend functionality with environment configuration, database connection, and socket integration)

      // ?? when didn't didn't find anywhere then token invalid or un-authorized
      if (!user) {
        throw new ApiError(401, "UN-AUTHORIZED TOKEN , TOKEN IS INVALID ⛔");
      }

      socket.user = user;

<<<<<<< HEAD
      socket.join(socket.user._id.toString());
      socket.emit(CONNECT_DISCONNET_EVENT.CONNECTED);
      console.log(`🤝 USER CONNECTED | USER : ${socket.user.fullName}`);

      // event mounted here
      mountPendingNotification(socket, io);
      mountJoinDocumentEvent(socket, io);
      mountDocumentRecivedOperation(socket, io);
      mountRecivedRealTimeNotification(socket, io);
      mountCursorChangeOperation(socket)

      // mountDocumentSendOperation(socket);
      // mountNotificationEvent(socket);
      // mountJoinDocumentNewUser(socket)
      // mountNotificationEvent()

      socket.on(CONNECT_DISCONNET_EVENT.DISCONNECT, () => {
        console.log("🚨 USER DISS-CONNECTED USER : ", user.fullName);
        if (socket.docId) {
          socket.to(socket.docId).emit(DOCUMENT_EVENT.USER_LEFT, {
            messag: `${socket.user.fullName} was offine`,
            userId: socket.user._id,
          });
        }
        socket.leave(socket.user._id.toString());
=======
      socket.join(user._id.toString());
      socket.emit(CONNECT_DISCONNET_EVENT.CONNECT);
      console.log("🤝🌐🔗 USER CONNECTED USER ID : ", user._id.toString());

      // common event mounted here
      mountJoinDocumentEvent(socket);

      socket.on(CONNECT_DISCONNET_EVENT.DISCONNECT, () => {
        console.log("⛓️‍💥🚨 USER DISS-CONNECTED USER ID : ", user._id.toString());
        if (socket.user._id) {
          socket.leave(socket.user._id);
        }
>>>>>>> f7ad83d (feat(backend): implement core backend functionality with environment configuration, database connection, and socket integration)
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
