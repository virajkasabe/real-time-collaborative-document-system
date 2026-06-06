import { setUpdateDocumentOperation } from "../redis/client.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { fetchDoc } from "../utils/helper.js";
import { DOCUMENT_EVENT } from "./socketEvents.js";

const documentQueues = new Map();

const queueDocumentOperation = (docId, task) => {
  if (!documentQueues.has(docId)) {
    documentQueues.set(docId, Promise.resolve());
  }
  const currentPromise = documentQueues.get(docId);
  const nextPromise = currentPromise.then(async () => {
    try {
      await task();
    } catch (error) {
      console.error(`${error.message} ` || "Task QUEUE FAILED ");
    }
  });
  documentQueues.set(docId, nextPromise);

  nextPromise.then(() => {
    if (documentQueues.get(docId) === nextPromise) {
      documentQueues.delete(docId);
    }
  });
  return nextPromise;
};

export const mountJoinDocumentEvent = (socket, io) => {
  socket.on(DOCUMENT_EVENT.USER_JOIN, async (data) => {
    try {
      const currentUserId = socket.user._id.toString();
      const document = await fetchDoc(data.docId);

      console.log("user JOIN REQUEST OF DOCUMENT ⚓, DOC ID:", data.docId);

      const isOwner = document.ownerId.toString() === currentUserId;

      const userInDoc = document.users.find(
        (u) => u.userId.toString() === currentUserId
      );

      if (!isOwner && !userInDoc) {
        socket.emit(DOCUMENT_EVENT.ERROR, {
          message: "You don't have access to this document",
        });
        return;
      }

      socket.join(data.docId);
      socket.roomId = data.docId;
      const userRole = isOwner ? "owner" : userInDoc?.role || "viewer";

      console.log(
        `User ${socket.user.fullName} joined doc ${data.docId} as ${userRole}`
      );

      socket.to(data.docId).emit(DOCUMENT_EVENT.USER_JOINED, {
        message: `${socket.user.fullName} joined the document`,
        user: {
          _id: socket.user._id,
          fullName: socket.user.fullName,
          avatar: socket.user.avatar || "",
          role: userRole,
        },
        timestamp: new Date().toISOString(),
      });

      const socketsInRoom = await io.in(data.docId).fetchSockets();
      const activeUsers = socketsInRoom.map((s) => ({
        _id: s.user._id,
        fullName: s.user.fullName,
        avatar: s.user.avatar,
      }));

      socket.emit(DOCUMENT_EVENT.ACTIVE_USERS, {
        users: activeUsers,
        count: activeUsers.length,
      });
    } catch (err) {
      console.error("USER_JOIN error:", err);
      socket.emit(DOCUMENT_EVENT.SOCKET_ERROR, {
        message: "Failed to join document",
      });
    }
  });
  socket.on(DOCUMENT_EVENT.USER_LEAVE, async (data) => {
    if (socket.roomId) {
      socket.to(socket.roomId).emit(DOCUMENT_EVENT.USER_LEFT, {
        message: `${socket.user.fullName} left the document`,
        userId: socket.user._id,
        timestamp: new Date().toISOString(),
      });
      socket.leave(socket.roomId);
      socket.roomId = null;
    }
  });
};

export const mountDocumentRecivedOperation = (socket) => {
  socket.on(DOCUMENT_EVENT.SEND_OPERATION, async (data) => {
    // const { docId, delta } = message;

    const payload = data.data || data;

    const { docId, actions, version } = payload;

    console.log(data);
    const { docId, delta } = data.data;
    console.log("delta", delta);
    console.log("docId", docId);

    delta.operation === "CONTENT_CHANGE";

    if (!docId) {
      throw new ApiError(400, "Doc Id is required");
    }
    const document = await fetchDoc(docId);
    socket.to(docId).emit(DOCUMENT_EVENT.RECEIVE_OPERATION, { docId, delta });
    await setUpdateDocumentOperation(docId, delta);
    console.log("Document setup successfully");
  });
};

const flushOnMongo = asyncHandler(async (payload) => {
  // TODO : WHEN USER ON ONGOING WORK THEN EVERY 10SEC TRIGER THIS FUNCTION
  const { data, docId } = payload;

  // ?? GET ALL DATA FROM REDIS COLLAB
  // ?? ARRANGE FULL OF DATA
  // ?? AND FINALLY UPDATE FULL OF DATA
});
