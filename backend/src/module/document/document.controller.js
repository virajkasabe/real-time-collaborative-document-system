import mongoose from "mongoose";
import { deleteDocumet, getDocument, setDocument } from "../../redis/client.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { fetchDoc, requiredField } from "../../utils/helper.js";
import Doc from "./document.model.js";
import User from "../auth/auth.model.js";
import { getDocumentRole, verifyDocumentAdmin } from "../../middleware/document.middleware.js";

export const createDocument = asyncHandler(async (req, res) => {
 

  const docData = {
    title: "Untitle Document",
    ownerId: req.user._id,
  };

  if(req.body?.title) {
    docData.title = req.body.title
  }

  const createDoc = await Doc.create(docData);

  if (!createDoc) {
    throw new ApiError(500, "Something wen't wrong");
  }

  const doc = await fetchDoc(createDoc._id)

  return res
    .status(201)
    .json(new ApiResponse(201, { doc }, "Document created successfully"));
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
  const userId = req.user._id;

  const result = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId)
      },
    },
    {
      $lookup: {
        from: "documents",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ["$ownerId", "$$userId"] },
                  { $in: ["$$userId", "$users.userId"] }
                ]
              }
            }
          },
          {
            $addFields: {
              allUserIds: {
                $cond: {
                  if: { $isArray: "$users" },
                  then: "$users.userId",
                  else: []
                }
              }
            }
          },
          {
            $addFields: {
              allUserIds: {
                $concatArrays: [
                  "$allUserIds",
                  ["$ownerId"]
                ]
              }
            }
          },
          {
            $lookup: {
              from: "users",
              let: { userIds: "$allUserIds" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $in: ["$_id", "$$userIds"]
                    }
                  }
                },
                {
                  $project: {
                    _id: 1,
                    fullName: 1,
                    email: 1,
                    avatar: 1
                  }
                }
              ],
              as: "allUsers"
            }
          },
          {
            $addFields: {
              allUsersWithRoles: {
                $map: {
                  input: "$allUsers",
                  as: "user",
                  in: {
                    _id: "$$user._id",
                    fullName: "$$user.fullName",
                    email: "$$user.email",
                    avatar: "$$user.avatar",
                    role: {
                      $cond: [
                        { $eq: ["$$user._id", "$ownerId"] },
                        "Owner",
                        {
                          $let: {
                            vars: {
                              userDoc: {
                                $arrayElemAt: [
                                  {
                                    $filter: {
                                      input: "$users",
                                      as: "u",
                                      cond: { $eq: ["$$u.userId", "$$user._id"] }
                                    }
                                  },
                                  0
                                ]
                              }
                            },
                            in: "$$userDoc.role"
                          }
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          {
            $project: {
              _id: 1,
              title: 1,
              updatedAt : 1,
              allUsers: "$allUsersWithRoles"
            }
          }
        ],
        as: "documents"
      }
    },
    {
      $project: {
        documents: 1
      }
    }
  ]);

  const documentFolder = result[0]?.documents || [];

  
  documentFolder.map(async(d)=>{
    await fetchDoc(d._id)
  })

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          documentFolder
        },
        "Fetched your documents successfully"
      )
    );
});

export const shareWithMeDocuments = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json(new ApiResponse(401, null, "User not authenticated"));
  }

  const objectId = new mongoose.Types.ObjectId(userId);

  const shareWithMeDocs = await Doc.aggregate([
    {
      $match: {
        "users.userId": objectId,
        isTrash: false 
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner"
      }
    },
    {
      $addFields: {
        ownerDetails: {
          $arrayElemAt: ["$ownerDetails", 0]
        },
        me: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$users",
                as: "user",
                cond: { $eq: ["$$user.userId", objectId] }
              }
            },
            0
          ]
        },
        otherUsers: {
          $filter: {
            input: "$users",
            as: "user",
            cond: { 
              $and: [
                { $ne: ["$$user.userId", objectId] },
                { $ne: ["$$user.userId", "$ownerId"] }
              ]
            }
          }
        }
      }
    },
    {
      $project: {
        title: 1,
        ownerId: 1,
        isPublic: 1,
        isTrash: 1,
        version: 1,
        createdAt: 1,
        updatedAt: 1,
        owner: {
          _id: 1,
          fullName: 1,
          email: 1,
        },
        me: {
          userId: 1,
          role: 1,
          _id: 1
        },
        otherUsers: {
          userId: 1,
          role: 1,
          _id: 1
        }
      }
    },
    {
      $sort: { updatedAt: -1 }
    }
  ]);

   shareWithMeDocs.map(async(d)=>{
    await fetchDoc(d._id)
  })


  return res.status(200).json(
    new ApiResponse(
      200, 
      { 
        documents: shareWithMeDocs,
        count: shareWithMeDocs.length
      }, 
      "Shared documents fetched successfully"
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

export const restoreDoc = asyncHandler(async(req,res)=>{
  const { docId } = req.params

  verifyDocumentAdmin(docId, req.user)

  requiredField([docId])


  const document = await Doc.findByIdAndUpdate( docId, {
    $set : {
      isTrash : false
    }
  }, { new : true } )

  await setDocument(docId, document)

  return res.status(204).json(new ApiResponse(204, {} , "your document restore successfully"))
})