import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a factory function for multer uploaders with dynamic folders
export const createUploader = (folderName: string, isDocument: boolean = false) => {
  const allowedMimeTypes = isDocument
    ? ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    : ['image/jpeg', 'image/png', 'image/webp'];

  const allowedFormats = isDocument ? ['jpg', 'jpeg', 'png', 'webp', 'pdf'] : ['jpg', 'jpeg', 'png', 'webp'];

  const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          isDocument ? 'Chỉ hỗ trợ upload ảnh (JPG, PNG, WEBP) hoặc PDF' : 'Chỉ hỗ trợ upload ảnh JPG, PNG hoặc WEBP'
        )
      );
    }
  };

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const isPdf = file.mimetype === 'application/pdf';

      const p: any = {
        folder: `cuuho247/${folderName}`,
        resource_type: isPdf ? 'raw' : 'image',
      };

      // Raw files don't support allowed_formats or image transformations
      if (!isPdf) {
        p.allowed_formats = ['jpg', 'jpeg', 'png', 'webp'];

        if (!isDocument) {
          p.transformation = [{ width: 1200, crop: 'limit' }, { quality: 'auto' }, { fetch_format: 'auto' }];
        }
      }

      return p;
    },
  });

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
};
