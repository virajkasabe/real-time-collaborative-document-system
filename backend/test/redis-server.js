import Redis from "ioredis";
import { ENV } from "../src/config/ENV.js";


const client = new Redis(ENV.REDIS_URI, { lazyConnect: true });

export const redisTestConnector = async() => {
    client.on("error", ()=>{
        console.error(`REDIS TESTING CLIENT ERROR 🚫🌐⚡ : ${error.message}`);
    })

    await Promise.all([
          client.connect()
        ]);
}

export {
    client
}