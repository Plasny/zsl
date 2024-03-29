/*
each user -> list of albums

albums -> list of photos

each photo -> list of tags, history, etc.

??? tag, date -> list of photos
*/

import formidable from "formidable";
import { deleteFile, getFileBuffer } from "./fsOperations";
import tagsStore, { tag } from "./tagsStore";
import { access, bufferAndMime, returnMsg } from "./types";
import { applyFilter, getMetadata } from "./photoOperations";
import sharp from "sharp";

/**
 * IDstring is a string made of current date, dash and a random number made
 * of *n* digits. Date and random number are transformed to strings. The final
 * result for *n = 5* looks like this:
 *
 * ```txt
 * lhajyjjj-41tri
 * ```
 *
 * You can create such id using the code below:
 *
 * ```ts
 * const n = 5;
 * const id = Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, n + 2);
 * ```
 */
type IDstring = string;

type photo = {
  // _acc: access;
  _mimetype: string | null;

  album: string;
  description: string;
  history: [
    {
      status: string;
      storageId: string;
      timestamp: number;
    }
  ];
  id: IDstring;

  /**
   * Position of last change in history
   */
  lastChange: number;
  originalName: string | null;
  owner: string;
  storageId: string;
  tags: tag[];
};

/**
 * Class used to create a single instance of photoStore for the whole app
 */
class photoStore {
  private store: { [key: string]: photo } = {};
  private readonly noAccErr: returnMsg = {
    error: true,
    message:
      "Photo of a given id doesn't exist or you don't have access to it.",
  };

  /**
   * Method which returns all data stored in photo store
   * @returns all data stored in photo store
   */
  getAllPhotos() {
    return this.store;
  }

  /**
   * Method which returns photos in a given album
   * @param album album name
   * @returns array of photos or empty array if given name doesn't exit
   */
  getPhotosInAlbum(album: string): photo[] {
    const arr = Object.values(this.store).filter(photo => photo.album === album)
    return arr
  }

  /**
   * Method which returns photos of a given user
   * @param album user id
   * @returns array of photos or empty array if user doesn't exit
   */
  getUsersPhotos(user: string): photo[] {
    const arr = Object.values(this.store).filter(photo => photo.owner === user)
    return arr
  }

  /**
   * Method which returns data of a requested photo, stored in photo store
   * @param id id of the photo
   * @returns photo data stored in photo store or error message
   */
  getPhoto(id: IDstring): photo | returnMsg {
    // we need a copy (clone) of error message object not a reference to it
    if (!this.store.hasOwnProperty(id)) return Object.assign({}, this.noAccErr);
    return this.store[id];
  }

  /**
   * Method which deletes photo from photo store
   * @param id id of the photo
   * @returns ok or error message
   */
  deletePhoto(id: IDstring): returnMsg {
    if (!this.store.hasOwnProperty(id)) return Object.assign({}, this.noAccErr);

    deleteFile(this.store[id].storageId);
    delete this.store[id];
    return {
      message: "Photo was deleted!",
    };
  }

  /**
   * Method which returns unique photo id
   * @param len length of identifier
   * @returns unique id
   */
  private createId(len: number = 5): IDstring {
    let id: IDstring;

    while (true) {
      id =
        Date.now().toString(36) +
        "-" +
        Math.random()
          .toString(36)
          .substring(2, len + 2);

      if (!this.store.hasOwnProperty(id)) break;
    }

    return id;
  }

  /**
   * Method which changes the default file of the photo object and adds new item
   * to its history
   * @param id id of the photo
   * @param status description or name of a change
   * @param file new file to use
   * @returns ok or error message
   */
  changePhoto(id: IDstring, status: string, file: formidable.File): returnMsg {
    if (!this.store.hasOwnProperty(id)) return Object.assign({}, this.noAccErr);

    this.store[id].history.push({
      status: status,
      storageId: file.newFilename,
      timestamp: Date.now(),
    });
    this.store[id].lastChange = this.store[id].history.length - 1;
    this.store[id].storageId = file.newFilename;

    return {
      message: "Photo was updated.",
    };
  }

