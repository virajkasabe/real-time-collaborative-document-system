import { httpServer } from "./app.js";
import { ENV } from "./config/ENV.js";
import { connectDB } from "./db/index.js";
import { RedisConnect } from "./redis/client.js";

// Helper to start the Express and Socket.IO server
const startServer = () => {
  httpServer.listen(ENV.PORT, () => {
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
