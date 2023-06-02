export type access = {

}

export type returnMsg = {
    error?: boolean;
    httpCode?: number;
    returnValue?: string;
    message: string;
}

export type bufferAndMime = {
  file: Buffer | null;
  name: string | null;
  mime: string | null;
}

export type applyFilter = {
  photoId: string;
  filter: string;
  filterArgs?: any; 
}

export type jwtActions = "confirmAccount" | "verifyUser";

export type jwtContents = {
  email: string;
  action: jwtActions;
}
