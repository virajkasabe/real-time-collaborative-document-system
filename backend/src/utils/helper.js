import User from "../module/auth/auth.model.js";
import Doc from "../module/document/document.model.js";
import { getDocument, getUser, setDocument, setUser } from "../redis/client.js";
import ApiError from "./ApiError.js";

export const secureUser = async (userId) => {
  let user = null;
  user = await getUser(userId)
  if(!user) {
       user = await User.findById(userId).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
      );
      if(user) {
            await setUser(userId, user)
      }
  }
  return user;
};

export const fetchDoc = async (docId) => {
  let document = null;
  document = await getDocument(docId);
  if (!document) {
    document = await Doc.findById(docId);
    if (document) {
      await setDocument(docId, document);
    }
  }
  if(!document) {
    throw new ApiError(400, "Document not exists")
  }

  return document;
};

export const otpGenerator = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const requiredField = (required = []) => {
  if (required.some((field) => field.trim() === "" || field === undefined)) {
    throw new ApiError(400, "all field are required");
  }
};
