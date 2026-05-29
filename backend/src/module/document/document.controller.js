import { getDocument, setDocument } from "../../redis/client.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { fetchDoc } from "../../utils/helper.js";
import Doc from "./document.model.js";

export const createDocument = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const docData = {
    title: title,
    ownerId: req.user._id,
  };

  const createDoc = await Doc.create(docData);

  if (!createDoc) {
    throw new ApiError(500, "Something wen't wrong");
  }

  await setDocument(createDoc._id, createDoc);

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Document created successfully"));
});

export const fetchDocument = asyncHandler(async (req, res) => {
  const { docId } = req.params;

  if(!docId) {
    throw new ApiError(400, "Doc Id is required")
  }
  const document = await fetchDoc(docId)

  return res
    .status(200)
    .json(new ApiResponse(200, document, "Document Fetch Successfully"));
});
