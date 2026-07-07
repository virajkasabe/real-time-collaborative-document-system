import { Router } from "express"
<<<<<<< HEAD
import { acceptCollaboration, declineJoinCollaboration, sendCollaboration } from "./collab.controller.js"
=======
import { sendCollaboration } from "./collab.controller.js"
>>>>>>> wind-breathing
import { verifyJWT } from "../../middleware/auth.middleware.js"

const router = Router()

router.route("/send-collab/:docId").post(verifyJWT, sendCollaboration)

<<<<<<< HEAD
router.route("/accept/:email/:join").post(verifyJWT, acceptCollaboration)

router.route("/decline/:email/:join").get(declineJoinCollaboration)
=======
// router.route("/accept/:email/:join").post(verifyJWT, acceptCollaboration)

// router.route("/decline/:email/:join").get(declineJoinCollaboration)
>>>>>>> wind-breathing

export default router;
