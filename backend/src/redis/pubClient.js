import { CURSOR_EVENT } from "../socket/socketEvents.js";
import { Publisher } from "./client.js";

const pubClient = async(docId, payload,io) => {
    const reciver = await Publisher.publish(
        io.to(docId).emit(CURSOR_EVENT.CURSOR_UPDATE, payload)
    , JSON.stringify(payload))
    return reciver;
}

export default pubClient;