import { Router } from "express"
import { sendCollaboration } from "./collab.controller.js"
import { verifyJWT } from "../../middleware/auth.middleware.js"

const router = Router()

router.route("/send-collab/:docId").post(verifyJWT, sendCollaboration)

export default router;
