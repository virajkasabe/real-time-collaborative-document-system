import crypto from "crypto";
import { ENV } from "../../config/ENV.js";
import {
  getCollaboration,
  setCollaboration,
  setDocument,
} from "../../redis/client.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { fetchDoc, requiredField, secureUser } from "../../utils/helper.js";
import { generateAccessRefreshToken } from "../auth/auth.controller.js";
import User from "../auth/auth.model.js";
import Doc from "../document/document.model.js";

const addCollaboration = async (collabToken, userId) => {
  const hashedTokenID = crypto
    .createHash("sha256")
    .update(collabToken)
    .digest("hex");

  const collabData = await getCollaboration(hashedTokenID);
  if (!collabData) {
    throw new ApiError(400, "Token Expired or Invalid");
  }

  const updateDocument = await Doc.findByIdAndUpdate(
    collabData.docId,
    {
      $push: {
        users: [
          {
            userId: userId,
            role: collabData.role,
          },
        ],
      },
    },
    { new: true }
  );

  await setDocument(updateDocument._id, updateDocument);
};

export const sendCollaboration = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { docId } = req.params;

  const documet = await fetchDoc(docId);

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
  const { upcommingEmail: email, join } = req.params;
  const emailAccept = upcommingEmail.replace("email=", "");
  const collabToken = join.replace("join=", "");
  let user = null;

  try {
    user = req.user
    addCollaboration(collabToken, req.user._id)
    return res.status(200).json(new ApiResponse(200, {}, "user add on collaboration successfully"))
  } catch (error) {
      ApiError(400, error.message)
  }


  // TODO : WHEN USER FIND IN req.user
  // TODO : USER ARE LOGIN THEN JOIN ON COLLABORATION

  if (!req.user) {
    // TODO : WHEN USER NOT FIND IN req.user
    // TODO : THEN USER CHECK IN DATABASE AND LOGIN

    const { email, password } = req.body;
    requiredField([email, password]);


    if (email !== emailAccept) {
      throw new ApiError(401, "Please insert valid email");
    }

    user = await User.findOne({ email });

    const passwordValid = await user.isPasswordCorrect(password);
    if (!passwordValid) {
      throw new ApiError(403, "Please check credentials");
    }

      const { refreshToken, accessToken } = await generateAccessRefreshToken(
        user._id
      );
       await secureUser(user._id)
      addCollaboration(collabToken, user._id)

      return res
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .status(200)
        .json(
          new ApiResponse(
            200,
            {
              user: secureUser,
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
            "user login and add on document successfully"
          )
        );

    if (!user) {
      // TODO : WHEN USER NOT FIND IN DATABASE
      // TODO : REGISTER USER VIA EMAIL,PASSWORD
      // TODO : SEND ACCESSTOKEN,REFRESHTOKEN VIA COOKIES

      user = await User.create({
        email,
        password,
        isEmailVerified: true,
        fullName: email.slice(0, 7),
      });

      await secureUser(user._id);
      await addCollaboration(collabToken, user._id);

      const { refreshToken, accessToken } = await generateAccessRefreshToken(
        user._id
      );

      return res
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .status(200)
        .json(
          new ApiResponse(
            200,
            {
              user: secureUser,
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
            "user registe and add on document successfully"
          )
        );

    }
  }

});
