import asyncHandler from "../utils/asyncHandler.js";
import { fetchDoc, secureUser } from "../utils/helper.js";
import { verifyJWT } from "./auth.middleware.js";

export const verifyDocumentMember = asyncHandler(async(req,res)=>{

    const { docId } = req.body || req.params || req.data
    let user = req.user

    const doc = await fetchDoc(docId)


    // check documents of this document user exist or not

})
