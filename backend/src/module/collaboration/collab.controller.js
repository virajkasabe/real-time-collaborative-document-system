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
import {
  joinCollab,
  registerAndJoinCollab,
} from "../../services/sendCollabLink.service.js";
import { emitSocketEvent } from "../../socket/socket.js";
import {
  COLLABORATION_EVENT,
  NOTIFICATION_EVENT,
} from "../../socket/socketEvents.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { DOCUMENT_ROLES } from "../../utils/constant.js";
import { fetchDoc, secureUser } from "../../utils/helper.js";
import User from "../auth/auth.model.js";
import Doc from "../document/document.model.js";

export const sendCollaboration = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { docId } = req.params;
  const io = req.app.get("io");

  const isDocumentExist = await fetchDoc(docId)
  if(!isDocumentExist){
    // TODO : THROW THE SOCKER ERROR AS WELL AS API ERROR
    throw new ApiError(401, "YOUR NOT AUTHORIZED FOR THIS ACTION");
  }


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

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          regiterFirst : registerationLink,
          acceptCollab: acceptCollabLink,
          declineCollab: declineCollabLink
        },
        "user not register invite link send via email"
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
    throw new ApiError(409, `User with email '${accepter.email}' already exists.`);
    return res.status(409).json(new ApiResponse(409, {}, `User with email '${accepter.email}' already exists.`))
  }

  if (isOnline) {
    notificationData.expiry = new Date(Date.now() +  20 * 60 * 1000).toLocaleString()
    await setrealtimeNotification(email, notificationData);
    await setCollaboration(collabId, collabData, registeredUserExpiry);
    io.to(userId).emit(NOTIFICATION_EVENT.RECIVED_REAL_TIME_NOTIFICATION, notificationData);
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
 
 
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          login : loginLink,
           acceptCollab: acceptCollabLink,
            declineCollab: declineCollabLink,
          sentVia: ["email", "redis"] },
        "User offline. Saved to Redis + email sent"
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

  if (sockets.length > 0) {
    emitSocketEvent(
      req,
      inviter._id.toString(),
      COLLABORATION_EVENT.ACCEPT_COLLABORATION,
      {
        accepterName: user.fullName,
        accepterEmail: user.email,
        documentTitle: doc.title,
      }
    );
  }

  await setPendingNotification(inviter.email, {
    type: "COLLAB_ACCEPTED",
    accepterName: user.fullName,
    accepterEmail: user.email,
    documentTitle: doc.title,
    inviterEmail: inviter.email,
    createdAt:  Date.now()
  });

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

  if (sockets.length > 0) {
    emitSocketEvent(
      req,
      inviter._id.toString(),
      COLLABORATION_EVENT.DECLINE_COLLABORATION,
      {
        documentTitle: doc.title,
      }
    );
  }

  await setPendingNotification(inviter.email, {
    type: "COLLAB_DECLINED",
    documentTitle: doc.title,
    inviterEmail: inviter.email,
    createdAt: new Date.now().toLocaleString(),
  });

  await deleteCollaboration(hashedTokenID);

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Collaboration request declined successfully"
    )
  );
});
