import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { fetchDoc } from "../utils/helper.js";
import { verifyJWT } from "./auth.middleware.js";

export const verifyDocumentMember = asyncHandler(async (req, res, next) => {
  const { docId } = req.body || req.params || req.data;
  let user = req.user;

  const doc = await fetchDoc(docId);

  // check documents of this document user exist or not
});

export const verifyDocumentOwner = asyncHandler(async (req,_,next) => {

  const { docId } =  req.params || req.body

  console.log("req.body", req.body)
  console.log("req.params", req.params)

  if (!docId) {
    throw new ApiError(400, "docId is required");
  }

  if (!req.user) {
    verifyJWT();
  }

  const user = req.user;

  if(!user) {
    throw new ApiError(401, "user can't login")
  }

  console.log(
    user
  )

  const document = await fetchDoc(docId)
  console.log("docuemt", document)

  if(document.ownerId.toString() !== user._id.toString()) {
    throw new ApiError(401, "Your not Authenticated")
  }

  next()
});
