import {
  getUpdateDocumentOperation,
  setUpdateDocumentOperation,
} from "../redis/client.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { fetchDoc } from "../utils/helper.js";
import { DOCUMENT_EVENT } from "./socketEvents.js";

export const mountJoinDocumentEvent = (socket) => {
  socket.on(DOCUMENT_EVENT.USER_JOIN, async (data) => {
    const document = await fetchDoc(data.docId);

    console.log("document", document);
    console.log("user", socket.user);

    let docOwnerId = document.ownerId;
    let currentUserId = socket.user._id;

    if (docOwnerId.toString() !== currentUserId.toString()) {
      console.error("your not owner of this doc");
    }
    let user = document.users.filter((user) => {
      user._id.toString() === socket.user._id.toString();
      return user.role;
    });

    console.log("USER JOIN THE DOCUMENT ⚓, DOC ID", data.docId);
    socket.join(data.docId);
    socket.roomId = data.docId;
  });

  //  TODO : NOTIFY OTHER USER TO JOIN NEW USERS JOIN IN DOCUMENT
  // ** : WRITE HERE THIS LOGIC
};

export const mountDocumentRecivedOperation = (socket) => {
  socket.on(DOCUMENT_EVENT.RECEIVE_OPERATION, async (data) => {
    // const { docId, delta } = message;
    //  TODO : FOR TESTING USE MESSAGE BUT WHEN ENTER ON PRODUCTION THE USE DATA OR PAYLOAD
    /*
    ?? data WILL GET ON INSTED OF MESSAGE IN PARAM
  */

    // ?? INTEGRETE OT HERE ( operational transformation )
    // ?? USING TIMESTAMP

    console.log(data);
    const { docId, delta } = data.data;
    console.log("delta", delta);
    console.log("docId", docId);

    if (!docId) {
      throw new ApiError(400, "Doc Id is required");
    }
    const document = await fetchDoc(docId);
    socket.to(docId).emit(DOCUMENT_EVENT.SEND_OPERATION, { docId, delta });
    await setUpdateDocumentOperation(docId, delta);
    console.log("Document setup successfully");
  });
};

export const mountDocumentSendOperation = (socket) => {
  socket.emit(DOCUMENT_EVENT.SEND_OPERATION, async (data) => {
    console.log("data", data);

    const { docId } = data.data;

    if (!docId) {
      throw new ApiError(400, "Doc Id is required");
    }

    // console.log("document", document)
    const doc = await getUpdateDocumentOperation(docId);
    socket.emit(DOCUMENT_EVENT.SEND_OPERATION, doc);

    console.log("doc", doc);
    return doc;
  });
};

const flushOnMongo = asyncHandler(async (payload) => {
  // TODO : WHEN USER ON ONGOING WORK THEN EVERY 10SEC TRIGER THIS FUNCTION
  const { data, docId } = payload;

  // ?? GET ALL DATA FROM REDIS COLLAB
  // ?? ARRANGE FULL OF DATA
  // ?? AND FINALLY UPDATE FULL OF DATA
});


// TODO : INPIREATION for join document
/*

    import { DOCUMENT_EVENT, NOTIFICATION_EVENT } from "./socketEvents.js";
    import { sendNotification } from "./notification.socket.js";
    import { emitSocketEvent } from "../socket/socket.js";

    const mountJoinDocumentEvent = (socket, io) => { // io bhi pass kar
      socket.on(DOCUMENT_EVENT.USER_JOIN, async (data) => {
        try {
          const document = await fetchDoc(data.docId);
          const currentUserId = socket.user._id.toString();

          console.log("USER JOIN REQUEST ⚓, DOC ID:", data.docId, "USER:", currentUserId);

          // 1. Check karo user ka access hai ya nahi
          const isOwner = document.ownerId.toString() === currentUserId;

          const userInDoc = document.users.find(
            (u) => u.userId.toString() === currentUserId
          );

          if (!isOwner && !userInDoc) {
            socket.emit(DOCUMENT_EVENT.ERROR, {
              message: "You don't have access to this document"
            });
            return;
          }

          const userRole = isOwner ? 'owner' : userInDoc.role;

          // 2. Room join karao
          socket.join(data.docId);
          socket.roomId = data.docId;

          console.log(`User ${socket.user.fullName} joined doc ${data.docId} as ${userRole}`);

          // 3. BAaki users ko notify karo naya user aaya
          // emitSocketEvent se sabko bhej do except khud ko
          socket.to(data.docId).emit(DOCUMENT_EVENT.USER_JOINED, {
            message: `${socket.user.fullName} joined the document`,
            user: {
              _id: socket.user._id,
              fullName: socket.user.fullName,
              avatar: socket.user.avatar,
              role: userRole
            },
            timestamp: new Date().toISOString()
          });

          // 4. Jo abhi join hua usko current active users ki list bhej do
          const socketsInRoom = await io.in(data.docId).fetchSockets();
          const activeUsers = socketsInRoom.map(s => ({
            _id: s.user._id,
            fullName: s.user.fullName,
            avatar: s.user.avatar
          }));

          socket.emit(DOCUMENT_EVENT.ACTIVE_USERS, {
            users: activeUsers,
            count: activeUsers.length
          });

        } catch (err) {
          console.error("USER_JOIN error:", err);
          socket.emit(DOCUMENT_EVENT.ERROR, { message: "Failed to join document" });
        }
      });

      // User leave kare to bhi notify karo
      socket.on(DOCUMENT_EVENT.USER_LEAVE, async (data) => {
        if (socket.roomId) {
          socket.to(socket.roomId).emit(DOCUMENT_EVENT.USER_LEFT, {
            message: `${socket.user.fullName} left the document`,
            userId: socket.user._id,
            timestamp: new Date().toISOString()
          });
          socket.leave(socket.roomId);
          socket.roomId = null;
        }
      });
    };

*/
