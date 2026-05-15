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
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({
  quiet : true
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Server Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
>>>>>>> 9066b06 (chore(backend): update dev script and dotenv config)
