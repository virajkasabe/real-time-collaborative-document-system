<<<<<<< HEAD
<<<<<<< HEAD
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

=======
=======
import cookieParser from "cookie-parser";
>>>>>>> f7ad83d (feat(backend): implement core backend functionality with environment configuration, database connection, and socket integration)
import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import { ENV } from "./config/ENV.js";
import { connectDB } from "./db/index.js";
import { initializeSocketIO } from "./socket/socket.js";
import { RedisConnect } from "./redis/client.js";

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

<<<<<<< HEAD
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
>>>>>>> 9066b06 (chore(backend): update dev script and dotenv config)
=======
app.use(express.json({ extended: true, limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("/public"));
app.use(cookieParser());
app.use(helmet());

// TODO : FIRST CHECK THE HEALTH ROUTE

// ?? ADD ALL ROUTES HERE

// TODO : USE ALL ROUTES HERE

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
>>>>>>> f7ad83d (feat(backend): implement core backend functionality with environment configuration, database connection, and socket integration)
