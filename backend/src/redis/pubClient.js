import { Publisher } from "./client.js";

export const pubClient = async(docId, payload) => {
    const reciver = await Publisher.publish(docId, JSON.stringify(payload))
    return reciver;
}


