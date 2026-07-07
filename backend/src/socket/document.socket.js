import { verifyDocumentEditor } from "../middleware/document.middleware.js";
import Doc from "../module/document/document.model.js";
import {
  appendDocHistory,
  getDirtyDocument,
  getDocHistory,
  getDocument,
  markDocumentDirty,
  removeDirtyDocument,
  setDocument,
} from "../redis/client.js";
import { subscribeToDocument } from "../redis/subClient.js";
<<<<<<< HEAD
import ApiError from "../utils/ApiError.js";
import { fetchDoc } from "../utils/helper.js";
import { applyOperation, transformOperations } from "../utils/ot.js";
import { CURSOR_EVENT, DOCUMENT_EVENT, SOCKET_EVENT } from "./socketEvents.js";
=======
import { fetchDoc } from "../utils/helper.js";
import { applyActionsToOps, transformOperations } from "../utils/ot.js";
import { DOCUMENT_EVENT, SOCKET_EVENT } from "./socketEvents.js";


>>>>>>> wind-breathing

const documentQueues = new Map();

const queueDocumentOperation = (docId, task) => {
  if (!documentQueues.has(docId)) {
    documentQueues.set(docId, Promise.resolve());
  }
<<<<<<< HEAD
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

=======

  const next = documentQueues.get(docId).then(async () => {
    try {
      await task();
    } catch (err) {
      console.error("Queue task failed:", err.message);
    }
  });

  documentQueues.set(docId, next);

  next.then(() => {
    if (documentQueues.get(docId) === next) {
      documentQueues.delete(docId);
    }
  });

  return next;
};



const warmDocument = async (docId) => {
  const dbDoc = await fetchDoc(docId);
  const document = {
    _id: dbDoc._id.toString(),
    title: dbDoc.title,
    version: dbDoc.version || 0,
    content: dbDoc.content || { ops: [] },
    isPublic: dbDoc.isPublic,
    users: dbDoc.users,
    ownerId: dbDoc.ownerId?.toString(),
  };
  await setDocument(docId, document);
  return document;
};



