import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import {
  changeCurrentPassword,
  currentUser,
  deleteUser,
  forgetPasswordRequest,
  loginUser,
  logoutUser,
  refreshTokenHandler,
  registerUser,
  resetPassword,
  updateAccountDetails,
  verifyEmail,
  verifyEmailRequest,
} from "./auth.controller.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(verifyJWT, logoutUser);

router.route("/refresh-token-refreshed").post(refreshTokenHandler);

router.route("/getme").get(verifyJWT, currentUser);

// router
//   .route("/update-profile")
//   .put(verifyJWT, uploadAvatar.single("avatar"), updateAccountDetails);

router.route("/update-profile").put(verifyJWT, updateAccountDetails);

router.route("/update-current-password").put(verifyJWT, changeCurrentPassword);

router.route("/verify-email/:unHashedToken").post(verifyEmail);

router.route("/verify-email-request").post(verifyEmailRequest);

router.route("/forgot-password-request").post(forgetPasswordRequest);

router.route("/reset-password/:unHashedToken").post(resetPassword);

//!! =====  DANGER ZONE =====
router.route("/delete").delete(deleteUser);

export default router;
