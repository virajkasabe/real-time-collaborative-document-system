import { Router } from 'express';
import { verifyJWT } from '../../middleware/auth.middleware.js';
import { getMessage, sendMessage } from './chat.controller.js';

const router = Router();

router.use(verifyJWT)

router.route("/chats").post(sendMessage)

router.route("/:docId").get(getMessage)


export default router;