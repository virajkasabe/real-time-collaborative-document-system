import { verifyDocumentMember } from "../../middleware/document.middleware.js"
import { appendChats, getChats } from "../../redis/client.js"
import { CHATS_EVENT } from "../../socket/socketEvents.js"
import ApiResponse from "../../utils/ApiResponse.js"
import asyncHandler from "../../utils/asyncHandler.js"


export const sendMessage = asyncHandler(async(req,res)=>{
    const { docId, data } = req.body
    const user = req.user
    await verifyDocumentMember(docId, user)
    await appendChats(docId, data)

    const payload = await getChats(docId)

    emitSocketEvent(
        req,
        docId,
        CHATS_EVENT.RECIVED_CHAT,
        payload
    )

   return res.status(200).json(new ApiResponse(200, {} ,"message send"))
})


export const getMessage = asyncHandler(async(req,res)=>{
    
     const { docId } = req.params || req.body
    const user = req.user
    await verifyDocumentMember(docId, user)

    const chatData = await getChats(docId)

    return res.status(200).json(new ApiResponse(200, { chats : chatData } ,"messages fetch successfully"))
})