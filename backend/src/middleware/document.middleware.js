import ApiError from "../utils/ApiError.js";
import { DOCUMENT_ROLES } from "../utils/constant.js";
import { fetchDoc } from "../utils/helper.js";

export const getDocumentRole = async (docId, user) => {
  const currentUserId = user._id.toString();
  const document = await fetchDoc(docId);

  const isOwner =
    document.ownerId.toString() === currentUserId;

  if (isOwner) {
    return DOCUMENT_ROLES.OWNER;
  }

  const userInDoc = document.users.find(
    (u) => u.userId.toString() === currentUserId
  );

  if (!userInDoc) {
    throw new ApiError(
      403,
      "You are not a participant of this document"
    );
  }

  return userInDoc.role;
};

export const verifyDocumentMember = async (docId, user) => {
  return await getDocumentRole(docId, user);
};

export const verifyDocumentAdmin = async (docId, user) => {
  const role = await getDocumentRole(docId, user);

  if (role !== DOCUMENT_ROLES.OWNER) {
    throw new ApiError(
      403,
      "Only document owner can perform this action"
    );
  }

  return role;
};

export const verifyDocumentEditor = async (docId, user) => {
  const role = await getDocumentRole(docId, user);

  if (![DOCUMENT_ROLES.OWNER, DOCUMENT_ROLES.OWNER].includes(role)) {
    throw new ApiError(
      403,
      "Editor permission required"
    );
  }
  return role;
};
