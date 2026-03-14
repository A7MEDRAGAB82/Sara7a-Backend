import multer from "multer";
import fs from "node:fs";

export let multer_local = ({ customPath } = { customPath: "general" }) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let filesPath = `upload/${customPath}`;
      if (!fs.existsSync(filesPath)){
         fs.mkdirSync(filesPath,{ recursive: true });
      }
      cb(null, filesPath);
    },

    filename: function (req, file, cb) {
      let prefix = Date.now();
      let fileName = `${prefix}-${file.originalname}`;
      cb(null, fileName);
    },
  });

  return multer({ storage });
};
