import { v2 as cloudinaryInstance } from "cloudinary";
import pkg from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const CloudinaryStorage = pkg.CloudinaryStorage || pkg.default?.CloudinaryStorage || pkg;

// Configure Cloudinary
cloudinaryInstance.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  
  cloudinary: { v2: cloudinaryInstance }, 
  params: {
    folder: "blog_cover_images",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

export const upload = multer({ storage: storage });