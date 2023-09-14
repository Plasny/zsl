import { useCallback, useEffect, useState } from "react";
import AddPhotoPopup from "../components/AddPhotoPopup";
import { checkLogin } from "../components/CheckLogin";
import { useSelector } from "react-redux";
import { storeType } from "../store/store";
import Post from "../components/Post";
import type { photo } from "../helpers/photoType";
import getPhoto from "../helpers/getLocalImgUrl";
import "./Feed.css";
import PhotoEditor from "../components/PhotoEditor";

export type imgDataLite = {
  id: string;
  url: string;
};

function Feed() {
  const [popupVisible, changePopupVisibility] = useState(false);
  const [editorVisible, changeEditorVisibility] = useState(false);
  const [lastImgData, setImgData] = useState({ url: "", id: "" } as imgDataLite);
  const user = useSelector((state) => (state as storeType).user);
  const [posts, setPosts] = useState([
    <p style={{ textAlign: "center" }} key={0}>
      Loading...
    </p>,
  ]);

  const loadPosts = useCallback(async () => {
    const res = await fetch("/api/photos", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + user.authToken,
      },
    });
    if (res.status !== 200) return;

    const json = (await res.json()) as { [key: string]: photo };

    const postListLoading = Object.values(json)
      .reverse()
      .map(async (el) => {
        const imgUrls = await getPhoto(el.id);
        return (
          <Post
            key={el.id}
            data={el}
            originalImg={imgUrls.original}
            greenImg={imgUrls.green}
          />
        );
      });

    const postList = await Promise.all(postListLoading);

    setPosts(postList);
  }, [getPhoto]);

  useEffect(() => {
    loadPosts();
  }, []);

  return checkLogin(
    <>
      <div className="FeedContainer">
        <div className="feed">
          <button
            className="bigBtn"
            onClick={() => changePopupVisibility(true)}
          >
            Nowy post
          </button>
          <div className="message">
            Aby zobaczyć oryginalne zdjęcie kliknij na nie :)
          </div>
          {posts}
        </div>
      </div>
      <AddPhotoPopup
        visible={popupVisible}
        makeInvisible={(imgData?: imgDataLite) => {
          changePopupVisibility(false);
          if (imgData) {
            changeEditorVisibility(true);
            setImgData(imgData)
          }
        }}
        reloadAfterUpload={loadPosts}
      />
      <PhotoEditor
        imgUrl={lastImgData.url}
        photoId={lastImgData.id}
        visible={editorVisible}
        callback={() => {
          changeEditorVisibility(false);
          setImgData({ url: "", id: "" });
          loadPosts()
        }}
      />
    </>
  );
}

export default Feed;
