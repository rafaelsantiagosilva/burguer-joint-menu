import { InvalidFileFormatError } from "@/errors/InvalidFileFormatError.ts";
import crypto from "crypto";
import type { Request, Response } from "express";
import multer from "multer";
import path from "path";

export const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, "..", "..", "public", "products", "images"),
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

export function uploadSingleAsync(field: string) {
  return (req: Request, res: Response) => {
    new Promise<void>((resolve, reject) => {
      upload.single(field)(req, res, (err) => {
        if (err)
          return reject(err);
        resolve();
      })
    });
  }
}