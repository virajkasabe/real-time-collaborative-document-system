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
  const isOwner = await verifyDocumentAdmin(docId, req.user);
  if (isOwner !== DOCUMENT_ROLES.OWNER) {
    throw new ApiError(401, "YOUR NOT AUTHORIZED FOR THIS ACTION");
  }

  const unHashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");
  const collabExpiry = 15 * 60;
  const acceptCollabLink = `${ENV.BACKEND_URI}/collab/accept/email=${email}/join=${unHashedToken}`;
  const declineCollabLink = `${ENV.BACKEND_URI}/collab/decline/email=${email}/join=${unHashedToken}`;
  const registerationLink = `${ENV.CLIENT_URL}/register`;
  const loginLink = `${ENV.CLIENT_URL}/login`;

  const inviter = await secureUser(req.user._id);
  const document = await fetchDoc(docId);

  const payload = {
    docId,
    email,
    role,
    token: unHashedToken,
    inviterId: inviter._id.toString(),
    inviterName: inviter.fullName,
    docTitle: document.title,
  };

  const user = await User.findOne({ email });
  await setCollaboration(hashedToken, payload, collabExpiry);

  if (!user) {
    // Deferred/Delayed Notification or Pre-Registreation Invite Queue
    const pendingNotificationData = {
      title: `invitation for collaboration in ${document.title}`,
      inviter: inviter.fullName,
      tokenId: hashedToken,
      time: Date.now().toLocaleString(),
    };

    await setPendingNotification(email, pendingNotificationData);

    /*
    TODO : SERVICE FOR REGISTER AND JOIN COLLAB
    */
    await registerAndJoinCollab(
      document.title,
      inviter.fullName,
      acceptCollabLink,
      declineCollabLink,
      email,
      inviter.email,
      null,
      registerationLink
    );
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
  // TODO : IF USER REGISTER

  const userId = user._id.toString();
  const socketsInRoom = await io.in(userId).fetchSockets();
  const isOnline = socketsInRoom.length > 0;
  // console.log("isOnline", isOnline);

  if (isOnline) {
    await setrealtimeNotification(unHashedToken, payload);
    io.to(userId).emit(NOTIFICATION_EVENT.SEND_REAL_TIME_NOTIFICATION, payload);
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

  const pendingNotificationData = {
    title: `Invitation for collaboration in ${document.title}`,
    inviter: inviter.fullName,
    tokenId: hashedToken,
    time: new Date(Date.now()).toLocaleString(),
    expiry: new Date(Date.now() + 20 * 60 * 1000).toLocaleString(),
  };

  /*
  await joinCollab(
    document.title,
    inviter.fullName,
    acceptCollabLink,
    declineCollabLink,
    email,
    inviter.email,
    loginLink
  );
*/
  await setPendingNotification(email, pendingNotificationData);
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
    createdAt: new Date.now().toLocaleString()
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
