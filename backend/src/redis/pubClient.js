<<<<<<< HEAD
import { CURSOR_EVENT } from "../socket/socketEvents.js";
import { Publisher } from "./client.js";

const pubClient = async(docId, payload,io) => {
    const reciver = await Publisher.publish(
        io.to(docId).emit(CURSOR_EVENT.CURSOR_UPDATE, payload)
    , JSON.stringify(payload))
    return reciver;
}

export default pubClient;
=======
import { Publisher } from "./client.js";

export const pubClient = async(docId, payload) => {
    const reciver = await Publisher.publish(docId, JSON.stringify(payload))
    return reciver;
}


>>>>>>> 4e9ac5c (feat(auth): implement user model with password hashing, token generation, and email verification features)
