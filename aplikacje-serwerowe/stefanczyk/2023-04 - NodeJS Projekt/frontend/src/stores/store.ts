import { createSlice, configureStore, Action } from "@reduxjs/toolkit";

type user = {
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
    login: (state: user, action) => {
      const { id, token, pictureUrl } = action.payload;
      (state.loggedIn = true),
        (state.id = id),
        (state.authToken = token),
        (state.pictureUrl = pictureUrl);
    },
    logout: (state: user) => {
      (state.loggedIn = false),
        (state.id = undefined),
        (state.authToken = undefined),
        (state.pictureUrl = undefined);
    },
  },
});

export default configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export const { login, logout } = userSlice.actions;
