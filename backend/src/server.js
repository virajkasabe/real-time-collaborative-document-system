import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import { ENV } from "./config/ENV.js";
import { connectDB } from "./db/index.js";
import { RedisConnect } from "./redis/client.js";
import { initializeSocketIO } from "./socket/socket.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: ENV.CORS_ORIGIN,
    credentials: true,
  },
});

app.set("io", io);

app.use(express.json({ extended: true, limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("/public"));
app.use(cookieParser());
app.use(helmet());

// TODO : FIRST CHECK THE HEALTH ROUTE

// ?? ADD ALL ROUTES HERE
import AuthRouter from "./module/auth/auth.route.js";

// TODO : USE ALL ROUTES HERE
app.use("/api/v1/rtcds/auth", AuthRouter);

initializeSocketIO(io);

const startServer = () => {
  httpServer.listen(ENV.PORT, () => {
    console.log("SERVER CONNECTED SUCESSFULLY : 📡🛰️");
  });
};

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
