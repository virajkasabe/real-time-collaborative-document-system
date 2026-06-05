import crypto from "crypto";
import { ENV } from "../../config/ENV.js";
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
} from "../../socket/socketEvents.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { fetchDoc, secureUser } from "../../utils/helper.js";
import User from "../auth/auth.model.js";
import Doc from "../document/document.model.js";

export const sendCollaboration = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { docId } = req.params;
  const io = req.app.get("io");

  const unHashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");
  const collabExpiry = 15 * 60;
  const collabLink = `${ENV.BACKEND_URI}/collab/email=${email}/join=${unHashedToken}`;

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
        await registerAndJoinCollab(collabLink)
    */
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { collabLink },
          "user not register invite link send via email"
        )
      );
  }
  // TODO : IF USER REGISTER

  const userId = user._id.toString();
  const socketsInRoom = await io.in(userId).fetchSockets();
  const isOnline = socketsInRoom.length > 0;
  console.log("isOnline", isOnline);

  if (isOnline) {
    await setrealtimeNotification(unHashedToken, payload);
    io.to(userId).emit(NOTIFICATION_EVENT.SEND_REAL_TIME_NOTIFICATION, payload);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { collabLink, sentVia: ["socket", "email", "redis"] },
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

  await setPendingNotification(email, pendingNotificationData);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { collabLink, sentVia: ["email", "redis"] },
        "User offline. Saved to Redis + email sent"
      )
    );
});

export const acceptCollaboration = asyncHandler(async (req, res) => {
  const { email: upcommingEmail, join } = req.params;
  const emailAccept = upcommingEmail.replace("email=", "");
  const collabToken = join.replace("join=", "");
  const user = await secureUser(req.user._id);
  const hashedTokenID = crypto
    .createHash("sha256")
    .update(collabToken)
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
    (collaborator) => collaborator.userId.toString() === req.user._id.toString()
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

  emitSocketEvent(
    req,
    collabData.inviterId,
    COLLABORATION_EVENT.ACCEPT_COLLABORATION,
    "Your invitation to collaborate has been accepted."
  );
  await deleteCollaboration(hashedTokenID);
  await setDocument(updateDocument._id, updateDocument);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "user add on collaboration successfully"));
});

export const declineJoinCollaboration = asyncHandler(async (req, res) => {
  const { email: upcommingEmail, join } = req.params;
  // const emailAccept = upcommingEmail.replace("email=", "");
  const collabToken = join.replace("join=", "");

  const hashedTokenID = crypto
    .createHash("sha256")
    .update(collabToken)
    .digest("hex");

  const collabData = await getCollaboration(hashedTokenID);
  if (!collabData) {
    throw new ApiError(400, "Token Expired or Invalid");
  }

  const doc = await fetchDoc(collabData.docId);
  await deleteCollaboration(hashedTokenID);

  emitSocketEvent(
    req,
    doc.inviterId,
    COLLABORATION_EVENT.DECLINE_COLLABORATION,
    "Your collaboration request has been declined."
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "you declient the request of join collaboration")
    );
});
