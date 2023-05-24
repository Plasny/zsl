export type access = {

}

export type returnMsg = {
    error?: boolean;
    photoId?: string;
    message: string;
}

export type bufferAndMime = {
  file: Buffer | null;
  name: string | null;
  mime: string | null;
}
