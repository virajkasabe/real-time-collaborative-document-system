import Doc from "../module/document/document.model.js";
import {
  deleteCollaboration,
  deleteNotification,
  getCollaboration,
  setDocument,
} from "../redis/client.js";
import ApiError from "../utils/ApiError.js";
import { fetchDoc, secureUser } from "../utils/helper.js";
import {
  COLLABORATION_ERROR_EVENT,
  COLLABORATION_EVENT,
  INVITATION_EVENT,
  NOTIFICATION_EVENT,
  SOCKET_EVENT,
} from "./socketEvents.js";
import { v4 as uuidv4 } from 'uuid';

export const acceptCollab = async(io,socket,data) => {
    console.log("data.acceptNotif", data)
    const { collabId } = data
    console.log("data",data)

    const collabData = await getCollaboration(collabId);
    const user = await secureUser(socket.user._id)
    console.log("user", user)
    if (!collabData) {
      socket
      .to(user._id)
      .emit(COLLABORATION_ERROR_EVENT.ERROR_ACCEPT_COLLABORATION, {
        message : "Token Expirted or used"
      });
    }

    const { docId, role ,senderId} = collabData

    const sender = await secureUser(senderId)

    const doc = await fetchDoc(docId);

    const userAlreadyExists = doc.users.some(
      (collaborator) =>
        collaborator.userId.toString() === user._id.toString()
    );

    if (userAlreadyExists) {
      await deleteCollaboration(collabId);
      socket
      .to(user._id)
      .emit(COLLABORATION_ERROR_EVENT.ERROR_ACCEPT_COLLABORATION, {
        message : "User Already exist"
      });
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
      id : uuidv4(),
      type: "COLLAB_ACCEPTED",
      accepterName: socket.user.fullName,
      documentId: doc._id,
      documentName: doc.title,
      message: `${socket.user.fullName} accepted your collaboration on "${doc.title}"`,
      time: new Date().toISOString(),
    };

    await deleteNotification(socket.user.email, data)  
    await deleteCollaboration(collabId)
    await setDocument(updateDocument._id, updateDocument);

    io
      .to(sender._id)
      .emit(COLLABORATION_EVENT.ACCEPT_COLLABORATION, acceptCollabData);
}


export const declineCollab = async(io,socket,data) => {
    const user = await secureUser(socket.user._id);
    const { collabId, senderId} = data
    const collabData = await getCollaboration(collabId);
    const inviter = await secureUser(senderId)

    
    if (!collabData) {
      io
      .to(user._id)
      .emit(COLLABORATION_ERROR_EVENT.ERROR_DECLINE_COLLABORATION, {
           notificationId: uuidv4(),
           message : "Token Expirted or used",
           type : "error"
          });
        }
      

      if(collabData) {
          const doc = await fetchDoc(collabData.docId);

       
       const declineCollabData = {
         id : uuidv4(), 
         type: "COLLAB_DECLINED",
         declineUserName: socket.user.fullName,
         documentId: doc._id,
         documentName: doc.title,
         message: `${socket.user.fullName} decline your collaboration on "${doc.title}"`,
         time: new Date().toISOString(),
       }; 

          
        await deleteCollaboration(collabId)
        console.log("data",data)
        await deleteNotification(user.email, data)

        console.log("inviter._id",inviter._id)

        io.to(inviter._id).emit(COLLABORATION_EVENT.DECLINE_COLLABORATION, declineCollabData);
    }
}


