import config from "./config";
import path from "path";
import { unlink} from "fs";
import { readFile } from "fs/promises";
import { logger } from "../app";
// import { mkdir, writeFile } from "fs/promises";

/**
 * Function which returns real path to a file
 * @param relativePath 
 * @returns absolute file path on a server
 */
export function getPath(relativePath: string): string {
  return path.join(config.storageDir, relativePath);
}

/**
 * Function which deletes a file from filesystem
 * @param relativePath
 */
export async function deleteFile(relativePath: string) {
  const realPath = path.join(config.storageDir, relativePath);

  unlink(realPath, (err) => {
    if (err) {
      logger.error(err);
      return;
    }

    logger.log(realPath, "was deleted!");
  });
}

export async function getFileBuffer(relativePath: string): Promise<Buffer | null> {
  const realPath = path.join(config.storageDir, relativePath);

  try {
    return await readFile(realPath);
  } catch {
    return null
  }
}

// async function fileCreate(relativePath: string, data: Buffer) {
//   const realPath = path.join(config.storageDir, relativePath);
//   try {
//     await writeFile(realPath, data)
//   } catch (err) {
//     logger.error(err);
//   }
// }

// async function dirCreate(relativePath: string) {
//   const realPath = path.join(config.storageDir, relativePath);
//   try {
//     await mkdir(realPath, { recursive: true });
//   } catch (err) {
//     logger.error(err);
//   }
// }
