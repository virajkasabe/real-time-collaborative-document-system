import Doc from "../module/document/document.model.js";
import {
  deleteCollaboration,
  getCollaboration,
  getPendingNotification,
  setDocument,
} from "../redis/client.js";
import { fetchDoc } from "../utils/helper.js";
import {
  COLLABORATION_EVENT,
  INVITATION_EVENT,
  NOTIFICATION_EVENT,
} from "./socketEvents.js";

export const mountRecivedRealTimeNotification = (socket) => {
  socket.on(INVITATION_EVENT.ACCEPT_INVITATION, async (data) => {
    const user = await secureUser(socket.user._id);
    const hashedTokenID = crypto
      .createHash("sha256")
      .update(tokenId)
      .digest("hex");

    const collabData = await getCollaboration(hashedTokenID);
    if (!collabData) {
      throw new ApiError(400, "Token Expired or Invalid");
    }

    const doc = await fetchDoc(collabData.docId);

    if (doc.ownerId.toString() === user._id.toString()) {
      throw new ApiError(400, "Owner can't add on Users");
    }

    const userAlreadyExists = doc.users.some(
      (collaborator) =>
        collaborator.userId.toString() === req.user._id.toString()
    );

    if (userAlreadyExists) {
      await deleteCollaboration(hashedTokenID);
      throw new ApiError(401, "User Already exist");
    }

    const updateDocument = await Doc.findByIdAndUpdate(
      collabData.docId,
      {
        $push: {
          users: {
            userId: user._id,
            role: collabData.role,
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
      .to(doc.inviterId)
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
      throw new ApiError(400, "Token Expired or Invalid");
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

export const mountPendingNotification = async (socket) => {
  const payload = await getPendingNotification(socket.user.email);

  const userNotifications = payload.filter((i)=>{
     return  i.inviterEmail === socket.user.email
  })

  console.log("userNotifications", userNotifications)

  if (payload?.length >= 0) {
    console.log("userNotifications", userNotifications)
    socket.emit(NOTIFICATION_EVENT.NOTIFICATION_RECIVED, userNotifications)
  }

};
