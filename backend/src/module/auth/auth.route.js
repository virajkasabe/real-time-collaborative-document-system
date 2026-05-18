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


routes like

  POST -> register
  POST -> login
  GET -> logout
  GET -> getUser
  GET -> verifyUserEmail --> for viaLogin EMAIL,PASSWORD
  POST -> forgetPasswordRequest
  POST -> Change password

  !! --- DENGER ZONE
  DELETE -> userDelete


*/
>>>>>>> 49577a8 (docs(backend): add initial documentation comments for modules and utilities)
