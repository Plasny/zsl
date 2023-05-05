import { readFileSync } from "fs";
import * as path from "path";

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
};

/**
 * Function which returns configuration options for this app. It is possible to
 * set them using config.json file placed in the directory from which the app is
 * started.
 */
function config(): configType {
  const appPath = process.cwd();

  let json: configType | null;
  try {
    json = JSON.parse(
      readFileSync(path.join(appPath, "config.json"), {
        encoding: "utf-8",
      })
    );
  } catch {
    json = null;
    console.log("No config.json or wrong formatting. Using defaults.");
  }

  const relativeDir = json?.storageDir
    ? path.resolve(json.storageDir)
    : path.join(appPath, "storage");

  const tagsList = json?.tagsList
    ? json.tagsList
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

  return {
    storageDir: relativeDir,
    tagsList: tagsList,
  };
}

export default config();
