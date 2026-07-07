<<<<<<< HEAD
import crypto from "crypto";
import { ENV } from "../../config/ENV.js";
import { verifyDocumentAdmin } from "../../middleware/document.middleware.js";
import {
  deleteCollaboration,
  getCollaboration,
  setCollaboration,
  setDocument,
  setPendingNotification,
  setrealtimeNotification,
} from "../../redis/client.js";
import { emitSocketEvent } from "../../socket/socket.js";
import {
  COLLABORATION_EVENT,
  NOTIFICATION_EVENT,
=======
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
>>>>>>> wind-breathing
} from "../../socket/socketEvents.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { DOCUMENT_ROLES } from "../../utils/constant.js";
import { fetchDoc, secureUser } from "../../utils/helper.js";
import User from "../auth/auth.model.js";
import Doc from "../document/document.model.js";
<<<<<<< HEAD

export const sendCollaboration = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { docId } = req.params;
  const io = req.app.get("io");
  const isOwner = await verifyDocumentAdmin(docId, req.user);
  if (isOwner !== DOCUMENT_ROLES.OWNER) {
    throw new ApiError(401, "YOUR NOT AUTHORIZED FOR THIS ACTION");
  }

  const collabId = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(collabId)
    .digest("hex");
  const registeredUserExpiry = 15 * 60;
  const inviteUserExpiry = 7 * 24 *  15 * 60;

  const acceptCollabLink = `${ENV.CLIENT_URL}/collab/accept/email=${email}/join=${collabId}`;
  const declineCollabLink = `${ENV.CLIENT_URL}/collab/decline/email=${email}/join=${collabId}`;
  const registerationLink = `${ENV.CLIENT_URL}/register`;
  const loginLink = `${ENV.CLIENT_URL}/login`;

  const inviter = await secureUser(req.user._id);
  const accepter = await User.findOne({ email });
  const document = await fetchDoc(docId);

  const collabData = {
    docId,
    email,
    role,

    inviterId : inviter._id
  }

  const notificationData = {
    type :"COLLAB_INVITED",
    docname : document.title,
    inviterName : inviter.fullName,
    inviterEmail : email,
    collabId : collabId,
  }



  if (!accepter) {
        notificationData.expiry = new Date(Date.now() + 7 * 24 * 20 * 60 * 1000).toLocaleString()

    await setPendingNotification(email, notificationData, inviteUserExpiry);
    await setCollaboration(collabId, collabData, inviteUserExpiry);

    /* 
    TODO : SERVICE FOR REGISTER AND JOIN COLLAB
    // await registerAndJoinCollab(
      //   document.title,
      //   inviter.fullName,
      //   acceptCollabLink,
      //   declineCollabLink,
      //   email,
      //   inviter.email,
      //   null,
      //   registerationLink
      // );
    */

    token: unHashedToken,
    inviterId: inviter._id.toString(),
    inviterName: inviter.fullName,
    docTitle: document.title,
  };

  const user = await User.findOne({ email });
  await setCollaboration(hashedToken, payload, collabExpiry);

  if (!user) {
    // Deferred/Delayed Notification or Pre-Registration Invite Queue
    const notificationData = {
      type: "COLLAB_INVITE",
      title: `Invitation for collaboration in ${document.title}`,
      docId,
      tokenId: unHashedToken,
      documentTitle: document.title,
      inviterName: inviter.fullName,
      inviterEmail: inviter.email,
      accepterEmail: email,
      createdAt: Date.now(),
      expiry: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      ).toLocaleString()
    };

    await setPendingNotification(email, notificationData);


    return res.status(200).json(
      new ApiResponse(
        200,
        {
          regiterFirst : registerationLink,
          acceptCollab: acceptCollabLink,
          declineCollab: declineCollabLink
        },
        "user not registered, invitation notification queued"
      )
    );
  }

  
  // TODO : IF USER ONLINE
  const userId = accepter._id.toString();
  const socketsInRoom = await io.in(userId).fetchSockets();
  const isOnline = socketsInRoom.length > 0;

  const userAlreadyExists = document.users.some(
    (collaborator) => document.ownerId.toString() === userId  || collaborator.userId.toString() === userId 
  );

  if (userAlreadyExists ) {
    throw new ApiError(401, "User Already exist");
  }

  if (isOnline) {

    notificationData.expiry = new Date(Date.now() +  20 * 60 * 1000).toLocaleString()

    await setrealtimeNotification(email, notificationData);
    await setCollaboration(collabId, collabData, registeredUserExpiry);
    io.to(userId).emit(NOTIFICATION_EVENT.RECIVED_REAL_TIME_NOTIFICATION, notificationData);


  const userId = user._id.toString();
  const socketsInRoom = await io.in(userId).fetchSockets();
  const isOnline = socketsInRoom.length > 0;

  const notificationData = {
    type: "COLLAB_INVITE",
    title: `Invitation for collaboration in ${document.title}`,
    docId,
    tokenId: unHashedToken,
    documentTitle: document.title,
    inviterName: inviter.fullName,
    inviterEmail: inviter.email,
    accepterEmail: user.email,
    createdAt: Date.now(),
    expiry: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    ).toLocaleString()
  };

  if (isOnline) {
    await setrealtimeNotification(unHashedToken, payload);
    io.to(userId).emit(
      NOTIFICATION_EVENT.NOTIFICATION_RECEIVED,
      notificationData
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            acceptCollab: acceptCollabLink,
            declineCollab: declineCollabLink,
            sentVia: ["socket", "email", "redis"],
          },
          "User online. Sent via socket + email"
        )
      );
  }


  notificationData.expiry = new Date(Date.now() +  20 * 60 * 1000).toLocaleString()

   await setPendingNotification(email, notificationData);
   await setCollaboration(collabId, collabData, registeredUserExpiry)
  /*
      TODO : SERVICE FOR LOGIN AND JOIN COLLAB
      // await joinCollab(
      //   document.title,
      //   inviter.fullName,
      //   acceptCollabLink,
      //   declineCollabLink,
      //   email,
      //   inviter.email,
      //   loginLink
      // );
  */
 
 

  await setPendingNotification(email, notificationData);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          login : loginLink,
          acceptCollab: acceptCollabLink,
          declineCollab: declineCollabLink,
          sentVia: ["redis"]
        },
        "User offline. Saved to Redis"
      )
    );
});

