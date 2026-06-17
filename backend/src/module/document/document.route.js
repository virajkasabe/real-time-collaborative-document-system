import Router from 'express'
import { verifyJWT } from '../../middleware/auth.middleware.js';
import { 
    createDocument, 
    deleteDoc, 
    docMoveToTrash, 
    fetchDocument, 
    fetchDocumentFolder 
} from './document.controller.js';

const router = Router()

router.use(verifyJWT)

router.route("/create-doc").post(createDocument)

router.route("/fetch-doc/:docId").get(fetchDocument)

router.route("/fetch-folder").get(fetchDocumentFolder)

router.route("/move-trash/:docId").delete(docMoveToTrash)

router.route("/delete/:docId").delete(deleteDoc)


export default router;
