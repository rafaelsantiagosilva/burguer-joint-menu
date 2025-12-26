import { fileURLToPath } from "url";
import path from "path";

export function getDirname(importMetaUrl: string) {
  const __filename = fileURLToPath(importMetaUrl);
  const __dirname = path.dirname(__filename);
  return { __dirname, __filename };
}