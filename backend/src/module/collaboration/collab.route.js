import { Router } from "express"
import { sendCollaboration } from "./collab.controller.js"
import { verifyJWT } from "../../middleware/auth.middleware.js"

const router = Router()

router.route("/send-collab/:docId").post(verifyJWT, sendCollaboration)

// router.route("/accept/:email/:join").post(verifyJWT, acceptCollaboration)

// router.route("/decline/:email/:join").get(declineJoinCollaboration)

export default router;
