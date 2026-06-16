import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import {
  changeCurrentPassword,
  currentUser,
  deleteUser,
  forgotPassword,
  login,
  logout,
  refreshTokenHandler,
  register,
  resetPassword,
  updateAccountDetails,
  verifyEmail,
  verifyEmailRequest,
  verifyOTP,
  googleLoginCallback,
} from "./auth.controller.js";
import passport from "passport";

const router = Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").post(verifyJWT, logout);

router.route("/refresh-token-refreshed").post(refreshTokenHandler);

router.route("/getme").get(verifyJWT, currentUser);

// router
//   .route("/update-profile")
//   .put(verifyJWT, uploadAvatar.single("avatar"), updateAccountDetails);

router.route("/update-profile").put(verifyJWT, updateAccountDetails);

router.route("/update-current-password").put(verifyJWT, changeCurrentPassword);

router.route("/verify-email/:unHashedToken").post(verifyEmail);

router.route("/verify-email-request").post(verifyEmailRequest);

router.route("/verify-otp").post(verifyJWT, verifyOTP);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/reset-password', resetPassword);

router.route("/google").get(
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.route("/callback/google").get(
  passport.authenticate("google", { session: false }),
  googleLoginCallback
);

//!! =====  DANGER ZONE =====
router.route("/delete").delete(deleteUser);

export default router;
