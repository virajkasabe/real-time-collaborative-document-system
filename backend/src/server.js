import { httpServer } from "./app.js";
import { ENV } from "./config/ENV.js";
import { connectDB } from "./db/index.js";
import { client, RedisConnect } from "./redis/client.js";

const startServer = () => {
  httpServer.listen(ENV.PORT, () => {
    console.log("🚀 Server started successfully");
    console.log(`🏠 Host : localhost`);
    console.log(`🔌 Port : ${ENV.PORT}`);
    console.log(`🌐 URL  : http://localhost:${ENV.PORT}`);
  });
};

if (ENV.NODE_ENV !== "test") {
  try {
    // 🌿 MongoDB
    await connectDB();
    console.log("🌿 MongoDB connected successfully");

    // 📦 Redis
    await RedisConnect();
    console.log(`🏠 Redis Host : ${client.options.host}`);
    console.log(`🔌 Redis Port : ${client.options.port}`);
    console.log("📦 Redis connected successfully");

    // 🚀 HTTP Server
    startServer();
  } catch (error) {
    console.error("❌ Failed to start application");
    console.error(error.message);
    process.exit(1);
  }
}