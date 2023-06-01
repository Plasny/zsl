import dotenv from "dotenv";
import { randomBytes } from "crypto";
import path from "path";

/**
 * Type which represents configuration options for this app
 */
type configType = {
  /**
   * Path to directory in which to store all files
   */
  storageDir: string;

  /**
   * List of tags to start with
   */
  tagsList: string[];

  /**
   * Encryption key for jwt
   */
  encryptionKey: string;

  /**
   * Port on which to run the server
   */
  port: number;

  /**
   * Assets directory of the project
   */
  assets: string;

  /**
   * No authorization required - option for easier app development which 
   * disables need to authorize with jwt
   */
  noAuth: boolean;
};

/**
 * Function which returns configuration options for this app. It is possible to
 * set them using config.json file placed in the directory from which the app is
 * started.
 */
function config(): configType {
  const tagsList = process.env.DEFAULT_TAGS
    ? JSON.parse(process.env.DEFAULT_TAGS)
    : [
        "#love",
        "#instagood",
        "#fashion",
        "#photooftheday",
        "#art",
        "#photography",
        "#instagram",
        "#beautiful",
        "#picoftheday",
        "#nature",
        "#happy",
        "#cute",
        "#travel",
        "#style",
        "#followme",
        "#tbt",
        "#instadaily",
        "#repost",
        "#like4like",
        "#summer",
        "#beauty",
        "#fitness",
        "#food",
        "#selfie",
        "#me",
        "#instalike",
        "#girl",
        "#friends",
        "#fun",
        "#photo",
      ];

  const storageDir = process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR)
    : path.join(process.cwd(), "storage");

  const encryptionKey =
    process.env.ENCRYPTION_KEY ?? randomBytes(32).toString("ascii");

  const port = parseInt(process.env.PORT ?? "5555");

  const noAuth = parseInt(process.env.NO_AUTH ?? "0") === 1;

  const assets = path.join(__dirname, '..', 'assets')

  return {
    port: port,
    encryptionKey: encryptionKey,
    assets: assets,
    storageDir: storageDir,
    tagsList: tagsList,
    noAuth: noAuth
  };
}

dotenv.config();

export default config();
