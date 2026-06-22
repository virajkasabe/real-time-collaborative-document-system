import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { uploadCloudinary } from "../../config/cloudinary.js";
import { ENV } from "../../config/ENV.js";
import { deleteuser, getOTP, getUser, setOTP, setUser } from "../../redis/client.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { otpGenerator, requiredField, secureUser } from "../../utils/helper.js";
import User from "./auth.model.js";

const option = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
};

export const generateAccessRefreshToken = async (userId) => {
  const user = await User.findById(userId);

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return {
    refreshToken,
    accessToken,
  };
};

export const registerUser = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { fullName, email, password } = req.body;

  requiredField([fullName, email, password]);

  const avatar = req.files?.avatar?.[0]?.path;

  let avatarURI;

  if (avatar) {
    avatarURI = await uploadCloudinary(avatar);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already exists. Please login or use different email."
    });
  }

  const user = await User.create({
    fullName,
    password,
    email,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  const otp = otpGenerator();

  await setOTP(user._id, { otp: otp, emailToken : unHashedToken });
  console.log({
    otp,
  });

  const hashedOtp = await bcrypt.hash(otp.toString(), 10);
  user.otp = hashedOtp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry


  console.log("Generated OTP:", otp);

  await user.save({ validateBeforeSave: false });

  const { refreshToken, accessToken } = await generateAccessRefreshToken(
    user._id
  );


  console.log("OTP", otp);

  // TODO : SEND EMAIL FOR OTP
  const responseData = { token: unHashedToken };
  if (process.env.NODE_ENV === "development" || ENV.NODE_ENV === "development") {
    responseData.otp = otp; // REMOVE IN PRODUCTION
  }


  return res
    .status(201)
    .json(
 
      new ApiResponse(201, {}, `user created  successfully`)

      new ApiResponse(201, responseData, `user created  successfully`)

    );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  requiredField([email, password]);

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "User doesn't exist with this email");
  }


  if (user.isEmailVerified === false) {
    throw new ApiError(
      401,
      "User can't login because user didn't verify email"
    );
  }

  const passwordValid = await user.isPasswordCorrect(password);

  if (!passwordValid) {
    throw new ApiError(403, "Please check credentials");
  }

  const { refreshToken, accessToken } = await generateAccessRefreshToken(
    user._id
  );

  const secureUSER = await secureUser(user._id);

  await setUser(secureUSER._id, secureUSER);

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: secureUSER,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        `user logged in successfully`
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await deleteuser(userId);

  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: "",
      },
    },
    { new: true }
  );

  req.user = ""

  return res
    .status(200)
    .cookie("accessToken", "", option)
    .cookie("refreshToken", "", option)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

export const accessTokenRefreshed = asyncHandler(async(req,res)=>{

  const incomingToken = req.cookies.refreshToken || req.body.refreshToken

  if(!incomingToken) {
    throw new ApiError(400, "Incoming Token Required")
  }

  try {
    
    const decodedToken = jwt.verify(incomingToken, ENV.REFRESH_TOKEN_SECRET)

    const user = await getUser(decodedToken?._id)

    if(!user) {
      throw new ApiError(401, "Invalid Refresh Token")
    }

    if(incomingToken !== user.refreshToken) {
      throw new ApiError(401, "Token Expired or Used")
    }

    const { accessToken, newRefreshToken : refreshToken } = await generateAccessRefreshToken(user?._id)

  return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", newRefreshToken, option)
      .json(new ApiResponse(200, {
        accessToken,
        newRefreshToken
      } , "Access Token refreshed"))

  } catch (error) {
      throw new ApiError(401, error.message || `Invalid Access Token`)    
  }
})

export const refreshTokenHandler = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  try {
    const decodedToken = jwt.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const { refreshToken: newRefreshToken, accessToken } =
      await generateAccessRefreshToken(user._id);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken: newRefreshToken,
        },
        "Token refreshed successfully"
      )
    );
  } catch (err) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

export const currentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, { user : req.user }, "user fetch Successfully"));
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, avatar } = req.body;
  const userData = {}
  if(fullName) {
    userData.fullName = fullName
  }

  if(avatar) {
    const uploadCloudinary = await uploadCloudinary(avatar)
    userData.avatar = avatar
  }


  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        userData
      },
    },
    { new: true }
  );

  const secure = await secureUser(user._id)

  return res
    .status(200)
    .json(new ApiResponse(200, { user : secure }, "Account details updated successfully"));
});

export const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

