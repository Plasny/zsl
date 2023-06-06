import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import type { userType } from "./userSlice";
import { loadFromStorage, saveToStorage } from "./localStoragefacade";

export type storeType = {
  user: userType;
};

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
  // @ts-expect-error
  preloadedState: await loadFromStorage(),
});

store.subscribe(() => saveToStorage(store.getState()));

export default store;
