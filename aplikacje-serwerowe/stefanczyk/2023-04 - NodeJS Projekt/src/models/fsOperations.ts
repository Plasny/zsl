import config from "./config";
import path from "path";
import { unlink } from 'fs'
import { logger } from "../app";
// import { mkdir, writeFile } from "fs/promises";

/**
 * Function which deletes a file from filesystem
 * @param relativePath 
 */
export async function deleteFile(relativePath: string) {
  const realPath = path.join(config.storageDir, relativePath)

  unlink(realPath, (err) => {
    if (err) {
      logger.error(err);
      return;
    }

    logger.log(realPath, "was deleted!");
  }); 
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
