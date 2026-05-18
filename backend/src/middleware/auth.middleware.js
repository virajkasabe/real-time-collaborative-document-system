<<<<<<< HEAD
import jwt from "jsonwebtoken";
import { ENV } from "../config/ENV.js";
import User from "../module/auth/auth.model.js";
import { getUser, setUser } from "../redis/client.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { secureUser } from "../utils/helper.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const decodedToken = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);

    if (!decodedToken._id) {
      throw new ApiError(401, "Invalid token");
    }

    let user;
    user = await secureUser(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token");
    }
    throw new ApiError(401, error.message || "Authentication failed");
  }
});
=======
/*
        auth middleware

        methods like

        verifyJWT
        verifyDocumentId -> document exists or not
        verifyDocumentMember -> for view the document
        verifyDocumentAdmin -> for document owner share for collabration
        verifyDocumentEditor -> for editing the document

*/
>>>>>>> 49577a8 (docs(backend): add initial documentation comments for modules and utilities)
