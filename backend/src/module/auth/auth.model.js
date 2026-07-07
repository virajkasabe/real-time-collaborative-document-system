import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
<<<<<<< HEAD
import { Schema, model } from "mongoose";
import { ENV } from "../../config/ENV.js";

const userSchema = new Schema(
=======
import mongoose from "mongoose";
import { ENV } from "../../config/ENV.js";
import { loginType, loginTypeEnum } from "../../utils/constant.js";

const userSchema = new mongoose.Schema(
>>>>>>> wind-breathing
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
<<<<<<< HEAD
      unique: true,
=======
>>>>>>> wind-breathing
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Email format is incorrect. Use a valid format such as name@example.com (e.g., jane.smith@gmail.com) .",
      ],
    },
    avatar: {
      type: String,
      default: "",
    },
<<<<<<< HEAD
=======
    userLoginType : {
      type : String,
      default : loginType.EMAIL_PASSWORD,
      enum : loginTypeEnum
    },
>>>>>>> wind-breathing
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
<<<<<<< HEAD
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
=======
>>>>>>> wind-breathing
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
<<<<<<< HEAD
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
=======
>>>>>>> wind-breathing
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

<<<<<<< HEAD
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

=======
>>>>>>> wind-breathing
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
    },
    ENV.ACCESS_TOKEN_SECRET,
    {
      expiresIn: 20 * 60 * 1000,
    } 
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    ENV.REFRESH_TOKEN_SECRET,
    {
      expiresIn: ENV.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 10 * 60 * 1000;

  return {
    unHashedToken,
    hashedToken,
    tokenExpiry,
  };
};

<<<<<<< HEAD
const User = model("User", userSchema);
=======
const User = mongoose.model("User", userSchema);
>>>>>>> wind-breathing
export default User;
