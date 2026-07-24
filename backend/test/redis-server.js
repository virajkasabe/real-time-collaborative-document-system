import Redis from "ioredis";


const client = new Redis(ENV.REDIS_URI, { lazyConnect: true });

export const redisTestConnector = () => {
    client.on("error", ()=>{
        console.error(`REDIS TESTING CLIENT ERROR 🚫🌐⚡ : ${error.message}`);
    })

    await Promise.all([
          client.connect()
        ]);
}