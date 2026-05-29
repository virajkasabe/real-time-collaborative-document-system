import { v2 as cloudinary } from "cloudinary";
import { ENV } from "./ENV.js";


cloudinary.config({
    api_key : ENV.CLOUDINARY_API_KEY,
    api_secret : ENV.CLOUDINARY_API_SECRET,
    cloud_name : ENV.CLOUDINARY_CLOUD_NAME
})

export const uploadCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) {
      throw new ApiError(404, "localFile not found");
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw new ApiError(404, error.message || "local file not found");
  }
};
