import { ENV } from "../../config/ENV.js";
import { verifyDocumentAdmin } from "../../middleware/document.middleware.js";
import { setCollaboration, setNotification } from "../../redis/client.js";
import {
  joinCollab,
  registerAndJoinCollab,
} from "../../services/sendCollabLink.service.js";
import { emitSocketEvent } from "../../socket/socket.js";
import {
  COLLABORATION_ERROR_EVENT,
  COLLABORATION_EVENT,
  NOTIFICATION_EVENT,
  SEND_COLLABORATION_ERROR_EVENT,
} from "../../socket/socketEvents.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { DOCUMENT_ROLES } from "../../utils/constant.js";
import { fetchDoc, secureUser } from "../../utils/helper.js";
import User from "../auth/auth.model.js";
import Doc from "../document/document.model.js";
import { v4 as uuidv4 } from 'uuid';


const onlineUser = async(io, realTimeNotificationData, collabData, email) => {
    realTimeNotificationData.expiry = new Date(Date.now() +  15 * 60 * 1000).toLocaleString()
    const notificationExpiry = 15 * 60;
    await setNotification(email,realTimeNotificationData,notificationExpiry)
    await setCollaboration(realTimeNotificationData.collabId, collabData, notificationExpiry)
}

const notregisteredUser = async(pendingNotification, collabData, email) => {
    pendingNotification.expiry = new Date(Date.now() +  7* 24 * 60 * 60 * 1000).toLocaleString()
    const inviteUserExpiry = 7 * 24 *  15 * 60;
    await setNotification(email, pendingNotification, inviteUserExpiry)
    await setCollaboration(pendingNotification.collabId, collabData, inviteUserExpiry)
}

const logoutUser = async(pendingNotification, collabData, email) => {
    pendingNotification.expiry = new Date(Date.now() +  20 * 60 * 1000).toLocaleString()
    const inviteUserExpiry = 20 * 60;
    await setNotification(email, pendingNotification, inviteUserExpiry)
    await setCollaboration(pendingNotification.collabId, collabData, inviteUserExpiry)
}

export const sendCollaboration = asyncHandler(async(req,res) => {
  const { docId } = req.params;
  const { email, role } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required.");
  }

  if (!role) {
    throw new ApiError(400, "Role is required.");
  }

 try {
     const io = req.app.get("io");
     const accepter = await User.findOne({email})
     const inviter = await secureUser(req.user._id)
     const collabId = uuidv4()
   
     const document = await fetchDoc(docId)
     if(!document) {
       emitSocketEvent(
          req,
          req.user._id.toString(),
          SEND_COLLABORATION_ERROR_EVENT.SEND_COLLAB_ERROR,
          {
              message : "Document Not exist"
          }
       )
       res.status(200).json(new ApiResponse(400, {}, "Document not found"))
     }
   
     const isOwner = await verifyDocumentAdmin(docId, req.user);
     if (isOwner !== DOCUMENT_ROLES.OWNER) {
       emitSocketEvent(
         req,
         req.user._id.toString(),
         SEND_COLLABORATION_ERROR_EVENT.SEND_COLLAB_ERROR,
         {
           message : "Authorization required"
         }
       );
       res.status(200).json(new ApiResponse(400, {}, "Authorization required"))
     }
   
     const collabData = {
        docId : docId,
        role : role,
        accepterEmail : email,
        senderId : req.user._id,
        senderName : inviter.fullName
      }

 

      const realTimeNotificationData = {
        type :"COLLAB_INVITED",
        collabId : collabId,
        accepterEmail : email,
        documentTitle : document.title,
        notificationId : `realTime:${collabId}:ID`,
        senderId : req.user._id,
        senderName : req.user.fullName
      }
      
       const pendingNotification = {
        type :"COLLAB_INVITED",
        collabId : collabId,
        accepterEmail : email,
        documentTitle : document.title,
        notificationId : `pending:${collabId}:ID`,
        senderId : req.user._id,
        senderName : req.user.fullName
       }
   
     if(!accepter) {
       await notregisteredUser(io, pendingNotification, collabData, email)
       return res.status(200).json(new ApiResponse(200, {}, "user not register then send invite link using the email"))
     }
   
      // const userId = user._id.toString();
      // const socketsInRoom = await io.in(userId).fetchSockets();
      // const isOnline = socketsInRoom.length > 0;
      // console.log("isOnline", isOnline);
      const socketsInRoom = await io.in(accepter._id.toString()).fetchSockets();
      const isOnline = socketsInRoom.length > 0;
   
     if(isOnline) {
       await onlineUser(io,realTimeNotificationData, collabData, email)
       emitSocketEvent(
          req,
          accepter._id.toString(),
          NOTIFICATION_EVENT.RECIVED_REAL_TIME_NOTIFICATION,
          realTimeNotificationData
      );
       return res.status(200).json(new ApiResponse(200, {}, "user online then send invite link using Notification"))
     }
   
     if(!isOnline) {
       await logoutUser(pendingNotification, collabData, email)
       return res.status(200).json(new ApiResponse(200, {}, "user offline send the link using email + pending notification"))
     }
   
 } catch (error) {
    emitSocketEvent(
      req,
      req.user._id.toString(),
      SEND_COLLABORATION_ERROR_EVENT.SEND_COLLAB_ERROR,
      {
        message : `ERROR : ${error?.message}`
      }
    );
 }
})
