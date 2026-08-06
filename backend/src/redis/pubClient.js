import { CURSOR_EVENT } from "../socket/socketEvents.js";
import { Publisher } from "./client.js";

const pubClient = async (docId, payload, io) => {
  if (io && typeof io.to === 'function') {
    io.to(docId).emit(CURSOR_EVENT.CURSOR_UPDATE, payload);
  }

  const receiver = await Publisher.publish(
    docId,
    JSON.stringify(payload)
  );

  return receiver;
};

export default pubClient;
