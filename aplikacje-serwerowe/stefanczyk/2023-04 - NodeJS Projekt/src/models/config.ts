import { readFileSync } from "fs";
import * as path from "path";
import { logger } from "../app";

/**
 * Type which represents configuration options for this app
 */
type configType = {
  /**
   * Path to directory in which to store all files
   */
  storageDir: string;
};

/**
 * Class which holds configuration options for this app. It is possible to set
 * them using config.json file placed in the directory from which the app is
 * started.
 */
class config {
  public readonly storageDir: string;
  private appPath: string;

  constructor() {
    this.appPath = process.cwd();

    let json: configType | null;
    try {
      json = JSON.parse(
        readFileSync(path.join(this.appPath, "config.json"), {
          encoding: "utf-8",
        })
      );
    } catch {
      json = null;
      console.log("No config.json or wrong formatting - using defaults");
    }

    const relativeDir = json?.storageDir
      ? path.resolve(json.storageDir)
      : path.join(this.appPath, "storage");
    this.storageDir = relativeDir;
  }
}

export default new config();
