import Doc from "../module/document/document.model.js";
import { appendDocHistory, getDirtyDocument, getDocHistory, getDocument, markDocumentDirty, setDocument } from "../redis/client.js";
import ApiError from "../utils/ApiError.js";
import { fetchDoc } from "../utils/helper.js";
import { applyOperation, transformOperations } from "../utils/ot.js";
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

    if (!docId) {
      throw new ApiError(400, "Doc Id is required");
    }

    if (!actions || !Array.isArray(actions)) {
      return socket.emit("error", {
        message: "actionss array is required for OT",
      });
    }

    if (typeof version !== "number") {
      return socket.emit("error", {
        message: "version number is required or OT",
      });
    }

    // apply queueDocumentOperation
    queueDocumentOperation(docId, async () => {
      try {
        const document = fetchDoc(docId);
        documentVersion = document.version || 0;

        let clientVersion = version;
        let transformedActions = [...actions];

        if (clientVersion < document.version) {
          console.log(
            `[OT Conflict] client version ${clientVersion} < Server Version ${document.version}. Tranforming.....`
          );

          const history = await getDocHistory(docId); // from client
          const concurrentOts = history.filter(
            (op) => op.version > clientVersion
          );

          for (const op of concurrentOts) {
            transformedActions = transformOperations( // ot
              // from ot.js
              op.actions,
              transformedActions
            );
          }
        }
        let currentContentText = document.content;
        if (
          typeof currentContentText === "object" &&
          currentContentText !== null
        ) {
          currentContentText = currentContentText.text || "";
        } else if (typeof currentContentText === "string") {
          currentContentText = "";
        }

        const updateText = applyOperation(
          currentContentText,
          transformedActions
        );

        document.content = { text: updateText };
        document.version = (document.version || 0) + 1;

        await setDocument(docId, document); // client

        await appendDocHistory(docId, document.version, transformedActions); // client

        await markDocumentDirty(docId); // client

        socket.io(docId).emit(DOCUMENT_EVENT.RECEIVE_OPERATION, {
          docId,
          actions: transformedActions,
          version: document.version,
        });

        console.log(`Document ${docId} version update to ${document.version}`);
      } catch (error) {
        console.error("SEND OPERATION", error.message);
        socket.emit("error", {
          message: error.message || "Failed to proccess OT operations",
        });
      }
    });
  });
};

export const startDocumentFlushScheduler = () => {
  console.log("Your changes are automatically synced and saved to MongoDB every 10 seconds : ⚡💾")
    setInterval(async()=>{
      try {
          const dirtyDocIds = await getDirtyDocument();
          if(!dirtyDocIds || dirtyDocIds.length === 0) {
              return;
          }
          for(const docId of dirtyDocIds) {
               const removed = await removeDirtyDocument(docId);
               if(removed) {
                    const document = await getDocument(docId)
                    if(document) {
                      try {
                        await Doc.findByIdAndUpdate(
                          docId,
                          {
                            $set : {
                                content : document.content,
                                version : document.version,
                                title : document.title
                            }
                          },
                          {
                            new  : true, runValidators : true
                          }
                        )
                        console.log(`flush on mongodb ${docId} [ version of document : ${document.version} ⚓ ]`)
                    } catch (dbError) {
                          console.error("failed to save in mongodb" , dbError.message);
                          await markDocumentDirty(docId)
                    }
                    }
               }
          }
      } catch (error) {
          console.error("ERROR ON RUNING FLUSH DOCUMENT ", error.message)
      }
    },10000)
}
