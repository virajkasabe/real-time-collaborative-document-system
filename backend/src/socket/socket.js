import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ENV } from "../config/ENV.js";
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
      }

      if (!token) {
        throw new ApiError(
          401,
          "UN-AUTHORIZED HANDSHAKED , TOKEN IS MISSING ⛔"
        );
      }

      const decodedToken = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);

      // TODO : USER SEARCH ON REDIS OR MONGO
      let user;

      //  ?? user serach in redis
      user = await redisClient.getUser(decodedToken._id);

      // ?? when not find in redis then search on mongo
      if (!user) {
        user = await User.findById(decodedToken._id);
        //  ** user find in mongo then add on redis
        if (user) {
          user = await redisClient.getUser(decodedToken._id);
        }
      }

      // ?? when didn't didn't find anywhere then token invalid or un-authorized
      if (!user) {
        throw new ApiError(401, "UN-AUTHORIZED TOKEN , TOKEN IS INVALID ⛔");
      }

      socket.user = user;

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
