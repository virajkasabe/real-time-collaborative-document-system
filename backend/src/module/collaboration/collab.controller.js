import crypto from "crypto";
import { ENV } from "../../config/ENV.js";
import {
  deleteCollaboration,
  getCollaboration,
  setCollaboration,
  setDocument,
} from "../../redis/client.js";
import { emitSocketEvent } from "../../socket/socket.js";
import { COLLABORATION_EVENT } from "../../socket/socketEvents.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { fetchDoc, secureUser } from "../../utils/helper.js";
import Doc from "../document/document.model.js";

const option = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
};

export const sendCollaboration = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { docId } = req.params;

  const collabData = {};

  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const collabExpiry = 15 * 60;

  const payload = {
    docId,
    email,
    role,
  };

  await setCollaboration(hashedToken, payload, collabExpiry);

  const collablink = `${ENV.BACKEND_URI}/collab/email=${email}/join=${unHashedToken}`;

  return res
    .status(201)
    .json(
      new ApiResponse(201, { collablink }, "collab link send successfully")
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

  const userAlreadyExits = doc.users.some((user) => {
    let users = user._id.toString() !== req.user._id.toString();
    return users;
  });

  if (userAlreadyExits) {
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
    collabData.docId,
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
  const emailAccept = upcommingEmail.replace("email=", "");
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
    doc.docId,
    COLLABORATION_EVENT.DECLINE_COLLABORATION,
    "Your collaboration request has been declined."
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "you declient the request of join collaboration")
    );
});
