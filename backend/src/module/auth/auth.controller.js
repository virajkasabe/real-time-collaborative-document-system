import crypto from "crypto";
import jwt from "jsonwebtoken";
import { uploadCloudinary } from "../../config/cloudinary.js";
import { ENV } from "../../config/ENV.js";
import { deleteuser, getOTP, setOTP, setUser } from "../../redis/client.js";
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
  console.log(req.body);

  requiredField([fullName, email, password]);

  const avatar = req.files?.avatar?.[0]?.path;

  let avatarURI;

  if (avatar) {
    avatarURI = await uploadCloudinary(avatar);
  }

  const alreadyExist = await User.findOne({ email });

  if (alreadyExist) {
    throw new ApiError(400, `${alreadyExist.email} already exist`);
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
  await setOTP(user._id, { otp: otp });
  console.log({
    otp,
  });

  await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  await user.save({ validateBeforeSave: false });

  console.log(`${ENV.BACKEND_URI}/auth/verify-email/${unHashedToken}`);

  //  await sendEmailVerifyUser(user.email, user.fullName, unHashedToken)

  const { refreshToken, accessToken } = await generateAccessRefreshToken(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(200, { token: hashedToken }, `user created  successfully`)
    );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log(req.body);

  requiredField([email, password]);

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "User doesn't exist with this email");
  }

  if (!user.isEmailVerified) {
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
  const user = req.user;

  await deleteuser(req.user._id);

  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .cookie("accessToken", "", option)
    .cookie("refreshToken", "", option)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

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
  // const user = await User.findById(req.user?._id).populate()

  //  await removeRefreshTokenAndPassword(user._id)

  const user = req.user;

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "user fetch Successfully"));
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName } = req.body;

  if (!fullName) {
    throw new ApiError(400, "FullName is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        ...(fullName && { fullName }),
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
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

export const resetPassword = asyncHandler(async (req, res) => {
  const { unHashedToken } = req.params;

  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    throw new ApiError(400, "oldPassword and new password can't be same");
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
  const { oldPassword, newPassword } = req.body;

  // requiredField([oldPassword, newPassword])

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

  await setOTP(user._id, { otp: otp });

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  console.log("OTP", otp);

  console.log(`${ENV.BACKEND_URI}/auth/verify-email/${unHashedToken}`);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { token: unHashedToken }, `user verify emailId`)
    );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { unHashedToken } = req.params;
  const { otp } = req.body;

  if (!unHashedToken) {
    throw new ApiError(400, "Email verification token missing");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
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

  const verifyOTP = await getOTP(user._id);

  if (verifyOTP.otp !== otp) {
    throw new ApiError(401, "OTP INVALID");
  }

  await setUser(user._id, user);
  user.isEmailVerified = true;

  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

const googleLoginCallback = asyncHandler(async (req, res) => {
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

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .redirect(
      `${process.env.CLIENT_URL || "http://localhost:5173"}${redirectUrl}`
    );
});

// !! ==== DANGER ZONE ====
export const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User DELETE Successfully"));
});
