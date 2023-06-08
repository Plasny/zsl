export type tag = {
  id: number;
  name: string;
  // popularity: number;
};

export type photo = {
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
  id: string;
  lastChange: number;
  originalName: string | null;
  owner: string;
  storageId: string;
  tags: tag[];
};