export const forgetPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken(user._id);

  user.forgetPasswordRequest = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  console.log(`${ENV.RESET_PASSWORD_URL}/${unHashedToken}`);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { token: unHashedToken },
        "forget password url send to your email"
      )
    );
});

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({
      success: false, message: "Email is required"
    });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({
      success: false,
      message: "No account found with this email"
    });

    // Generate plain token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash and save to DB
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpiry = Date.now() + 30 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetURL = 
      `http://localhost:5173/reset-password/${resetToken}`;

    console.log("DEV Reset URL:", resetURL); // dev only

    return res.status(200).json({
      success: true,
      message: "Reset link generated",
      resetToken, // REMOVE IN PRODUCTION
      resetURL    // REMOVE IN PRODUCTION
    });
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const token = req.params.token || req.body.token;
    const password = req.body.password || req.body.newPassword;

    if (!token) return res.status(400).json({
      success: false, message: "Token is required"
    });
    if (!password) return res.status(400).json({
      success: false, message: "Password is required"
    });

    // Hash incoming token to match DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({
      success: false,
      message: "Token is invalid or expired. Request new link."
    });

    // ✅ CRITICAL - plain text only
    // pre-save hook handles hashing - never bcrypt here
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save(); // pre-save hook hashes automatically

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please login."
    });
  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    });
  }
};

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  requiredField([oldPassword, newPassword,confirmPassword])

  if (oldPassword !== newPassword) {
    throw new ApiError(400, "Old Password and Confirm Password can't be same");
  }
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New Password and Confirm Password can't be same");
  }

  const user = await User.findById(req.user._id);

  const isValidaPassword = await user.isPasswordCorrect(oldPassword);

  if (!isValidaPassword) {
    throw new ApiError(404, "Credentials failed");
  }

  user.password = newPassword;

  user.save({ validateBeforeSave: false });

  //  await removeRefreshTokenAndPassword(user._id)

  return res
    .status(204)
    .json(new ApiResponse(204, {}, `user password changed successfully`));
});

export const verifyEmailRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken(user._id);

  const otp = otpGenerator();
  console.log("Resent OTP:", otp);


  await setOTP(user._id, { otp: otp, emailToken : unHashedToken });

  const hashedNewOtp = await bcrypt.hash(otp.toString(), 10);


  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  user.otp = hashedNewOtp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });


  console.log("OTP", otp);

  // TODO : SEND EMAIL FOR OTP

  const responseData = { token: unHashedToken };
  if (process.env.NODE_ENV === "development" || ENV.NODE_ENV === "development") {
    responseData.otp = otp; // REMOVE IN PRODUCTION
  }


  return res
    .status(200)
    .json(

      new ApiResponse(200, { }, `user verify emailId`)

      new ApiResponse(200, responseData, `New OTP sent successfully`)

    );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { otp, email } = req.body;
  console.log("otp",email)
  console.log("otp", req.body)

  const findUser = await User.findOne({ email });


  const redisOTPData = await getOTP(findUser._id)

  console.log("unHashedToken",redisOTPData.emailToken)
  console.log("otp",otp)

  console.log("unHashedToken", unHashedToken)
  console.log("otp", otp)


  if (!redisOTPData.emailToken) {
    throw new ApiError(400, "Email verification token missing");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(redisOTPData.emailToken)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },

  }).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  console.log("user", user)

  });


  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }


  if (redisOTPData.otp !== otp) {
    throw new ApiError(401, "OTP INVALID");

  // Check OTP Expiry
  if (!user.otp || !user.otpExpiry || Date.now() > user.otpExpiry) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Compare hashed OTP
  const isMatch = await bcrypt.compare(otp.toString(), user.otp);
  if (!isMatch) {
    throw new ApiError(400, "Invalid or expired OTP");

  }

  await setUser(user._id, user);
  user.isEmailVerified = true;

  // Clear verification & OTP fields after success
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  user.otp = undefined;
  user.otpExpiry = undefined;

  /*  


      //   .cookie("accessToken", accessToken, option)
      //   .cookie("refreshToken", refreshToken, option)
      // {
      //   user: secureUSER,
      //   accessToken: accessToken,
      //   refreshToken: refreshToken,
      // }
      
  */

  await user.save({ validateBeforeSave: false });


  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

export const googleLoginCallback = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Google authentication failed");
  }

  const { refreshToken, accessToken } = await generateAccessRefreshToken(
    user._id
  );

  const redirectUrl = "http://localhost:5173/auth/google/callback";

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .redirect(
      `${redirectUrl}?token=${accessToken}`
    );
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check OTP Expiry
  if (!user.otp || !user.otpExpiry || Date.now() > user.otpExpiry) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Compare hashed OTP
  const isMatch = await bcrypt.compare(otp.toString(), user.otp);
  if (!isMatch) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  user.isEmailVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  await user.save({ validateBeforeSave: false });
  await setUser(user._id, user);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

// !! ==== DANGER ZONE ====
export const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User DELETE Successfully"));
});

// Aliases for routing consistency
export const register = registerUser;
export const login = loginUser;
export const logout = logoutUser;

