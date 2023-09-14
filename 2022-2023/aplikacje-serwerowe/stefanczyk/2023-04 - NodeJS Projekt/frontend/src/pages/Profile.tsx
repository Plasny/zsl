import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { storeType } from "../store/store";
import Post from "../components/Post";
import type { photo } from "../helpers/photoType";
import getPhoto from "../helpers/getLocalImgUrl";
import "./Feed.css";
import "./Profile.css";
import ProfileEl, { profileData } from "../components/ProfileEl";
import { checkLogin } from "../components/CheckLogin";

function OtherProfiles() {
  const navigate = useNavigate();
  let { userId } = useParams();
  let editable = false;
  const user = useSelector((state) => (state as storeType).user);

  if (userId === user.id) navigate("/profile");
  if (userId === undefined) {
    userId = user.id;
    editable = true;
  }

  const [posts, setPosts] = useState([
    <p style={{ textAlign: "center" }} key={0}>
      Loading...
    </p>,
  ]);
  const [userData, setUserData] = useState({
    loaded: false,
    profilePic: ["", ""],
    name: "",
    surname: "",
    description: "",
  } as profileData);

  const loadPosts = useCallback(async () => {
    const res = await fetch("/api/photos/user/" + userId, {
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

  const loadUser = useCallback(async () => {
    const dataRes = await fetch("/api/profile/" + userId, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + user.authToken,
      },
    });
    if (dataRes.status !== 200) return;
    const data = await dataRes.json();

    const picRes = await fetch("/api/profile/picture/" + userId, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + user.authToken,
      },
    });
    if (picRes.status !== 200) return;
    const pic = await picRes.blob();
    const imgUrl = await getPhoto(pic);

    // console.log(imgUrl)
    setUserData({
      loaded: true,
      profilePic: Object.values(imgUrl),
      name: data.firstName,
      surname: data.lastName,
      description: data.aboutMe,
    });
  }, [getPhoto]);

  useEffect(() => {
    loadPosts();
    loadUser();
  }, []);

  return checkLogin(
    <>
      <div className="FeedContainer">
        <ProfileEl
          userData={userData}
          userStore={user}
          editable={editable}
          reloadCallback={() => loadUser()}
        />
        <div className="feed">{posts}</div>
      </div>
    </>
  );
}

export default OtherProfiles;
