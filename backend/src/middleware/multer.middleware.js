<<<<<<< HEAD
import path from 'path';
import multer from 'multer';
import fs from 'fs';

const publicDir = path.join(process.cwd(), "public");
const imageDir = path.join(publicDir, "images");
const avatarDir = path.join(publicDir, "avatar");

[publicDir, imageDir, avatarDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir);
  },
  filename: (req, file, cb) => {
    const uniSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const cleanName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${uniSuffix}-${cleanName}`);
  }
});

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const uniSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const cleanName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${uniSuffix}-${cleanName}`);
  }
});


export const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
});
=======

/*

      create like file handling

      avatar,
      images
      etc

 */
>>>>>>> 49577a8 (docs(backend): add initial documentation comments for modules and utilities)
