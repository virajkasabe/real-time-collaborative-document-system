import Redis from "ioredis";
import { ENV } from "../config/ENV.js";
import { redisEvent } from "../utils/constant.js";

const client = new Redis(ENV.REDIS_URI, { lazyConnect: true });
const Subscriber = new Redis(ENV.REDIS_URI,{ lazyConnect: true });
const Publisher = new Redis(ENV.REDIS_URI, { lazyConnect: true });
let isConnected = false;

export const RedisConnect = async () => {
  try {
    client.on(redisEvent.ERROR, (error) => {
      console.error(`REDIS CLIENT ERROR 📢 : ${error.message}`);
    });

    Subscriber.on(redisEvent.ERROR, (error) => {
      console.error(`REDIS SUB CLIENT ERROR 📢 : ${error.message}`);
    });

    Publisher.on(redisEvent.ERROR, (error) => {
      console.error(`REDIS PUB CLIENT ERROR 📢 : ${error.message}`);
    });

    await Promise.all([
      client.connect(),
      Publisher.connect(),
      Subscriber.connect(),
    ]);

     isConnected = true;

    return {
        client,
        isConnected
    }
  } catch (error) {
    console.error(error.message || "redies connection Error");
    isConnected = false;
  }
};

// ?? ===== USER =====
// ***** SET *****
export const setUser = (userId, payload, expiry=3600) => {
  if (!client) return null;
  const key = `user:${userId}`
  return await client.setex(key,expiry, JSON.stringify(payload))
};

// ***** GET *****
export const getUser = (userId) =>{
    const key = `user:${userId}`
    const payload = await client.get(key)
    return payload ? JSON.parse(payload) : null
}

// ! ***** DET *****
export const deleteuser = (userId) => {
  const key = `user:${userId}`
  return await client.del(key)
}


// ?? ===== DOCUMENT =====









export { Publisher, Subscriber };
