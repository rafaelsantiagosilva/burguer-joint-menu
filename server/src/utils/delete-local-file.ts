import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import fs from "fs/promises";

export async function deleteLocalFile(fileUrl: string) {
  try {
    await fs.unlink(fileUrl);
  } catch (error: any) {
    if (error.code !== "ENOENT")
      throw new ResourceNotFoundError();
  }
}