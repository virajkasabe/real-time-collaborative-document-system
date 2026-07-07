import User from "../module/auth/auth.model.js";
import Doc from "../module/document/document.model.js";
import { getDocument, getUser, setDocument, setUser } from "../redis/client.js";
import ApiError from "./ApiError.js";

export const secureUser = async (userId) => {
  let user = null;
<<<<<<< HEAD
  user = await getUser(userId)
=======
  user = await getUser(userId.toString())
>>>>>>> wind-breathing
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
<<<<<<< HEAD
  let document = null;
  document = await getDocument(docId);
  if (!document) {
    document = await Doc.findById(docId);
    if (document) {
      await setDocument(docId, document);
    }
=======
  const DOCID = docId.toString()
  let document = null;
  document = await getDocument(DOCID);
  if (!document) {
    document = await Doc.findById(DOCID);
      await setDocument(DOCID, document);
>>>>>>> wind-breathing
  }
  if(!document) {
    throw new ApiError(400, "Document not exists")
  }
<<<<<<< HEAD

=======
>>>>>>> wind-breathing
  return document;
};

export const otpGenerator = () => {
<<<<<<< HEAD
  return Math.floor(100000 + Math.random() * 900000).toString();
=======
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
>>>>>>> wind-breathing
};

export const requiredField = (required = []) => {
  if (required.some((field) => field.trim() === "" || field === undefined)) {
    throw new ApiError(400, "all field are required");
  }
};
<<<<<<< HEAD
=======

export const htmlToTextConvertor = (htmlString) => {
  return htmlString.replace(/<[^>]+>/g, "")
}

export const textToHtmlConvertor = (textString) => {
  let content = textString.text || "";
  const attr = textString.attributes || {};

  if (attr.bold) content = `<strong>${content}</strong>`;
  if (attr.italic) content = `<em>${content}</em>`;
  if (attr.underline) content = `<u>${content}</u>`;

  switch (attr.size) {
    case "huge":
      content = `<h1>${content}</h1>`;
      break;

    case "large":
      content = `<h2>${content}</h2>`;
      break;

    case "normal":
      content = `<p>${content}</p>`;
      break;

    case "small":
      content = `<small>${content}</small>`;
      break;

    default:
      content = `<p>${content}</p>`;
  }
  
  return content;
};
>>>>>>> wind-breathing
