import User from "../module/auth/auth.model.js";
import Doc from "../module/document/document.model.js";
import { getDocument, setDocument } from "../redis/client.js";
import { doc } from "../TESTING_FOLDER/document.js";
import ApiError from "./ApiError.js";

export const secureUser = async (userId) => {
  return await User.findById(userId).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );
};

export const fetchDoc = async (docId) => {
  let document = null;
  /*

  TODO : THIS COMMENT FOR PRODUCTION BUT IN TESTING MODE

  document = await getDocument(docId);
  if (!document) {
    document = await Doc.findById(docId);
    if (document) {
      await setDocument(docId, document);
    }
  }

    */

  // TODO : THIS IS FOR TESTING MODE
  document = await getDocument(docId);
  if (!document) {
    // document = await Doc.findById(docId);
    // if (document) {
      await setDocument(docId, doc);
    // }
  }
  return document;
};

export const otpGenerator = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
};

export const requiredField = (required = []) => {
  if (required.some((field) => field.trim() === "" || field === undefined)) {
    throw new ApiError(400, "all field are required");
  }
};
