import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import { ENV } from "./config/ENV.js";
import { initializeSocketIO } from "./socket/socket.js";
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import ApiError from "./utils/ApiError.js";
import requestIp from 'request-ip'
import { instrument } from "@socket.io/admin-ui";
import passport from "passport";
import "./passport/index.js";

const app = express();
const httpServer = createServer(app);

// Apply CORS middleware before all routes and other middleware
app.use(cors({
  origin: [
    ENV.CORS_ORIGIN,
    ENV.CLIENT_URL,
    "https://admin.socket.io"
  ].filter(Boolean),
  credentials: true
}));

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: [
      ENV.CORS_ORIGIN,
      ENV.CLIENT_URL,
      "https://admin.socket.io"
    ].filter(Boolean),
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

app.use(requestIp.mw());

const limit = rateLimit({
  windowMs : 15 * 60 * 1000,
  max : 500,
  standardHeaders : true,
  legacyHeaders : false,
  keyGenerator : (req,res) => {
    return req.clientIp;
  },
  handler:(_,__,___, options) => {
    throw new ApiError(
        options.statusCode || 500,
        `There are too many requests. You are only allowed ${
        options.max
      } requests per ${options.windowMs / 60000}`
    )
  }
})

app.use(limit)

app.set("io", io);
app.use(express.static("public"));
app.use(express.json({ extended: true, limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));


app.use(cookieParser());
app.use(helmet());
app.use(passport.initialize());

// TODO : FIRST CHECK THE HEALTH ROUTE

app.use("/api/v1/rtcds/health", (req,res)=>{
    res.status(200).json(new ApiResponse(200, { success : true}, "APP HEALTH WAS GOOD"))
})

// ?? ADD ALL ROUTES HERE
import AuthRouter from "./module/auth/auth.route.js";
import DocRouter from "./module/document/document.route.js";
import CollabRouter from "./module/collaboration/collab.route.js";
import ApiResponse from "./utils/ApiResponse.js";
import path from "path";


// TODO : USE ALL ROUTES HERE
app.use("/api/v1/rtcds/auth", AuthRouter);
app.use("/api/v1/rtcds/doc", DocRouter);
app.use("/api/v1/rtcds/collab", CollabRouter);

app.use("/", (req,res)=>{
    res.status(200).json(new ApiResponse(400, { success : false}, "PAGE NOT FOUND"))
})

// Global error handler middleware (Always returns JSON)
app.use((err, req, res, next) => {
  // Catch MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Email already registered. Please login."
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

initializeSocketIO(io);

export {
  httpServer,
  app
}
