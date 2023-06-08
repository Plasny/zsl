// @ts-ignore
import { ReactComponent as AddBtn } from "../assets/add-button.svg";
// @ts-ignore
import { ReactComponent as CloseBtn } from "../assets/close-button.svg";
import { useRef, ReactEventHandler, useEffect, useState } from "react";
import "./Popup.css";
import { useSelector } from "react-redux";
import { storeType } from "../store/store";

function AddPhotoPopup(props: {
  visible: boolean;
  makeInvisible: ReactEventHandler;
  reloadAfterUpload: () => void;
}) {
  const user = useSelector(state => (state as storeType).user)
  const popup = useRef(null);
  const fileInput = useRef(null);
  const defaultInput = (
    <label className="imgUpload" htmlFor="imageInput">
      <AddBtn width="2.5rem" height="2.5rem" />
    </label>
  );
  const [photoPreview, setPreview] = useState(defaultInput);

  if (props.visible) {
    (popup.current as HTMLDialogElement | null)?.removeAttribute("open");
    (popup.current as HTMLDialogElement | null)?.showModal();
  }

  const updateInput = () => {
    // @ts-ignore
    if (fileInput.current && fileInput.current.files[0]) {
      setPreview(
        <div className="imgUpload">
          <img
            // @ts-ignore
            src={URL.createObjectURL(fileInput.current.files[0])}
            style={{ width: "100%" }}
            alt="Uploaded image"
          />
          <div
            style={{
              borderTop: "2px solid var(--accent-color)",
              width: "100%",
              textAlign: "center",
            }}
          >
            {/* @ts-ignore */}
            {fileInput.current.files[0].name}
          </div>
        </div>
      );
      return;
    }

    setPreview(defaultInput);
  };

  const addPhoto = async () => {
    const formData = new FormData(document.getElementById('addPhotoForm')! as HTMLFormElement)
    formData.delete('tags');
    formData.append('album', 'default');

    fetch('/api/photos', {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + user.authToken,
      },
      body: formData
    }).then(res => res.json())
    .then(props.reloadAfterUpload)
    .then(res => console.log(res))

    setPreview(defaultInput);
  };

  return (
    <dialog className="newPhoto" ref={popup} onClose={props.makeInvisible}>
      <div style={{ margin: "1rem" }}>
        <form method="dialog" onSubmit={addPhoto} id="addPhotoForm">
          <CloseBtn
            width="1.5rem"
            height="1.5rem"
            style={{ position: "absolute", right: 0, top: 0 }}
            onClick={() => {
              setPreview(defaultInput);
              // @ts-ignore
              popup.current.close();
              // @ts-ignore
              props.makeInvisible();
            }}
          />

          <p>Dodaj zdjęcie</p>

          <label htmlFor="imageInput">Zdjęcie</label>
          <input
            type="file"
            name="file"
            id="imageInput"
            ref={fileInput}
            onChange={updateInput}
          />

          {photoPreview}

          {/* <label htmlFor="imageAlbum">Album</label>
          <input type="text" name="album" id="imageAlbum" /> */}

          {/* // todo fix focus */}

          <label htmlFor="imageDescription">Description</label>
          <input type="text" name="description" id="imageDescription" />

          <label htmlFor="imageTags">Tags</label>
          <input type="text" name="tags" id="imageTags" />

          <button className="bigBtn">Dodaj</button>
        </form>
        {/* <button onClick={() => (popup.current as HTMLDialogElement | null)?.close()}>Close</button> */}
      </div>
    </dialog>
  );
}

export default AddPhotoPopup;
