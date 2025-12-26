import { InvalidFileFormatError } from "@/errors/InvalidFileFormatError.ts";
import { getDirname } from "@/utils/get-dirname.ts";
import crypto from "crypto";
import multer from "multer";
import path from "path";

const { __dirname } = getDirname(import.meta.url);

export const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "..", "public", "products", "images"),
    filename: (_req, file, cb) => {
      const fileHash = crypto.randomBytes(16).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;
      cb(null, fileName);
    }
  }),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
      return cb(new InvalidFileFormatError());
    }

    cb(null, true);
  }
});
