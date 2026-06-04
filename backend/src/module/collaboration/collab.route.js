import { Router } from "express"
import { acceptCollaboration, declineJoinCollaboration, sendCollaboration } from "./collab.controller.js"
import { verifyJWT } from "../../middleware/auth.middleware.js"
import { verifyDocumentOwner } from "../../middleware/document.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/send-collab/:docId").post(verifyDocumentOwner, sendCollaboration)

router.route("/accept/:email/:join").post(acceptCollaboration)

router.route("/decline/:email/:join").post(declineJoinCollaboration)

export default router;
