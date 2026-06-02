import Router from 'express'
import { verifyJWT } from '../../middleware/auth.middleware.js';
import { createDocument, fetchDocument } from './document.controller.js';

const router = Router()

router.use(verifyJWT)

router.route("/create-doc").post(createDocument)

router.route("/fetch-doc/:docId").get(fetchDocument)




export default router;
