import {
  getUpdateDocumentOperation,
  setUpdateDocumentOperation,
} from "../redis/client.js";
import ApiError from "../utils/ApiError.js";
import { fetchDoc } from "../utils/helper.js";
import { DOCUMENT_EVENT } from "./socketEvents.js";

export const mountDocumetSetChangeEvent = (socket) => {
  socket.on(DOCUMENT_EVENT.CHANGE_DOCUMENT, async (message) => {
    const { docId, delta } = message;
    //  TODO : FOR TESTING USE MESSAGE BUT WHEN ENTER ON PRODUCTION THE USE DATA OR PAYLOAD
    /*
    ?? data WILL GET ON INSTED OF MESSAGE IN PARAM
      const { docId, delta } = data
  */

    // INTEGRETE OT HERE ( operational transformation )

    console.log("message", message);
    if (!docId) {
      throw new ApiError(400, "Doc Id is required");
    }
    const document = await fetchDoc(docId);
    await setUpdateDocumentOperation(docId, delta);
    console.log("Document setup successfully");
  });
};

export const mountDocumetGetChangeEvent = (socket) => {
  socket.on(DOCUMENT_EVENT.VIEW_DOCUMENT, async ({ docId }) => {
    if (!docId) {
      throw new ApiError(400, "Doc Id is required");
    }
    // console.log("document", document)
    const doc = await getUpdateDocumentOperation(docId);
    console.log("doc", doc);
    return doc;
  });
};
