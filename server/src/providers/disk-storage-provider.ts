import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { getDirname } from "@/utils/get-dirname.ts";
import fs from "fs/promises";
import path from "path";
import type IStorageProvider from "./IStorageProvider.ts";

export class DiskStorageProvider implements IStorageProvider {
  private async ensureDirectoryExists(filePath: string) {
    const arrayPath: string[] = filePath.split("/");
    arrayPath.pop();

    const { __dirname } = getDirname(import.meta.url);
    const resolvedPath = path.resolve(__dirname, "..", "..", ...arrayPath);

    try {
      await fs.access(resolvedPath);
    } catch {
      await fs.mkdir(resolvedPath, { recursive: true });
    }
  }

  async save(buffer: Buffer, filePath: string): Promise<string> {
    this.ensureDirectoryExists(filePath);

    const arrayPath = filePath.split("/");
    const { __dirname } = getDirname(import.meta.url);
    const resolvedPath = path.resolve(__dirname, "..", "..", ...arrayPath);
    await fs.writeFile(resolvedPath, buffer);
    return filePath;
  }

  async delete(filePath: string): Promise<void> {
    try {
      const arrayPath = filePath.split("/");
      const { __dirname } = getDirname(import.meta.url);
      const resolvedPath = path.resolve(__dirname, "..", "..", ...arrayPath);
      await fs.unlink(resolvedPath);
    } catch (error: any) {
      if (error.code !== "ENOENT")
        throw new ResourceNotFoundError();
    }
  }

}