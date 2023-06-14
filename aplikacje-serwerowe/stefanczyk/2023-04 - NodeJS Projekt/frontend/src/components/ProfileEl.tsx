import { useRef, useState } from "react";
import { updateProfilePic, userType } from "../store/userSlice";
import { useDispatch } from "react-redux";
import closeBtn from "../assets/close-button.svg";
import editBtn from "../assets/edit-icon-green.png";

export type profileData = {
  loaded: boolean;
  profilePic: string[];
  name: string;
  surname: string;
  description: string;
};

function ProfileEl(props: {
  userData: profileData;
  userStore: userType;
  editable: boolean;
  reloadCallback: () => void;
}) {
  const dispatch = useDispatch();
  const fileInput = useRef(null);
  const [photoUrl, setPhotoUrl] = useState(props.userStore.pictureUrl);
  const [editMenu, showEditMenu] = useState(false);
  const [bannerOpacity, setOpacity] = useState("none");
  const [changed, newPhoto] = useState(false);

  let options = <> </>;
  if (props.editable)
    options = (
      <img
        src={editBtn}
        onClick={() => showEditMenu(true)}
        alt="Edit"
        style={{
          width: "2rem",
          border: "none",
          position: "absolute",
          right: 0,
          margin: 0,
        }}
      />
    );

  const [currentPhoto, setCurentPhoto] = useState(1);
  const flipPhoto = () => {
    if (currentPhoto === 0) setCurentPhoto(1);
    else setCurentPhoto(0);
  };

  const updatePhoto = () => {
    // @ts-ignore
    setPhotoUrl(URL.createObjectURL(fileInput.current.files[0]));
    newPhoto(true);
  };

  const saveProfileData = (e: Event) => {
    e.preventDefault();
    const promises = [];

    if (changed) {
      const formData = new FormData(e.target! as HTMLFormElement);
      const picturePromise = fetch("/api/profile/picture", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + props.userStore.authToken,
        },
        body: formData,
      });

      promises.push(picturePromise);
    }

    const promise = fetch("/api/profile", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + props.userStore.authToken,
      },
      body: JSON.stringify({
        newName: (document.getElementById("profileElName")! as HTMLInputElement)
          .value,
        newSurname: (
          document.getElementById("profileElSurname")! as HTMLInputElement
        ).value,
        newAboutMe: (
          document.getElementById("profileElDescription")! as HTMLInputElement
        ).value,
      }),
    });
    promises.push(promise);

    Promise.all(promises).then(() => {
      fetch("/api/profile/picture/" + props.userStore.id, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + props.userStore.authToken,
        },
      })
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          dispatch(updateProfilePic(url));
        })
        .catch((err) => console.warn(err));

      newPhoto(false);
      showEditMenu(false);
      props.reloadCallback();
    });
  };

  if (editMenu)
    return (
      <div className="profileTop">
        <img
          src={closeBtn}
          alt="Close"
          onClick={() => showEditMenu(false)}
          style={{
            width: "2rem",
            border: "none",
            position: "absolute",
            right: 0,
            margin: 0,
          }}
        />

        <form
          // @ts-ignore
          onSubmit={saveProfileData}
          style={{
            height: "100%",
            width: "100%",
            display: "inherit",
            flexDirection: "inherit",
            alignItems: "inherit",
          }}
        >
          <label
            style={{
              display: "block",
              width: "70%",
              border: "2px solid var(--accent-color)",
              marginTop: "1rem",
            }}
          >
            <img
              src={photoUrl}
              alt="Profile picture"
              onMouseEnter={() => setOpacity("none")}
              onMouseLeave={() => setOpacity("block")}
              style={{ marginBottom: "-9px", width: "100%" }}
            />
            <p
              style={{
                position: "absolute",
                width: "69%",
                top: "28%",
                textAlign: "center",
                backgroundColor: "var(--background-color)",
                display: bannerOpacity,
              }}
            >
              Click to edit
            </p>
            <input
              name="file"
              ref={fileInput}
              type="file"
              style={{ display: "none" }}
              onChange={updatePhoto}
            />
          </label>

          <label htmlFor="profileElName">Imię</label>
          <input
            type="text"
            id="profileElName"
            name="newName"
            defaultValue={props.userData.name}
          />

          <label htmlFor="profileElSurname">Nazwisko</label>
          <input
            type="text"
            id="profileElSurname"
            name="newSurname"
            defaultValue={props.userData.surname}
          />

          <label htmlFor="profileElDescription">O sobie</label>
          <textarea
            id="profileElDescription"
            name="newAboutMe"
            defaultValue={props.userData.description}
          ></textarea>

          <button>Zapisz</button>
        </form>
      </div>
    );

  return (
    <div className="profileTop">
      {options}
      <img
        src={props.userData.profilePic[currentPhoto]}
        onClick={flipPhoto}
        alt="Profile picture"
      />
      <p className="name">
        {props.userData.name} {props.userData.surname}
      </p>
      <div className="description">{props.userData.description}</div>
    </div>
  );
}

export default ProfileEl;
