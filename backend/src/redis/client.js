import Redis from "ioredis";
import { ENV } from "../config/ENV.js";
import { redisEvent } from "../utils/constant.js";

const client = new Redis(ENV.REDIS_URI, { lazyConnect: true });
const Subscriber = new Redis(ENV.REDIS_URI, { lazyConnect: true });
const Publisher = new Redis(ENV.REDIS_URI, { lazyConnect: true });
let isConnected = false;

export const RedisConnect = async () => {
  try {
    client.on(redisEvent.ERROR, (error) => {
      console.error(`REDIS CLIENT ERROR 🚫🌐⚡ : ${error.message}`);
    });

    Subscriber.on(redisEvent.ERROR, (error) => {
      console.error(`REDIS SUB CLIENT ERROR‼️ : ${error.message}`);
    });

    Publisher.on(redisEvent.ERROR, (error) => {
      console.error(`REDIS PUB CLIENT ERROR 📵⚡: ${error.message}`);
    });

    await Promise.all([
      client.connect(),
      Publisher.connect(),
      Subscriber.connect(),
    ]);

    isConnected = true;

    return {
      client,
      isConnected,
    };
  } catch (error) {
    console.error(error.message || "redies connection Error");
    isConnected = false;
  }
};

// ?? ===== USER =====
// ***** SET *****
export const setUser = async (userId, payload, expiry = 3600) => {
  if (!client || !isConnected) return null;
  const key = `user:${userId}`;
  return await client.setex(key, expiry, JSON.stringify(payload));
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
export const sendCollaboration = async (collabId, payload, expiry = 20) => {
  if (!client || !isConnected) return null;
  const key = `collab:${collabId}`;
  await client.setex(key, expiry, JSON.stringify(payload));
};

// ***** accept collab *****
export const acceptCollaboration = async (collabId) => {
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

export { Publisher, Subscriber };