>>>>>>> wind-breathing
export const mountJoinDocumentEvent = (socket, io) => {
  socket.on(DOCUMENT_EVENT.USER_JOIN, async (data) => {
    try {
      const currentUserId = socket.user._id.toString();
      const document = await fetchDoc(data.docId);

<<<<<<< HEAD
      console.log("user JOIN REQUEST OF DOCUMENT ⚓, DOC ID:", data.docId);

      const isOwner = document.ownerId.toString() === currentUserId;

      const userInDoc = document.users.find(
        (u) => u.userId.toString() === currentUserId
      );

      await subscribeToDocument(data.docId, io)
=======
      console.log("USER_JOIN ⚓ docId:", data.docId);

      const isOwner = document.ownerId?.toString() === currentUserId;
      const userInDoc = Array.isArray(document.users)
        ? document.users.find((u) => u.userId?.toString() === currentUserId)
        : null;
>>>>>>> wind-breathing

      if (!isOwner && !userInDoc) {
        socket.emit(DOCUMENT_EVENT.ERROR, {
          message: "You don't have access to this document",
        });
        return;
      }

<<<<<<< HEAD
      socket.join(data.docId);
      socket.roomId = data.docId;
      const userRole = isOwner ? "Owner" : userInDoc?.role || "Viewer";


      //  document.users.map((u)=>{
            socket.to(data.docId).emit(DOCUMENT_EVENT.NEW_USER_JOIN, {
              message: `${socket.user.fullName} joined the document`,
              user: {
                _id: socket.user._id,
                fullName: socket.user.fullName,
                avatar: socket.user.avatar || "",
                role: userRole,
              },
              timestamp: new Date().toISOString(),
            });
        // })

      const socketsInRoom = await io.in(data.docId).fetchSockets();
      const activeUsers = socketsInRoom.map((s) => ({
        _id: s.user._id,
        fullName: s.user.fullName,
        avatar: s.user.avatar,
      }));

      socket.emit(DOCUMENT_EVENT.ACTIVE_USERS, {
        users: activeUsers,
        count: activeUsers.length,
=======
      await subscribeToDocument(data.docId, io);
      socket.join(data.docId);
      socket.roomId = data.docId;

      const userRole = isOwner ? "Owner" : userInDoc?.role || "Viewer";

      socket.to(data.docId).emit(DOCUMENT_EVENT.NEW_USER_JOIN, {
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
      socket.emit(DOCUMENT_EVENT.ACTIVE_USERS, {
        users: socketsInRoom.map((s) => ({
          _id: s.user._id,
          fullName: s.user.fullName,
          avatar: s.user.avatar,
        })),
        count: socketsInRoom.length,
>>>>>>> wind-breathing
      });
    } catch (err) {
      console.error("USER_JOIN error:", err);
      socket.emit(DOCUMENT_EVENT.SOCKET_ERROR, {
        message: "Failed to join document",
      });
    }
  });
<<<<<<< HEAD
  socket.on(DOCUMENT_EVENT.USER_LEAVE, async (data) => {
=======

  socket.on(DOCUMENT_EVENT.USER_LEAVE, async () => {
>>>>>>> wind-breathing
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

<<<<<<< HEAD
export const mountDocumentRecivedOperation = (socket, io) => {
  socket.on(DOCUMENT_EVENT.SEND_OPERATION, async (data) => {
    // const { docId, delta } = message;

    const payload = data.data || data;

    // console.log("payload", payload)

    const { docId, actions, version } = payload;

    if (!docId) {
      throw new ApiError(400, "Doc Id is required");
    }

    const isUserAuthorizedToEdit = await verifyDocumentEditor(
      docId,
      socket.user
    );
    if (!isUserAuthorizedToEdit) {
      return socket.emit(SOCKET_EVENT.ERROR, {
        message: "YOUR NOT AUTHORIZED FOR THIS ACTION",
      });
    }

    if (!actions || !Array.isArray(actions)) {
      return socket.emit(SOCKET_EVENT.ERROR, {
        message: "actionss array is required for OT",
      });
    }

    if (typeof version !== "number") {
      return socket.emit(SOCKET_EVENT.ERROR, {
        message: "version number is required or OT",
      });
    }

    // apply queueDocumentOperation
    queueDocumentOperation(docId, async () => {
      try {
        const document = await fetchDoc(docId);
        let documentVersion = document.version || 0;

        let clientVersion = version;
        let transformedActions = [...actions];

        if (clientVersion < document.version) {
          // console.log( `[OT Conflict] client version ${clientVersion} < Server Version ${document.version}. Tranforming.....`);

          const history = await getDocHistory(docId); // from client
          const concurrentOts = history.filter(
            (op) => op.version > clientVersion
          );

          for (const op of concurrentOts) {
            transformedActions = transformOperations(
              // ot
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
 
        // console.log("first", document.content)
        
        await setDocument(docId, document.content); 
        
        const getDoc = await getDocument(docId)

        await appendDocHistory(docId, document.version, transformedActions); // client

        await markDocumentDirty(docId); // client

        // console.log("transformOperations", transformOperations)

        // console.log("docum", document.content)

        // console.log("documen",actions[0])

        // documen [ { type: 'insert', position: 2, text: 's', attributes: {} } ]

        // posistion
        // attribute
        // text

        const { position, attributes, text } = actions[0]
        console.log("posistion", position )
        console.log("attribute", attributes)
        console.log("text", text)


        


        
            socket.to(docId).emit(DOCUMENT_EVENT.RECEIVE_OPERATION, {
              docId,
              actions: actions,
              version: document.version,
            });



        
        // console.log(`Document ${docId} version update to ${document.version}`);
      } catch (error) {
        console.error("SEND OPERATION", error.message);
        socket.emit(SOCKET_EVENT.ERROR, {
          message: error.message || "Failed to proccess OT operations",
        });
      }
    });
=======


export const mountDocumentRecivedOperation = (socket, io) => {
  socket.on(DOCUMENT_EVENT.SEND_OPERATION, async (data) => {
    const payload = data.data || data;
    const { docId, actions, version, userId } = payload;

    // Basic validation
    if (!docId) {
      return socket.emit(SOCKET_EVENT.ERROR, { message: "docId is required" });
    }
    if (!Array.isArray(actions) || actions.length === 0) {
      return socket.emit(SOCKET_EVENT.ERROR, { message: "actions array is required" });
    }
    if (typeof version !== "number") {
      return socket.emit(SOCKET_EVENT.ERROR, { message: "version number is required" });
    }

    try {
      const isAuthorized = await verifyDocumentEditor(docId, socket.user);
      if (!isAuthorized) {
        return socket.emit(SOCKET_EVENT.ERROR, { message: "Not authorized" });
      }

      queueDocumentOperation(docId, async () => {
        
        let document = await getDocument(docId);
        if (!document) {
          document = await warmDocument(docId);
        }

        const serverVersion = document.version || 0;
        let transformedActions = [...actions];

        
        if (version < serverVersion) {
          console.log(`[OT] client@${version} < server@${serverVersion} — transforming`);
          const history = (await getDocHistory(docId)) || [];
          const concurrent = history.filter((h) => h.version > version && h.userId !== userId);

          for (const entry of concurrent) {
            if (Array.isArray(entry.actions)) {
              transformedActions = transformOperations(entry.actions, transformedActions);
            }
          }
        }

        
        const currentOps = document.content?.ops || [];
        const updatedOps = applyActionsToOps(currentOps, transformedActions);

        
        document.content = { ops: updatedOps };
        document.version = serverVersion + 1;

        console.log(
          `[DOC] ${docId} v${document.version} — ops: ${updatedOps.length}`
        );

        
        socket.to(docId).emit(DOCUMENT_EVENT.RECEIVE_OPERATION, {
          docId,
          actions: transformedActions,
          version: document.version,
        });

        
        await Promise.all([
          setDocument(docId, document),
          appendDocHistory(docId, document.version, transformedActions, userId),
          markDocumentDirty(docId)
        ]);
      });
    } catch (err) {
      console.error("SEND_OPERATION error:", err.message);
      socket.emit(SOCKET_EVENT.ERROR, {
        message: err.message || "Failed to process operation",
      });
    }
>>>>>>> wind-breathing
  });
};


<<<<<<< HEAD
// TODO : FUNCTION WILL FULL COMMENT 
export const startDocumentFlushScheduler = () => {
  // console.log(
  //   "Your changes are automatically synced and saved to MongoDB every 10 seconds : ⚡💾"
  // );
  // setInterval(async () => {
  //   try {
  //     const dirtyDocIds = await getDirtyDocument();
  //     if (!dirtyDocIds || dirtyDocIds.length === 0) {
  //       return;
  //     }
  //     // const removed = 1;
  //     for (const docId of dirtyDocIds) {
  //       console.log("trigged the document", "docId", docId)
  //       const removed = await removeDirtyDocument(docId);
  //       console.log("trigged the removed", "removed", removed)
  //       if(removed) {
  //         const document = await getDocument(docId);
  //         console.log("doc", document.content)
  //         if (document) {
  //           console.log("document", document)
  //           try {
  //             await Doc.findByIdAndUpdate(
  //               docId,
  //               {
  //                 $set: {
  //                   content: document.content,
  //                   version: document.version,
  //                   title: document.title,
  //                 },
  //               },
  //               {
  //                 new: true,
  //                 runValidators: true,
  //               }
  //             );
  //             console.log(`flush on mongodb ${docId} [ version of document : ${document.version} ⚓ ]`);
  //           } catch (dbError) {
  //             console.error("failed to save in mongodb", dbError.message);
  //             await markDocumentDirty(docId);
  //           }
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("ERROR ON RUNING FLUSH DOCUMENT ", error.message);
  //   }
  // }, 10000);
};
=======

export const startDocumentFlushScheduler = () => {
  console.log("Auto-sync to MongoDB every 10s ⚡💾");

  setInterval(async () => {
    try {
      const dirtyIds = await getDirtyDocument();
      if (!dirtyIds?.length) return;

      for (const docId of dirtyIds) {
        const removed = await removeDirtyDocument(docId);
        if (!removed) continue;

        const document = await getDocument(docId);
        if (!document) continue;

        try {
          await Doc.findByIdAndUpdate(
            docId,
            {
              $set: {
                content: document.content,  
                version: document.version || 0,
                title: document.title || "Untitled Document",
              },
            },
            { new: true, runValidators: true }
          );

          console.log(`Flushed ${docId} [v${document.version}] ⚓`);
        } catch (dbErr) {
          console.error("MongoDB flush failed:", dbErr.message);
          // Put it back in the dirty set so it retries next tick
          await markDocumentDirty(docId);
        }
      }
    } catch (err) {
      console.error("Flush scheduler error:", err.message);
    }
  }, 10000);
};
>>>>>>> wind-breathing
