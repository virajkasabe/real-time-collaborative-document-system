<<<<<<< HEAD
import { CURSOR_EVENT } from "../socket/socketEvents.js";
import { Subscriber } from "./client.js";

// channel is a docId beacuse this is our room also
// and event where was you get it
// export const subClient = async (channel, event) => {
//   await Subscriber.subscribe(channel, (error) => {
//     if (error) {
//       console.error(`FAILD TO SUBSCRIBE : %S : ${error.message}`);
//       return;
//     }
//     console.log(`on ${channel} send Successfully`);
//   });

//   Subscriber.on(event, (channel, message) => {
//     return JSON.parse(message);
//   });
// };

export const subscribeToDocument = async (docId, io) => {
  await Subscriber.subscribe(docId, (message) => {
    const payload = JSON.parse(message);
    // console.log("message", payload)

    io.to(docId).emit(
      CURSOR_EVENT.CURSOR_UPDATE,
      payload
    );
  });
};
=======
import { Subscriber } from "./client.js";

  // channel is a docId beacuse this is our room also
  // and event where was you get it
  export const subClient = async (channel, event) => {
    await Subscriber.subscribe(channel, (error) => {
      if (error) {
        console.error(`FAILD TO SUBSCRIBE : %S : ${error.message}`);
        return;
      }
      console.log(`on ${channel} send Successfully`);
    });

    Subscriber.on(event, (channel, message)=>{
              return JSON.parse(message)
        })
  };
>>>>>>> 4e9ac5c (feat(auth): implement user model with password hashing, token generation, and email verification features)
