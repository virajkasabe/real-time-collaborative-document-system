import Doc from "../module/document/document.model.js";
import {
  deleteCollaboration,
  getCollaboration,
  getPendingNotification,
  setDocument,
} from "../redis/client.js";
import ApiError from "../utils/ApiError.js";
import { fetchDoc, secureUser } from "../utils/helper.js";
import {
  COLLABORATION_EVENT,
  INVITATION_EVENT,
  NOTIFICATION_EVENT,
  SOCKET_EVENT,
} from "./socketEvents.js";
import crypto from 'crypto'

export const mountRecivedRealTimeNotification = (socket) => {
  socket.on(INVITATION_EVENT.ACCEPT_INVITATION, async (data) => {

    const { collabId } = data

    const user = await secureUser(socket.user._id);

    const hashedTokenID = crypto
      .createHash("sha256")
      .update(collabId)
      .digest("hex");

    const collabData = await getCollaboration(collabId);
    if (!collabData) {
      // TODO :  throw the socker error not the apierror
      // throw new ApiError(400, "Token Expired or Invalid");
      console.log("ERROR : Token Expired or Invalid")
    }

    const { docId,role, inviterId } = collabData

    const inveter = await secureUser(inviterId)

    const doc = await fetchDoc(docId);

    if (doc.ownerId.toString() === user._id.toString()) {
      throw new ApiError(400, "Owner can't add on Users");
    }

    const userAlreadyExists = doc.users.some(
      (collaborator) =>
        collaborator.userId.toString() === user._id.toString()
    );

    if (userAlreadyExists) {
      await deleteCollaboration(collabId);
      // throw new ApiError(401, "User Already exist");
      socket.emit(inveter._id).emit(SOCKET_EVENT.ERROR,{message : "User Already exist"})
    }

    const updateDocument = await Doc.findByIdAndUpdate(
      collabData.docId,
      {
        $push: {
          users: {
            userId: user._id,
            role: role,
          },
        },
      },
      { new: true }
    );

    const acceptCollabData = {
      type: "COLLAB_ACCEPTED",
      accepterName: socket.user.fullName,
      documentId: doc._id,
      documentName: doc.title,
      message: `${socket.user.fullName} accepted your collaboration on "${doc.title}"`,
      time: new Date().toISOString(),
    };

    socket
      .to(inveter._id)
      .emit(COLLABORATION_EVENT.ACCEPT_COLLABORATION, acceptCollabData);
    await deleteCollaboration(hashedTokenID);
    await setDocument(updateDocument._id, updateDocument);
  });

  socket.on(INVITATION_EVENT.DECLINE_INVITATION, async (data) => {
    const user = await secureUser(socket.user._id);
    const hashedTokenID = crypto
      .createHash("sha256")
      .update(tokenId)
      .digest("hex");

    const collabData = await getCollaboration(hashedTokenID);
    if (!collabData) {
      // TODO :  throw the socker error not the apierror
      console.log("ERROR : Token Expired or Invalid")
    }

    const doc = await fetchDoc(collabData.docId);

    const declineCollabData = {
      type: "COLLAB_DECLINED",
      declineUserName: socket.user.fullName,
      documentId: doc._id,
      documentName: doc.title,
      message: `${socket.user.fullName} decline your collaboration on "${doc.title}"`,
      time: new Date().toISOString(),
    };

    socket
      .to(doc.inviterId)
      .emit(COLLABORATION_EVENT.DECLINE_COLLABORATION, acceptCollabData);
  });
};

export const mountPendingNotification = async (socket, io) => {
  const payload = await getPendingNotification(socket.user.email);
  // console.log(payload)

  const userNotifications = payload.filter((i)=>{
     return  i.inviterEmail === socket.user.email
  })

  // console.log("userNotifications", userNotifications)

  if (payload?.length >= 0) {
    // console.log("userNotifications", userNotifications)
    io.to(socket.user._id).emit(NOTIFICATION_EVENT.NOTIFICATION_RECIVED, userNotifications)
  }
};
