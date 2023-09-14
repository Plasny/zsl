import { storeType } from "./store";

export function saveToStorage(state: storeType) {
  try {
    localStorage.setItem("appState", JSON.stringify(state));
    console.log("App state saved :)");
  } catch (err) {
    console.warn(err);
  }
}

export async function loadFromStorage() {
  try {
    const serialisedState = localStorage.getItem("appState");
    if (serialisedState === null) return undefined;

    const state: storeType = JSON.parse(serialisedState);
    if (state.user.loggedIn === false) return state;

    const getImgRes = await fetch("/api/profile/picture/" + state.user.id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + state.user.authToken,
      },
    });

    if (getImgRes.status !== 200) {
      state.user = { loggedIn: false };
      return state;
    }

    const imgUrl = URL.createObjectURL(await getImgRes.blob());
    state.user.pictureUrl = imgUrl;

    return state;
  } catch (err) {
    console.warn(err);
    return undefined;
  }
}
