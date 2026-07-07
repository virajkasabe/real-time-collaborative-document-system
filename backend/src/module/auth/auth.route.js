import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
<<<<<<< HEAD
=======
import passport  from 'passport';
>>>>>>> wind-breathing
import {
  accessTokenRefreshed,
  changeCurrentPassword,
  currentUser,
  deleteUser,
<<<<<<< HEAD
  forgotPassword,
  login,
  logout,
  refreshTokenHandler,
  register,
=======
  forgetPasswordRequest,
  googleLoginCallback,
  loginUser,
  logoutUser,
  refreshTokenHandler,
  registerUser,
>>>>>>> wind-breathing
  resetPassword,
  updateAccountDetails,
  verifyEmail,
  verifyEmailRequest,
<<<<<<< HEAD
  verifyOTP,
  googleLoginCallback,
} from "./auth.controller.js";
import passport from "passport";

const router = Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").post(verifyJWT, logout);
=======
} from "./auth.controller.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(verifyJWT, logoutUser);
>>>>>>> wind-breathing

router.route("/refresh-token-refreshed").post(refreshTokenHandler);

router.route("/access-token-refreshed").post(accessTokenRefreshed);

router.route("/getme").get(verifyJWT, currentUser);

// router
//   .route("/update-profile")
//   .put(verifyJWT, uploadAvatar.single("avatar"), updateAccountDetails);

<<<<<<< HEAD
=======
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("redirecting to google...");
  }
);

router
  .route("/callback/google")
  .get(passport.authenticate("google", {session : true}), googleLoginCallback);


>>>>>>> wind-breathing
router.route("/update-profile").put(verifyJWT, updateAccountDetails);

router.route("/update-current-password").put(verifyJWT, changeCurrentPassword);

router.route("/verify-email").post(verifyEmail);

router.route("/verify-email-request").post(verifyEmailRequest);

<<<<<<< HEAD
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
=======
router.route("/forgot-password-request").post(forgetPasswordRequest);

router.route("/reset-password/:unHashedToken").post(resetPassword);
>>>>>>> wind-breathing

//!! =====  DANGER ZONE =====
router.route("/delete").delete(deleteUser);

export default router;
