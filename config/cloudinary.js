import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
import * as cloud from "cloudinary";
const cloudinary = cloud.v2;
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  folder: "videos",
});

export default cloudinary;
