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

  return {
    storageDir: storageDir,
    tagsList: tagsList,
    encryptionKey: encryptionKey,
    port: port,
  };
}

dotenv.config();

export default config();
