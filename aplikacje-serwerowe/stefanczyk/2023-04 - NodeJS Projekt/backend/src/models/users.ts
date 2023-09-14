import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { returnMsg, jwtActions, jwtContents, bufferAndMime } from "./types";
import config from "./config";
import { logger } from "../app";
import path from "path";
import { readFile } from "fs/promises";

type User = {
  confirmed: boolean;
  name: string;
  lastName: string;
  email: string;
  passwordHash: string;
  profilePicture: {
    path: string;
    mime: string;
  };
  aboutMe: string;
};

/**
 * Function to check whether you can access resource
 * @param token jwt user verification token
 * @returns whether you can access or not
 */
export function verifyRequest(token: string): boolean {
  try {
    const decoded = jwt.verify(token, config.encryptionKey) as jwtContents;
    if (decoded.action === "verifyUser") return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Function which retrives users email from jwt token
 * @param token jwt token with user data
 * @returns users email
 */
export function getUserFromToken(token: string): string {
  try {
    const decoded = jwt.verify(token, config.encryptionKey) as jwtContents;
    return decoded.email;
  } catch(err) {
    logger.warn('wrong jwt', err);
    return ''
  }
}

class userStore {
  private map: Map<string, User> = new Map();
  private readonly seedLength = 10;
  private readonly wrongLogin: returnMsg = {
    httpCode: 401,
    message: "Wrong credentials!",
  };
  private readonly loginIsTaken: returnMsg = {
    httpCode: 409,
    message: "User with such email already exists.",
  };
  private readonly wrongToken: returnMsg = {
    httpCode: 401,
    message:
      "Something is wrong with your token, try again later. You can check whether it is expired or has all apropriate actions.",
  };

  /**
   * Method which creates user token with two params: email and action
   * @param email users email
   * @param action one of available actions for user
   * @return jwt with email and action
   */
  private async createUserToken(
    email: string,
    action: jwtActions
  ): Promise<string> {
    const token = await jwt.sign(
      {
        email: email,
        action: action,
      },
      config.encryptionKey,
      {
        expiresIn: "1h",
      }
    );

    return token;
  }

  /**
   * Method used for registering user in this app. Once you register your user, you need to confirm it.
   * @param name users first name
   * @param surname users surname
   * @param email users email
   * @param password users clear text password
   * @returns return message
   */
  async registerUser(
    name: string,
    surname: string,
    email: string,
    password: string
  ): Promise<returnMsg> {
    if (this.map.has(email)) return Object.assign({}, this.loginIsTaken);

    const hash = await bcrypt.hash(password, this.seedLength);
    this.map.set(email, {
      confirmed: false,
      name: name,
      lastName: surname,
      email: email,
      passwordHash: hash,
      profilePicture: {
        path: path.join(config.assets, "tempProfilePicture.svg"),
        mime: "image/svg+xml"
      },
      aboutMe: ""
    });

    logger.log(`User registered with email: ${email}`);

    return {
      message: "User registered. Now you need to activate your account.",
      returnValue: await this.createUserToken(email, "confirmAccount"),
    };
  }

  /**
   * Method which enables user to confirm his registration
   * @param token jwt token recived after registering the user
   * @returns return message
   */
  confirmUser(token: string): returnMsg {
    try {
      const decoded = jwt.verify(token, config.encryptionKey) as jwtContents;
      if (decoded.action != "confirmAccount" || !this.map.has(decoded.email))
        return Object.assign({}, this.wrongToken);

      let userObj = this.map.get(decoded.email)!;
      userObj.confirmed = true;
      this.map.set(decoded.email, userObj);

      logger.log(`User with email: ${decoded.email} completed registration`);

      return {
        message: "Your account is now confirmed",
      };
    } catch (err) {
      return Object.assign({}, this.wrongToken);
    }
  }

  /**
   * Method which enables user to use other api endpoints in this app with token it returns
   * @param email users email
   * @param password users clear text password
   * @returns return message and token
   */
  async loginUser(email: string, password: string): Promise<returnMsg> {
    if (!this.map.has(email)) return Object.assign({}, this.wrongLogin);

    const userObj = this.map.get(email)!;

    if (userObj.confirmed === false)
      return {
        error: true,
        message:
          "User registration not confirmed. Confirm your registration to proceed.",
      };

    const correctPass = await bcrypt.compare(password, userObj.passwordHash);
    if (!correctPass) return Object.assign({}, this.wrongLogin);

    logger.log(`User with email: ${userObj.email} logged in.`);

    return {
      message: "User logged in. Autorization token is in returnValue.",
      returnValue: await this.createUserToken(email, "verifyUser"),
    };
  }

  /**
   * Method which retrives name, surname, email, etc. for a given email
   * @param email users email
   * @returns name, surname and email of the user or error message
   */
  retriveProfileData(
    email: string
  ): returnMsg | { firstName: string; lastName: string; email: string, aboutMe: string } {
    if (!this.map.has(email))
      return {
        httpCode: 404,
        message: "No such user.",
      };

    const user = this.map.get(email)!;

    return {
      firstName: user.name,
      lastName: user.lastName,
      email: user.email,
      aboutMe: user.aboutMe
    };
  }

  /**
   * Method which retrives profile picture and returns it
   * @param email users email
   * @returns file data or error message
   */
  async retriveProfilePicture(email: string): Promise<returnMsg | bufferAndMime> {
    if (!this.map.has(email))
      return {
        httpCode: 404,
        message: "No such user."
      };

    const user = this.map.get(email)!;
    let pic;

    try {
      pic =  await readFile(user.profilePicture.path);
    } catch {
      return {
        error: true,
        message: "Picture not found"
      }
    }

    return {
      mime: user.profilePicture.mime,
      name: "profilePicture",
      file: pic
    }
  }

  /**
   * Method which edits user data in the map
   * @param token jwt token
   * @param newName new name for the user
   * @param newSurname new surname for the user
   * @param newEmail new email for the user
   * @returns ok or error message
   */
  changeData(
    token: string,
    newName?: string,
    newSurname?: string,
    newEmail?: string,
    newAboutMe?: string,
  ): returnMsg {
    try {
      const decoded = jwt.verify(token, config.encryptionKey) as jwtContents;

      if (!this.map.has(decoded.email)) return Object.assign({}, this.wrongToken);

      const user = this.map.get(decoded.email)!;
      if (newName) user.name = newName;
      if (newSurname) user.lastName = newSurname;
      if(newAboutMe) user.aboutMe = newAboutMe;
      if (newEmail) {
        user.email = newEmail;
        this.map.set(newEmail, user);
        this.map.delete(decoded.email);
        logger.log(`User changed his email from ${decoded.email} to ${newEmail}`)
        console.log(this.map)
      } else {
        this.map.set(decoded.email, user);
      }

      return {
        message: "All changes saved."
      }
    } catch {
      return Object.assign({}, this.wrongToken);
    }
  }

  /**
   * Method which sets new profile picture
   * @param token jwt users token with his/her email
   * @param mime miem type of the photo
   * @param storageId where the file was saved
   * @returns ok, error message
   */
  setProfilePicture(
    token: string,
    mime: string,
    storageId: string
  ): returnMsg {
    try {
      const decoded = jwt.verify(token, config.encryptionKey) as jwtContents;

      if (!this.map.has(decoded.email)) return Object.assign({}, this.wrongToken);
      const user = this.map.get(decoded.email)!;
      user.profilePicture.mime = mime;
      user.profilePicture.path = path.join(config.storageDir, storageId);

      return {
        message: "Profile picture set corectly"
      }
    } catch {
      return Object.assign({}, this.wrongToken);
    }
  }
}

export default new userStore();
