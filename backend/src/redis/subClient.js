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