  /**
   * Method which registers photo in to the store
   * @param file photo
   * @param album album in which photo is stored
   * @returns id of the inserted photo and a message
   */
  registerPhoto(file: formidable.File, album: string, user: string, description: string): returnMsg {
    const key: IDstring = this.createId();

    this.store[key] = {
      // _acc: "all",
      // _owner: "",
      _mimetype: file.mimetype,
      album: album,
      description: description,
      history: [
        {
          status: "original",
          storageId: file.newFilename,
          timestamp: Date.now(),
        },
      ],
      id: key,
      lastChange: 0,
      originalName: file.originalFilename,
      owner: user,
      storageId: file.newFilename,
      tags: [],
    };

    return {
      returnValue: key,
      message: "Photo was succesfully registered.",
    };
  }

  // ---------- refactor code under if relational databases will be used ----------

  /**
   * Method which adds tags to the photo with given id
   * @param id id of the photo
   * @param tagsList list of tag names to add to photo
   * @param change wheter to change all the tags of the photo or just add more
   * @returns ok or error message
   */
  addTagsToPhoto(
    id: IDstring,
    tagsList: string[],
    change: boolean = true
  ): returnMsg {
    if (!this.store.hasOwnProperty(id)) return Object.assign({}, this.noAccErr);

    if (change === true) this.store[id].tags = [];

    for (const tag of tagsList) {
      this.store[id].tags.push(tagsStore.getTagByName(tag, true) as tag);
    }

    return {
      message: "Tags were succesfuly added to the photo.",
    };
  }

  /**
   * Method which returns tags for the photo with a given id
   * @param id id of the photo
   * @returns tags and id or error message
   */
  getPhotosTags(id: IDstring) {
    if (!this.store.hasOwnProperty(id)) return Object.assign({}, this.noAccErr);

    return {
      id: id,
      tags: this.store[id].tags,
    };
  }


  /**
   * Method which returns photo file
   * @param id id of the photo
   * @param history version of the file
   */
  async getFile(id: IDstring, history?: number): Promise<returnMsg | bufferAndMime> {
    if (!this.store.hasOwnProperty(id)) return Object.assign({}, this.noAccErr);

    if(history === undefined)
      return {
        mime: this.store[id]._mimetype,
        name: this.store[id].originalName,
        file: await getFileBuffer(this.store[id].storageId)
      }

    if(history >= 0 && history < this.store[id].history.length)
      return {
        mime: this.store[id]._mimetype,
        name: this.store[id].originalName,
        file: await getFileBuffer(this.store[id].history[history].storageId)
      }

    return {
      error: true,
      message: "No file for this history index"
    }
  }

  /**
   * Method which returns metadata for a photo
   * @param id id of the photo
   * @param history version of the file
   */
  async getMetadata(id: IDstring, history?: number): Promise<returnMsg | sharp.Metadata> {
    if (!this.store.hasOwnProperty(id)) return Object.assign({}, this.noAccErr);

    if(history === undefined)
      return await getMetadata(this.store[id].storageId)

    if(history >= 0 && history < this.store[id].history.length)
      return await getMetadata(this.store[id].history[history].storageId)

    return {
      error: true,
      message: "No file for this history index"
    }
  }

  async applyFilter(id: IDstring, filter: string, filterArgs?: Object) {
    if (!this.store.hasOwnProperty(id)) return Object.assign({}, this.noAccErr);

    const obj = await applyFilter(this.store[id].storageId, filter, filterArgs);

    if(obj.error) return obj;

    this.store[id].history.push({
      status: filter,
      storageId: obj.returnValue!,
      timestamp: Date.now(),
    });
    this.store[id].lastChange = this.store[id].history.length - 1;
    this.store[id].storageId = obj.returnValue!;

    return {
      message: obj.message
    }
  }
}

export default new photoStore();
