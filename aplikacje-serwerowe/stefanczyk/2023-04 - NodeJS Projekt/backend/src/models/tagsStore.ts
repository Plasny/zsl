import config from "../models/config";
import { returnMsg } from "./types";

export type tag = {
  id: number;
  name: string;
  // popularity: number;
};

class tagsStore {
  private tagsRaw: string[];
  private tags: tag[] = [];
  private lastId: number;

  constructor(tags: string[]) {
    this.tagsRaw = tags;
    this.tagsRaw.forEach((name, index) => {
      this.tags.push({
        id: index,
        name: name,
      });
    });

    this.lastId = this.tagsRaw.length - 1;
  }

  /**
   * Method which returns all data stored in tag list
   * @returns all data stored in tag list
   */
  getAllTags() {
    return this.tags;
  }

  /**
   * Method which returns a raw list of tags
   * @returns a raw list of tags
   */
  getRawTags() {
    return this.tagsRaw;
  }

  /**
   * Method which returns data for a tag with requested id
   * @returns tags data stored in tag list or error message
   */
  getTagById(id: number): tag | returnMsg {
    if (!(id in this.tags))
      return {
        error: true,
        message: "No tag with such id!",
      };

    return this.tags[id];
  }

  /**
   * Method which returns data for a tag with requested name.
   * It can alse create tags if neaded.
   * @param name tag name
   * @param createTag true to create tag if it doesn't exist, false to display
   * an error message in such case
   * @returns tag stored in tag list or an error message
   */
  getTagByName(
    name: string,
    createTag: boolean = false
  ): tag | returnMsg {
    const id = this.tagsRaw.indexOf(name);

    if (id !== -1) return this.tags[id];

    if (createTag === true) {
      this.tagsRaw.push(name);
      this.tags.push({
        id: ++this.lastId,
        name: name,
      });

      return this.tags[this.lastId];
    } else {
      return {
        error: true,
        message: "No tag with such name!",
      };
    }
  }

  /**
   * Method which inserts new tag to a list or returns a message that such tag
   * already exists.
   * @param name Tag name
   * @returns Message with information wheter tag was added or already exists.
   */
  newTag(name: string): returnMsg {
    if (this.tagsRaw.indexOf(name) !== -1)
      return {
        message: "Tag already exists.",
      };

    this.tagsRaw.push(name);
    this.tags.push({
      id: ++this.lastId,
      name: name,
    });

    return {
      message: "Tag added.",
    };
  }
}

export default new tagsStore(config.tagsList);
