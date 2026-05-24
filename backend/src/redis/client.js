import Redis from "ioredis";
import { ENV } from "../config/ENV.js";
import { redisEvent } from "../utils/constant.js";

const client = new Redis(ENV.REDIS_URI, { lazyConnect: true });
<<<<<<< HEAD
<<<<<<< HEAD
const Subscriber = new Redis(ENV.REDIS_URI, { lazyConnect: true });
=======
const Subscriber = new Redis(ENV.REDIS_URI,{ lazyConnect: true });
>>>>>>> 4e9ac5c (feat(auth): implement user model with password hashing, token generation, and email verification features)
=======
const Subscriber = new Redis(ENV.REDIS_URI, { lazyConnect: true });
>>>>>>> c2efc11 (feat(auth): implement user registration, login, and JWT verification with Redis caching)
const Publisher = new Redis(ENV.REDIS_URI, { lazyConnect: true });
let isConnected = false;

export const RedisConnect = async () => {
  try {
    client.on(redisEvent.ERROR, (error) => {
<<<<<<< HEAD
<<<<<<< HEAD
      console.error(`REDIS CLIENT ERROR 🚫🌐⚡ : ${error.message}`);
    });

    Subscriber.on(redisEvent.ERROR, (error) => {
      console.error(`REDIS SUB CLIENT ERROR‼️ : ${error.message}`);
    });

    Publisher.on(redisEvent.ERROR, (error) => {
      console.error(`REDIS PUB CLIENT ERROR 📵⚡: ${error.message}`);
=======
      console.error(`REDIS CLIENT ERROR 📢 : ${error.message}`);
=======
      console.error(`REDIS CLIENT ERROR 🚫🌐⚡ : ${error.message}`);
>>>>>>> c2efc11 (feat(auth): implement user registration, login, and JWT verification with Redis caching)
    });

    Subscriber.on(redisEvent.ERROR, (error) => {
      console.error(`REDIS SUB CLIENT ERROR‼️ : ${error.message}`);
    });

    Publisher.on(redisEvent.ERROR, (error) => {
<<<<<<< HEAD
      console.error(`REDIS PUB CLIENT ERROR 📢 : ${error.message}`);
>>>>>>> 4e9ac5c (feat(auth): implement user model with password hashing, token generation, and email verification features)
=======
      console.error(`REDIS PUB CLIENT ERROR 📵⚡: ${error.message}`);
>>>>>>> c2efc11 (feat(auth): implement user registration, login, and JWT verification with Redis caching)
    });

    await Promise.all([
      client.connect(),
      Publisher.connect(),
      Subscriber.connect(),
    ]);

<<<<<<< HEAD
<<<<<<< HEAD
    isConnected = true;

    return {
      client,
      isConnected,
    };
=======
     isConnected = true;

    return {
        client,
        isConnected
    }
>>>>>>> 4e9ac5c (feat(auth): implement user model with password hashing, token generation, and email verification features)
=======
    isConnected = true;

    return {
      client,
      isConnected,
    };
>>>>>>> c2efc11 (feat(auth): implement user registration, login, and JWT verification with Redis caching)
  } catch (error) {
    console.error(error.message || "redies connection Error");
    isConnected = false;
  }
};

// ?? ===== USER =====
// ***** SET *****
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> c2efc11 (feat(auth): implement user registration, login, and JWT verification with Redis caching)
export const setUser = async (userId, payload, expiry = 3600) => {
  if (!client || !isConnected) return null;
  const key = `user:${userId}`;
  return await client.setex(key, expiry, JSON.stringify(payload));
<<<<<<< HEAD
};

// ***** GET *****
export const getUser = async (userId) => {
  if (!client || !isConnected) return null;
  const key = `user:${userId}`;
  const payload = await client.get(key);
  return payload ? JSON.parse(payload) : null;
};

// ! ***** DET *****
export const deleteuser = async (userId) => {
  if (!client || !isConnected) return null;
  const key = `user:${userId}`;
  return await client.del(key);
};

// ***** SET_OTP *****
export const setOTP = async (userId, payload, expiry = 600) => {
  if (!client || !isConnected) return null;
  const key = `user:${userId}:otp`;
  return await client.setex(key, expiry, JSON.stringify(payload));
};

// ***** GET_OTP *****
export const getOTP = async (userId) => {
  if (!client || !isConnected) return null;
  const key = `user:${userId}:otp`;
  const payload = await client.get(key);
  return payload ? JSON.parse(payload) : null;
};

// ?? ===== DOCUMENT =====
// ***** SET *****
export const setDocument = async (docId, payload, expiry = 1800) => {
  if (!client || !isConnected) return null;
  const key = `doc:${docId}`;
  return await client.setex(key, expiry, JSON.stringify(payload));
};

// ***** GET *****
export const getDocument = async (docId) => {
  if (!client || !isConnected) return [];
  const key = `doc:${docId}`;
  const payload = await client.get(key);
  return payload ? JSON.parse(payload) : null;
};

// ! ***** DET *****
export const deleteDocumet = async (docId) => {
  if (!client || !isConnected) return null;
  const key = `doc:${docId}`;
  return await client.del(key);
};

// ?? ===== COLLABORATION =====
// ***** send collab *****
export const setCollaboration = async (collabId, payload, expiry = 15) => {
  if (!client || !isConnected) return null;
  const key = `collab:${collabId}`;
  await client.setex(key, expiry, JSON.stringify(payload));
};

// ***** accept collab *****
export const getCollaboration = async (collabId) => {
  if (!client || !isConnected) return null;
  const key = `collab:${collabId}`;
  const payload = await client.get(key);
  return payload ? JSON.parse(payload) : null;
};

