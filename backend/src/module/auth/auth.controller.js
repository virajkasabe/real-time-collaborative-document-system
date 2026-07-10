import crypto from "crypto";
import jwt from "jsonwebtoken";
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
  const { fullName, email, password } = req.body;

  requiredField([fullName, email, password]);

  const alreadyExist = await User.findOne({ email });

  if (alreadyExist) {
    throw new ApiError(400, `${email} already exist`);
  }
  
  const user = await User.create({
    fullName,
    password,
    email,
  });

  // Laxman Shinde


  const { unHashedToken, hashedToken, tokenExpiry } =
  user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  

  const otp = otpGenerator();
  await setOTP(user._id, { otp: otp, emailToken : unHashedToken });
  console.log({
    otp,
  });
  

  await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  await user.save({ validateBeforeSave: false });

  const { refreshToken, accessToken } = await generateAccessRefreshToken(
    user._id
  );

  console.log("OTP", otp);

  // TODO : SEND EMAIL FOR OTP

  console.log("user register");
  return res
    .status(201)
    .json(
      new ApiResponse(201, {}, `user created  successfully`)
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

  console.log(`🏃‍➡️ ${secureUSER.fullName} login successufully`)

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: secureUSER
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
  
  console.log(`🏃 ${req.user.fullName} logout successufully`)
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
  console.log("email", email)

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const { unHashedToken, hashedToken, tokenExpiry } = await user.generateTemporaryToken(user._id);

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

export const resetPassword = asyncHandler(async (req, res) => {
  const { unHashedToken } = req.params;

  const { newPassword , confirmPassword} = req.body;

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New Password and Confirm Password can't be same");
  }

  if (!unHashedToken) {
    throw new ApiError(400, "Email verification token missing");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  }).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  user.password = newPassword;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Your password was changed successfully"));
});

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

  await setOTP(user._id, { otp: otp, emailToken : unHashedToken });

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  console.log("OTP", otp);

  // TODO : SEND EMAIL FOR OTP

  return res
    .status(200)
    .json(
      new ApiResponse(200, { }, `user verify emailId`)
    );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { otp, email } = req.body;
  // console.log("otp",otp)
  // console.log("otp", req.body)

  const findUser = await User.findOne({ email });

  const redisOTPData = await getOTP(findUser._id)

  console.log("unHashedToken",redisOTPData.emailToken)
  console.log("otp",otp)

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

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  if (redisOTPData.otp !== otp) {
    throw new ApiError(401, "OTP INVALID");
  }

  await setUser(user._id, user);
  user.isEmailVerified = true;

  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

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

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const redirectUrl = "http://localhost:5173/dashboard";

  const secureUSER = await secureUser(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .redirect(
      `${redirectUrl}`
    )
});

// !! ==== DANGER ZONE ====
export const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User DELETE Successfully"));
});
