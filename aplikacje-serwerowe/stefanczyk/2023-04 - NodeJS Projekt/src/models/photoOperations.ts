import sharp from "sharp";
import path from "path";
import config from "./config";

export async function getMetadata(storageId: string) {
    const realPath = path.join(config.storageDir, storageId);

    return await sharp(realPath).metadata();
}
