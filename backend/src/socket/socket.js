import cookie from "cookie";
import jwt from "jsonwebtoken";

import { ENV } from "../config/ENV.js";
import ApiError from "../utils/ApiError.js";
import { secureUser } from "../utils/helper.js";
import { mountCursorChangeOperation } from "./cursor.socket.js";
import {
  mountDocumetGetChangeEvent,
  mountDocumetSetChangeEvent,
} from "./document.socket.js";
import { CONNECT_DISCONNET_EVENT, DOCUMENT_EVENT } from "./socketEvents.js";

const mountJoinDocumentEvent = (socket) => {
  socket.on(DOCUMENT_EVENT.JOIN_DOCUMENT, (message) => {
    console.log("USER JOIN THE DOCUMENT ⚓, DOC ID", message.docId);
    socket.join(message.docId);
    socket.roomId = message.docId
  });

/*
  document {
  _id: new ObjectId('6a1ea3843eb0e4ad6667e2dd'),
  title: 'new doc',
  ownerId: new ObjectId('6a1e98445da01085b3e65c50'),
  isPublic: false,
  isTrash: false,
  users: [],
  createdAt: 2026-06-02T09:33:56.906Z,
  updatedAt: 2026-06-02T09:33:56.906Z,
  __v: 0
}

user {
  _id: '6a1e97ff5da01085b3e65c4f',
  fullName: 'Laxman Shinde',
  email: 'shindelaxman@gmail.com',
  avatar: '',
  isEmailVerified: false,
  createdAt: '2026-06-02T08:44:47.782Z',
  updatedAt: '2026-06-02T08:44:47.973Z',
  __v: 0
}
*/

  //  TODO : NOTIFY OTHER USER TO JOIN NEW USERS JOIN IN DOCUMENT
  // ** : WRITE HERE THIS LOGIC
};

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

      // common event mounted here
      mountJoinDocumentEvent(socket);
      mountDocumetSetChangeEvent(socket);

      mountDocumetGetChangeEvent(socket);

      socket.on(CONNECT_DISCONNET_EVENT.DISCONNECT, () => {
        console.log("🚨 USER DISS-CONNECTED USER : ", user.fullName);
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
