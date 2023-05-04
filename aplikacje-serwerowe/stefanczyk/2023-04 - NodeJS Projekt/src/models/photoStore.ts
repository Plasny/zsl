/*
each user -> list of albums

albums -> list of photos

each photo -> list of tags, history, etc.

tag, date -> list of photos
*/

import formidable from "formidable";
import { deleteFile } from "./fsOperations";
import { access, returnMsg } from "./types";

type photo = {
  // _acc: access;
  // _owner: string;
  _mimetype: string | null;

  album: string;
  history: [
    {
      status: string;
      storageId: string;
      timestamp: number;
    }
  ];
  id: string;

  /**
   * Position of last change in history
   */
  lastChange: number;
  originalName: string | null;
  storageId: string;
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
   * Method which returns all data stored in photo store
   * @returns all data stored in photo store or error message
   */
  getPhoto(id: string): photo | returnMsg {
    // we need a copy (clone) of error message object not a reference to it
    if (!this.store.hasOwnProperty(id)) return Object.assign({}, this.noAccErr);
    return this.store[id];
  }

  /**
   * Method which deletes photo from photo store
   * @returns ok or error message
   */
  deletePhoto(id: string): returnMsg {
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
  private createId(len: number = 5): string {
    let id: string;

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

  changePhoto(id: string, status: string, file: formidable.File): returnMsg {
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
   * @returns id of the inserted photo
   */
  registerPhoto(file: formidable.File, album: string): returnMsg {
    const key: string = this.createId();

    this.store[key] = {
      // _acc: "all",
      // _owner: "",
      _mimetype: file.mimetype,
      album: album,
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
      storageId: file.newFilename,
    };

    return {
      photoId: key,
      message: "Photo was succesfully registered."
    }
  }
}

export default new photoStore();
