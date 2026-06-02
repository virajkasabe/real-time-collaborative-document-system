import {
  getUpdateDocumentOperation,
  setUpdateDocumentOperation,
} from "../redis/client.js";
import ApiError from "../utils/ApiError.js";
import { fetchDoc } from "../utils/helper.js";
import { DOCUMENT_EVENT } from "./socketEvents.js";

export const mountDocumentSendOperation = (socket) => {
  socket.on(DOCUMENT_EVENT.SEND_OPERATION, async (data) => {
    // const { docId, delta } = message;
    //  TODO : FOR TESTING USE MESSAGE BUT WHEN ENTER ON PRODUCTION THE USE DATA OR PAYLOAD
    /*
    ?? data WILL GET ON INSTED OF MESSAGE IN PARAM

  */

    // INTEGRETE OT HERE ( operational transformation )

    console.log(data);
    const { docId, delta } = data.data;
    console.log("delta", delta);
    console.log("docId", docId);

    if (!docId) {
      throw new ApiError(400, "Doc Id is required");
    }
    const document = await fetchDoc(docId);
    await setUpdateDocumentOperation(docId, delta);
    console.log("Document setup successfully");
  });
};

export const mountDocumentReciveOperation = (socket) => {
  socket.on(DOCUMENT_EVENT.RECEIVE_OPERATION, async (data) => {
    console.log("data", data);

    const { docId } = data;

    if (!docId) {
      throw new ApiError(400, "Doc Id is required");
    }
    // console.log("document", document)
    const doc = await getUpdateDocumentOperation(docId);
    console.log("doc", doc);
    return doc;
  });
};
