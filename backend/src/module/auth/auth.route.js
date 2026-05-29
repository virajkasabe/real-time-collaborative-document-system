import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import {
  changeCurrentPassword,
  currentUser,
  deleteUser,
  loginUser,
  logoutUser,
  refreshTokenHandler,
  registerUser,
  updateAccountDetails,
  verifyEmail,
} from "./auth.controller.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshTokenHandler);

router.route("/getme").get(verifyJWT, currentUser);

router.route("/profile").put(verifyJWT, updateAccountDetails);

router.route("/password").put(verifyJWT, changeCurrentPassword);

router.route("/verify-email/:unHashedToken").get(verifyEmail);

//!! =====  DANGER ZONE =====
router.route("/delete/:email").delete(deleteUser);

export default router;
