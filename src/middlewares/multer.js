import multer from "multer";
import fs from "node:fs";

export const multer_local = ({ customPath = "general", allowedTypes = ["image/jpeg", "image/png", "image/jpg"] } = {}) => {
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const filesPath = `uploads/${customPath}`;
      if (!fs.existsSync(filesPath)) {
        fs.mkdirSync(filesPath, { recursive: true });
      }
      cb(null, filesPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = file.originalname.split('.').pop();
      cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG and JPG are allowed!"), false);
    }
  };

  return multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
  });
};