import { InvalidFileFormatError } from "@/errors/InvalidFileFormatError.ts";
import type IStorageProvider from "@/providers/IStorageProvider.ts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UploadProductImageService } from "./upload-image.ts";

describe("Upload Image Product Service (Unit)", () => {
  let storageProvider: IStorageProvider;
  let sut: UploadProductImageService;

  beforeEach(() => {
    storageProvider = {
      save: vi.fn().mockReturnValue("/public/products/images/image.jpg"),
      delete: vi.fn()
    }

    sut = new UploadProductImageService(storageProvider);
  });

  it("should be able to upload a new file with the correct mimetype", async () => {
    const jpgFile = {
      buffer: Buffer.from("image-data"),
      originalname: "image.jpg",
      mimetype: "image/jpeg"
    };

    const pngFile = {
      buffer: Buffer.from("image-data"),
      originalname: "image.png",
      mimetype: "image/png"
    };

    expect(await sut.execute(jpgFile)).toBe("/public/products/images/image.jpg");

    storageProvider = {
      save: vi.fn().mockReturnValue("/public/products/images/image.png"),
      delete: vi.fn()
    }

    sut = new UploadProductImageService(storageProvider);

    expect(await sut.execute(pngFile)).toBe("/public/products/images/image.png");
  });

  it("should not be able to upload a new file with the incorrect mimetype", async () => {
    const invalidFile = {
      buffer: Buffer.from("fake-pdf"),
      originalname: "doc.pdf",
      mimetype: "application/opdf"
    };

    await expect(sut.execute(invalidFile))
      .rejects.toBeInstanceOf(InvalidFileFormatError);
  });
});

function makeMocks() {

}