import { InvalidFileFormatError } from "@/errors/InvalidFileFormatError.ts";
import { DiskStorageProvider } from "@/providers/disk-storage-provider.ts";
import { UploadProductImageService } from "@/services/products/upload-image.ts";
import { getDirname } from "@/utils/get-dirname.ts";
import fs from "fs/promises";
import path from "path";
import { beforeEach, describe, expect, it } from "vitest";

describe("Upload Image Product Service (Integration)", () => {
  let storageProvider: DiskStorageProvider;
  let sut: UploadProductImageService;

  beforeEach(() => {
    storageProvider = new DiskStorageProvider();
    sut = new UploadProductImageService(storageProvider);
  });

  it("should be able to upload a new file with the correct mimetype", async () => {
    const fileBuffer = Buffer.from("fake-image-data");
    const request = {
      buffer: fileBuffer,
      originalname: "test-image.png",
      mimetype: "image/png"
    }

    const resultUrl = await sut.execute(request);
    const { __dirname } = getDirname(import.meta.url);
    const resolvedPath = path.resolve(__dirname, "..", "..", "..", ...resultUrl.split("/"));

    const fileExists = await fs.access(resolvedPath).then(() => true).catch(() => false);
    expect(fileExists).toBe(true);

    await fs.unlink(resolvedPath);
  });

  it("should not be able to upload a new file with the incorrect mimetype", async () => {
    const request = {
      buffer: Buffer.from("fake-pdf"),
      originalname: "doc.pdf",
      mimetype: "application/pdf"
    };

    await expect(sut.execute(request))
      .rejects.toBeInstanceOf(InvalidFileFormatError);
  });
});

function makeMocks() {

}