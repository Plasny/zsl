import { createSlice } from "@reduxjs/toolkit";

export type userType = {
  loggedIn: boolean;
  id?: string;
  authToken?: string;
  pictureUrl?: string;
};

const userSlice = createSlice({
  name: "user id and token",
  initialState: {
    loggedIn: false,
    id: undefined,
    authToken: undefined,
  },
  reducers: {
    login: (state: userType, action) => {
      const { id, token, pictureUrl } = action.payload;
      (state.loggedIn = true),
        (state.id = id),
        (state.authToken = token),
        (state.pictureUrl = pictureUrl);
    },
    logout: (state: userType) => {
      (state.loggedIn = false),
        (state.id = undefined),
        (state.authToken = undefined),
        (state.pictureUrl = undefined);
    },
  },
});

export default userSlice;
export const { login, logout } = userSlice.actions;
