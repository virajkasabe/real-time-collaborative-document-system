import { httpServer } from "./app.js";
import { ENV } from "./config/ENV.js";
import { connectDB } from "./db/index.js";
import { RedisConnect } from "./redis/client.js";

const startServer = () => {
  httpServer.listen(ENV.PORT,() => {
    console.log("SERVER CONNECTED SUCESSFULLY : 📡🛰️");
  });
};



if(ENV.NODE_ENV !== "test") {
  try {
  // ** mongo
  await connectDB();
  console.log("MONGODB CONNECTED SUCCESSFULLY :🌿");

  // **  redis
  await RedisConnect();
  console.log("REDIS CONNECTED SUCCESSFULLY : 🚀⚡📡");

  // ** server
  startServer();
} catch (error) {
  console.error("MONGODB CONNECTION ERROR", error.message);
  process.exit(1);
}
}

