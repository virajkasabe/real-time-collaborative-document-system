import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ENV } from "../config/ENV.js";
import { getUser, setUser } from "../redis/client.js";
import ApiError from "../utils/ApiError.js";
import { fetchDoc } from "../utils/helper.js";
import {
  mountDocumentReciveOperation,
  mountDocumentSendOperation,
} from "./document.socket.js";
import { CONNECT_DISCONNET_EVENT, DOCUMENT_EVENT } from "./socketEvents.js";

const mountJoinDocumentEvent = (socket) => {
  socket.on(DOCUMENT_EVENT.USER_JOIN, async (data) => {
    const document = await fetchDoc(data.docId);

    console.log("document", document);
    console.log("user", socket.user)


    let docOwnerId = document.ownerId
    let currentUserId = socket.user._id


    if(docOwnerId.toString() !== currentUserId.toString()) {
      console.error("your not owner of this doc");
    }
    let user =   document.users.filter((user)=>{
      user._id.toString() === socker.user._id.toString()
      return user.role
    })

    console.log("USER JOIN THE DOCUMENT ⚓, DOC ID", data.docId);
    socket.join(data.docId);
    socket.roomId = data.docId;
  });

  //  TODO : NOTIFY OTHER USER TO JOIN NEW USERS JOIN IN DOCUMENT
  // ** : WRITE HERE THIS LOGIC
};

const mountNotificationEvent = (socket) => {
  socket.on("notification"), async(data)=> {
      socket.user = 
  }
}

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

      // ?? when didn't didn't find anywhere then token invalid or un-authorized
      if (!user) {
        throw new ApiError(401, "UN-AUTHORIZED TOKEN , TOKEN IS INVALID ⛔");
      }

      socket.user = user;

      socket.join(user._id.toString());
      socket.emit(CONNECT_DISCONNET_EVENT.CONNECT);
      console.log("🤝🌐🔗 USER CONNECTED USER ID : ", user._id.toString());

      // event mounted here
      mountJoinDocumentEvent(socket);
      mountNotificationEvent(socket)
      mountDocumentReciveOperation(socket);
      mountDocumentSendOperation(socket);
      mountJoinDocumentNewUser(socket)

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

export const emitSocketEvent = (req,roomId, event, payload) => {
  req.app.get('io').in(roomId).emit(event, payload)
}
