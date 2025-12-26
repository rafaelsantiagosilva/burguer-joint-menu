import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import fs from "fs/promises";
import { file } from "zod";
import { getDirname } from "./get-dirname.ts";
import path, { resolve } from "path";

export async function deleteLocalFile(fileUrl: string) {
  try {
    const arrayPath = fileUrl.split("/");
    const { __dirname } = getDirname(import.meta.url);
    console.table(arrayPath);
    const resolvedPath = path.resolve(__dirname, "..", "..", ...arrayPath);
    await fs.unlink(resolvedPath);
  } catch (error: any) {
    if (error.code !== "ENOENT")
      throw new ResourceNotFoundError();
  }
}