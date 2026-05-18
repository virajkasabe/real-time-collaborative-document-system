<<<<<<< HEAD
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../module/auth/auth.model.js";
import ApiError from "../utils/ApiError.js";
import {
  loginType
} from '../utils/constant.js'
import { ENV } from "../config/ENV.js";


passport.serializeUser((user, done) => {
  done(null, user._id);
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new ApiError(400, "Google account has no email"), null);
        }

        let user = await User.findOne({ email });

        if (user) {
          if (user.userLoginType !== loginType.GOOGLE) {
            console.log("userlogintype", user.userLoginType)
            return done(  
              new ApiError(
                400,
                `Please login using ${user.userLoginType.toLowerCase().replace("_", " ")}`
              ),
              null
            );
          }

          return done(null, user);
        }

        // Create new user
        const newUser = await User.create({
          email,
          fullName: profile.displayName || email.split("@")[0],
          password : profile.id,
          isEmailVerified: true,
          avatar: profile.photos?.[0]?.value,
          userLoginType : loginType.GOOGLE
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
=======
/*
   GOOGLE AUTHENTICATION USING PASSPORT
*/
>>>>>>> 49577a8 (docs(backend): add initial documentation comments for modules and utilities)
