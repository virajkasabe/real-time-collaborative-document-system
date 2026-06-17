import mongoose from "mongoose";
import { deleteDocumet, setDocument } from "../../redis/client.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { fetchDoc, requiredField } from "../../utils/helper.js";
import Doc from "./document.model.js";
import User from "../auth/auth.model.js";
import { getDocumentRole, verifyDocumentAdmin } from "../../middleware/document.middleware.js";

export const createDocument = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const docData = {
    title: title || "Untitle Document",
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
  const user = req.user

  if (!docId) {
    throw new ApiError(400, "Doc Id is required");
  }

  const docRole = await getDocumentRole(docId, user)

  if(!docRole) {
    throw new ApiError(401, "YOUR NOT PARTCIPANT OF THE DOCUMENT")
  }

  const document = await fetchDoc(docId);

  return res
    .status(200)
    .json(new ApiResponse(200, { document, role : docRole }, "Document Fetch Successfully"));
});

export const fetchDocumentFolder = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
    let documentFolder = null;
    let documentOtherUser = null;

  const documentOwner = await User.aggregate([
    {
      $match: {
            _id: new mongoose.Types.ObjectId(req.user._id)
      },
    },
    {
      $lookup: {
            from: "documents",
            localField: "_id",
            foreignField: "ownerId",
            as: "ownerDocs",
             pipeline : [
                {
                    $project : {
                        updatedAt : 0,
                        createdAt : 0,
                        isTrash : 0,
                        isPublic : 0,
                        ownerId : 0,
                        __v : 0,
                }
                }
            ]
        }
      },
  ]);

  if(documentOwner && documentOwner[0]?.ownerDocs?.length > 0) {
      documentFolder = documentOwner[0].ownerDocs
      documentOtherUser = documentFolder.map(i => i.users)
  }

  const usersDoc = await User.aggregate([
    {
      $match: {
            _id: new mongoose.Types.ObjectId(req.user._id)
      },
    },
    {
      $lookup: {
            from: "documents",
            localField: "_id",
            foreignField: "users.userId",
            as: "users",
            pipeline : [
                {
                    $project : {
                        updatedAt : 0,
                        createdAt : 0,
                        isTrash : 0,
                        isPublic : 0,
                        ownerId : 0,
                        __v : 0
                }
                }
            ]
        }
      },
  ]);

    if(usersDoc && usersDoc[0]?.users?.length > 0) {
      documentFolder = usersDoc[0].users
      // documentOtherUser = usersDoc[0].users.users
  }


  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          documentFolder,
          // documentOtherUser
         },
        "fetch your documents successfully"
      )
    );
});

export const docMoveToTrash = asyncHandler(async(req,res)=>{
  
  const { docId } = req.params

  verifyDocumentAdmin(docId, req.user)

  requiredField([docId])


  const document = await Doc.findByIdAndUpdate( docId, {
    $set : {
      isTrash : true
    }
  }, { new : true } )

  await deleteDocumet(docId)

  return res.status(204).json(new ApiResponse(204, {} , "your document move to trash successfully"))
})

export const deleteDoc = asyncHandler(async(req,res)=>{

  const { docId } = req.params

  verifyDocumentAdmin(docId, req.user)

  requiredField([docId])


  await Doc.findByIdAndDelete( docId, {
    $set : {
      isTrash : true
    }
  }, { new : true } )

  await deleteDocumet(docId)


  return res.status(204).json(new ApiResponse(204, {} , "your document deleted successfully"))
})