export const acceptCollaboration = asyncHandler(async (req, res) => {
  const { join } = req.params;
  const io = req.app.get("io");

  const collabToken = join.replace("join=", "");

  const hashedTokenID = crypto
    .createHash("sha256")
    .update(collabToken)
    .digest("hex");

  const collabData = await getCollaboration(hashedTokenID);

  if (!collabData) {
    throw new ApiError(400, "Token expired or invalid");
  }

  const user = await secureUser(req.user._id);
  const inviter = await secureUser(collabData.inviterId);
  const doc = await fetchDoc(collabData.docId);

  if (doc.ownerId.toString() === user._id.toString()) {
    throw new ApiError(400, "Owner cannot join as collaborator");
  }

  const alreadyExists = doc.users.some(
    (u) => u.userId.toString() === user._id.toString()
  );

  if (alreadyExists) {
    await deleteCollaboration(hashedTokenID);
    throw new ApiError(409, "User already exists");
  }

  const updatedDoc = await Doc.findByIdAndUpdate(
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

  const sockets = await io.in(inviter._id.toString()).fetchSockets();

  const acceptNotificationData = {
    type: "INVITE_ACCEPTED",
    title: `${user.fullName} accepted your invitation to collaborate on ${doc.title}`,
    docId: collabData.docId,
    documentTitle: doc.title,
    inviterName: inviter.fullName,
    inviterEmail: inviter.email,
    accepterName: user.fullName,
    accepterEmail: user.email,
    createdAt: Date.now()
  };

  if (sockets.length > 0) {
    io.to(inviter._id.toString()).emit(
      NOTIFICATION_EVENT.NOTIFICATION_RECEIVED,
      acceptNotificationData
    );
  }

  await setPendingNotification(inviter.email, acceptNotificationData);

  await deleteCollaboration(hashedTokenID);
  await setDocument(updatedDoc._id.toString(), updatedDoc);

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedDoc,
      "Collaboration accepted successfully"
    )
  );
});

export const declineJoinCollaboration = asyncHandler(async (req, res) => {
  const { join } = req.params;
  const io = req.app.get("io");

  const collabToken = join.replace("join=", "");

  const hashedTokenID = crypto
    .createHash("sha256")
    .update(collabToken)
    .digest("hex");

  const collabData = await getCollaboration(hashedTokenID);

  if (!collabData) {
    throw new ApiError(400, "Token expired or invalid");
  }

  const inviter = await secureUser(collabData.inviterId);
  const doc = await fetchDoc(collabData.docId);

  const sockets = await io.in(inviter._id.toString()).fetchSockets();

  const declineNotificationData = {
    type: "INVITE_REJECTED",
    title: `${req.user?.fullName || 'Someone'} declined your invitation to collaborate on ${doc.title}`,
    docId: collabData.docId,
    documentTitle: doc.title,
    inviterName: inviter.fullName,
    inviterEmail: inviter.email,
    accepterEmail: req.user?.email || collabData.email,
    createdAt: Date.now()
  };

  if (sockets.length > 0) {
    io.to(inviter._id.toString()).emit(
      NOTIFICATION_EVENT.NOTIFICATION_RECEIVED,
      declineNotificationData
    );
  }

  await setPendingNotification(inviter.email, declineNotificationData);

  await deleteCollaboration(hashedTokenID);

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Collaboration request declined successfully"
    )
  );
});
=======
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
>>>>>>> wind-breathing
