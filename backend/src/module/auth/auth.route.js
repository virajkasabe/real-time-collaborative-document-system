<<<<<<< HEAD
<<<<<<< HEAD
import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import passport  from 'passport';
import {
  accessTokenRefreshed,
  changeCurrentPassword,
  currentUser,
  deleteUser,
  forgetPasswordRequest,
  googleLoginCallback,
=======
import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import {
  changeCurrentPassword,
  currentUser,
  deleteUser,
>>>>>>> c2efc11 (feat(auth): implement user registration, login, and JWT verification with Redis caching)
  loginUser,
  logoutUser,
  refreshTokenHandler,
  registerUser,
<<<<<<< HEAD
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

router.route("/access-token-refreshed").post(accessTokenRefreshed);

router.route("/getme").get(verifyJWT, currentUser);

// router
//   .route("/update-profile")
//   .put(verifyJWT, uploadAvatar.single("avatar"), updateAccountDetails);

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


router.route("/update-profile").put(verifyJWT, updateAccountDetails);

router.route("/update-current-password").put(verifyJWT, changeCurrentPassword);

router.route("/verify-email").post(verifyEmail);

router.route("/verify-email-request").post(verifyEmailRequest);

router.route("/forgot-password-request").post(forgetPasswordRequest);

router.route("/reset-password/:unHashedToken").post(resetPassword);

//!! =====  DANGER ZONE =====
router.route("/delete").delete(deleteUser);

export default router;
=======
/*
=======
  updateAccountDetails,
  verifyEmail,
} from "./auth.controller.js";
>>>>>>> c2efc11 (feat(auth): implement user registration, login, and JWT verification with Redis caching)

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshTokenHandler);

<<<<<<< HEAD
*/
>>>>>>> 49577a8 (docs(backend): add initial documentation comments for modules and utilities)
=======
router.route("/getme").get(verifyJWT, currentUser);

router.route("/profile").put(verifyJWT, updateAccountDetails);

router.route("/password").put(verifyJWT, changeCurrentPassword);

router.route("/verify-email/:unHashedToken").get(verifyEmail);

//!! =====  DANGER ZONE =====
router.route("/delete/:email").delete(deleteUser);

export default router;
>>>>>>> c2efc11 (feat(auth): implement user registration, login, and JWT verification with Redis caching)
