import { InvalidFileFormatError } from "@/errors/InvalidFileFormatError.ts";
import type IStorageProvider from "@/providers/IStorageProvider.ts";
import crypto from "crypto";

type UploadProductImageServiceRequest = {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

type UploadProductImageServiceResponse = string;

export class UploadProductImageService {
  constructor(private storageProvider: IStorageProvider) { }

  async execute({
    buffer,
    originalname,
    mimetype
  }: UploadProductImageServiceRequest):
    Promise<UploadProductImageServiceResponse> {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedMimeTypes.includes(mimetype))
      throw new InvalidFileFormatError();

    const fileHash = crypto.randomBytes(16).toString("hex");
    const fileName = `${fileHash}-${originalname}`;
    const filePath = `/public/products/images/${fileName}`;

    const url = await this.storageProvider.save(buffer, filePath);
    return url;
  }
}