//!! ***** delete collab *****
export const deleteCollaboration = async (collabId) => {
  if (!client || !isConnected) return null;
  const key = `collab:${collabId}`;
  await client.del(key);
};

// ?? ===== DOCUMENT CHANGE OPERATION =====
export const setUpdateDocumentOperation = async (
  docId,
  payload,
  expiry = 20
) => {
  if (!client || !isConnected) return null;
  const key = `doc:${docId}:op`;
  return await client.setex(key, expiry, JSON.stringify(payload));
};

export const getUpdateDocumentOperation = async (docId) => {
  if (!client || !isConnected) return null;
  const key = `doc:${docId}:op`;
  const payload = await client.get(key);
  return payload ? JSON.parse(payload) : null;
};

// ?? ===== NOTIFICATION =====
// ***** SET notification *****
export const setNotification = async (
  notifyKey,
  payload,
  expiry = 7 * 24 * 60 * 60
) => {
  if (!client || !isConnected) return null;
  const key = `notify:${notifyKey}`;
  await client.rpush(key, JSON.stringify(payload));
  await client.expire(key, expiry);
};

// ***** GET notification *****
export const getNotification = async (notifyKey) => {
  if (!client || !isConnected) return null;
  const key = `notify:${notifyKey}`;
  const payloads = await client.lrange(key, 0, -1);
  return payloads ? payloads.map((item) => JSON.parse(item)) : null;
};

// ***** DEL notification *****
export const deleteNotification = async (notifyKey, notification) => {
  if (!client || !isConnected) return 0;
  const key = `notify:${notifyKey}`;
  console.log("notification delete")
  const res = await client.lpop(key);
  return  
};

// ?? ====== DIRTY DOCUMENT SET ======
export const markDocumentDirty = async (docId) => {
  if (!client || !isConnected) return null;
  return await client.sadd("doc:dirty", docId);
};

export const getDirtyDocument = async (docId) => {
  if (!client || !isConnected) return [];
  return await client.smembers("doc:dirty");
};

export const removeDirtyDocument = async (docId) => {
  if (!client || !isConnected) return 0;
  return await client.srem("doc:dirty", docId);
};

// ?? ======= DOCUMENT VERSION HISTORY =======
export const appendDocHistory = async(docId, version, actions, expiry = 930) => {
  if(!client || !isConnected) return null;
  const key = `doc:${docId}:history`
  const payload = JSON.stringify({version, actions})
  await client.rpush(key, payload)
  await client.ltrim(key, -200, -1)
  return await client.expire(key, expiry)
}


export const getDocHistory= async(docId) => {
  if(!client || !isConnected) {
    const key = `doc:${docId}:history`
    const list = await client.lrange(key,0,-1)
    return list ? list.map((item)=> JSON.parse(item)) : []
  }
}

// ?? ======= DOCUMENT CHATS =======
export const appendChats = async(docId, data, expiry = 3600) => {
  if(!client || !isConnected) return null;
  const key = `chats:${docId}:history`
  const payload = JSON.stringify({data})
  await client.rpush(key, payload)
  await client.ltrim(key, -200, -1)
  return await client.expire(key, expiry)
}

export const getChats = async(docId) => {
  if(!client || !isConnected) return []
    const key = `chats:${docId}:history`
    const list = await client.lrange(key,0,-1)
    return list ? list.map((item)=> JSON.parse(item)) : []

}
=======
export const setUser = (userId, payload, expiry=3600) => {
  if (!client) return null;
  const key = `user:${userId}`
  return await client.setex(key,expiry, JSON.stringify(payload))
=======
>>>>>>> c2efc11 (feat(auth): implement user registration, login, and JWT verification with Redis caching)
};

// ***** GET *****
export const getUser = async (userId) => {
  if (!client || !isConnected) return null;
  const key = `user:${userId}`;
  const payload = await client.get(key);
  return payload ? JSON.parse(payload) : null;
};

// ! ***** DET *****
export const deleteuser = async (userId) => {
  if (!client || !isConnected) return null;
  const key = `user:${userId}`;
  return await client.del(key);
};

// ?? ===== DOCUMENT =====
// ***** SET *****
export const setDocument = async (docId, payload, expiry = 60) => {
  if (!client || !isConnected) return null;
  const key = `doc:${docId}`;
  return await client.setex(key, expiry, JSON.stringify(payload));
};

// ***** GET *****
export const getDocument = async (docId) => {
  if (!client || !isConnected) return null;
  const key = `doc:${docId}`;
  const payload = await client.get(docId);
  return payload ? JSON.parse(payload) : null;
};

// ! ***** DET *****
export const deleteDocumet = async (docId) => {
  if (!client || !isConnected) return null;
  const key = `doc:${docId}`;
  return await client.del(key);
};

// ?? ===== COLLABORATION =====
// ***** send collab *****
export const sendCollaboration = async (collabID, payload, expiry = 20) => {
  if (!client || !isConnected) return null;
  const key = `collab:${collabID}`;
  await client.setex(key, expiry, JSON.stringify(payload));
};

// ***** accept collab *****
export const acceptCollaboration = async (collabID) => {
  if (!client || !isConnected) return null;
  const key = `collab:${collabID}`;
  const payload = await client.get(key);
  return payload ? JSON.parse(payload) : null;
};

<<<<<<< HEAD



>>>>>>> 4e9ac5c (feat(auth): implement user model with password hashing, token generation, and email verification features)
=======
//!! ***** delete collab *****
export const deleteCollaboration = async (collabID) => {
  if (!client || !isConnected) return null;
  const key = `collab:${collabID}`;
  await client.del(key);
};
>>>>>>> c2efc11 (feat(auth): implement user registration, login, and JWT verification with Redis caching)

export { Publisher, Subscriber };
