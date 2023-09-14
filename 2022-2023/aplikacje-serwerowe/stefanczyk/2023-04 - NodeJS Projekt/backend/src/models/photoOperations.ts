import sharp from "sharp";
import path from "path";
import config from "./config";
import { logger } from "../app";
import hexoid from "hexoid";
import { returnMsg } from "./types";
import { networkInterfaces } from "os";

// this is the way formidable creates random names
const toHexoid = hexoid(25);

/**
 * Function which returns metadata for a given photo
 * @param storageId relative path to a file
 */
export async function getMetadata(storageId: string): Promise<sharp.Metadata> {
  const realPath = path.join(config.storageDir, storageId);

  return await sharp(realPath).metadata();
}

/**
 * Function which applies filter to a photo and returns new storageId of it or an error.
 * @param storageId relative path to a file
 * @param filter filter name to apply
 * @param filterArgs appropriate arguments for a filter
 */
export async function applyFilter(
  storageId: string,
  filter: string,
  filterArgs?: any
): Promise<returnMsg> {
  const realPath = path.join(config.storageDir, storageId);
  const dots = storageId.split(".");
  const randomName = toHexoid() + "." + dots[dots.length - 1];
  const newPath = path.join(config.storageDir, randomName);

  try {
    switch (filter) {
      case "rotate":
        await sharp(realPath).rotate(parseInt(filterArgs)).toFile(newPath);
        break;
      case "resize":
        await sharp(realPath).resize(filterArgs).toFile(newPath);
        break;
      case "tint":
        await sharp(realPath).tint(filterArgs).toFile(newPath);
        break;
      case "crop":
        await sharp(realPath).extract(filterArgs).toFile(newPath);
        break;
      case "grayscale":
        await sharp(realPath).grayscale().toFile(newPath);
        break;
      case "negate":
        await sharp(realPath).negate().toFile(newPath);
        break;
      case "flip":
        await sharp(realPath).flip().toFile(newPath);
        break;
      case "flop":
        await sharp(realPath).flop().toFile(newPath);
        break;
      default:
        return {
          error: true,
          message: "Given filter does not exist.",
        };
    }
  } catch (err) {
    logger.error("Filter error", err);
    return {
      error: true,
      message: "There was an error.",
    };
  }

  return {
    returnValue: randomName,
    message: "Photo with filter saved.",
  };
}
