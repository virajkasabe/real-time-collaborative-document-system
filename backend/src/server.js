import { httpServer } from "./app.js";
import { ENV } from "./config/ENV.js";
import { connectDB } from "./db/index.js";
import { RedisConnect } from "./redis/client.js";

<<<<<<< HEAD
// Helper to start the Express and Socket.IO server
const startServer = () => {
  httpServer.listen(ENV.PORT, () => {

    // console.log("SERVER CONNECTED SUCESSFULLY : 📡🛰️");
=======
const startServer = () => {
  httpServer.listen(ENV.PORT,() => {
    console.log("SERVER CONNECTED SUCESSFULLY : 📡🛰️");
>>>>>>> wind-breathing
  });
};



if(ENV.NODE_ENV !== "test") {
  try {
  // ** mongo
  await connectDB();
<<<<<<< HEAD
  // console.log("MONGODB CONNECTED SUCCESSFULLY :🌿");

  // **  redis
  await RedisConnect();
  // console.log("REDIS CONNECTED SUCCESSFULLY : 🚀⚡📡");

  // ** server
  startServer();
  console.log("EVERYTHING RUNNING : 📡🛰️");
} catch (error) {
  console.error("MONGODB CONNECTION ERROR", error.message);
  process.exit(1);

    console.log(`SERVER CONNECTED SUCCESSFULLY : 📡🛰️ on port ${ENV.PORT}`);
  });
};

// Start connections and server only when not running tests
if (ENV.NODE_ENV !== "test") {
  try {
    // 1. Establish MongoDB connection
    await connectDB();
    console.log("MONGODB CONNECTED SUCCESSFULLY :🌿");

    // 2. Establish Redis connection
    await RedisConnect();
    console.log("REDIS CONNECTED SUCCESSFULLY : 🚀⚡📡");

    // 3. Start the server
    startServer();
  } catch (error) {
    console.error("SERVER STARTUP CONNECTION ERROR:", error.message);
    process.exit(1);
  }

}
=======
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

>>>>>>> wind-breathing
