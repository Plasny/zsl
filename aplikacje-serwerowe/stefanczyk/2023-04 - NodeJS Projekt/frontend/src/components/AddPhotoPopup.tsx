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
  const user = useSelector((state) => (state as storeType).user);
  const popup = useRef(null);
  const fileInput = useRef(null);
  const defaultInput = (
    <label className="imgUpload" htmlFor="imageInput">
      <AddBtn width="2.5rem" height="2.5rem" />
    </label>
  );
  const [photoPreview, setPreview] = useState(defaultInput);
  const tagsRef = useRef(null);
  const [tags, updateTags] = useState([] as string[]);
  const descriptionRef = useRef(null);

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
    const formData = new FormData(
      document.getElementById("addPhotoForm")! as HTMLFormElement
    );
    formData.delete("tags");
    formData.append("album", "default");

    fetch("/api/photos", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + user.authToken,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        fetch("/api/photos/tags", {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + user.authToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: res.returnValue!,
            tags: tags,
          }),
        }).then(props.reloadAfterUpload);
      });

    setPreview(defaultInput);
  };

  const setTags = () => {
    const el = tagsRef.current! as HTMLInputElement;
    const rx = /^(\S+)\s/;
    const arr = el.value.match(rx);

    if (arr) {
      const tag = arr[0].charAt(0) === "#" ? arr[0] : "#" + arr[0];
      el.value = el.value.replace(rx, "");

      if (!tags.includes(tag)) updateTags([...tags, tag]);

      el.focus();
    }
  };

  const backspaceHandle = (e: KeyboardEvent) => {
    const el = tagsRef.current! as HTMLInputElement;

    if (el.selectionStart === 0 && e.key === "Backspace") {
      tags.pop();
      updateTags([...tags]);
    }
  };

  const delTag = (i: number) => {
    console.log(i);
    tags.splice(i, 1);
    updateTags([...tags]);
  };

  let tagsEls: JSX.Element[] = [];
  for (const i in tags) {
    if (tags[i] !== "")
      tagsEls.push(
        <span className="tag" onClick={() => delTag(parseInt(i))}>
          {tags[i]}
        </span>
      );
  }

  return (
    <dialog className="newPhoto" ref={popup}>
      <div style={{ margin: "1rem" }}>
        <form method="dialog" onSubmit={addPhoto} id="addPhotoForm">
          <CloseBtn
            width="1.5rem"
            height="1.5rem"
            style={{ position: "absolute", right: 0, top: 0 }}
            onClick={(e: Event) => {
              setPreview(defaultInput);
              updateTags([]);
              (descriptionRef.current! as HTMLInputElement).value = "";
              (popup.current! as HTMLDialogElement).close();
              (props.makeInvisible as Function)();
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

          <label htmlFor="imageDescription">Description</label>
          <input
            className="input"
            type="text"
            name="description"
            id="imageDescription"
            ref={descriptionRef}
          />

          <label htmlFor="imageTags">Tags</label>
          <label className="input">
            {tagsEls}
            <input
              className="tagsInput"
              type="text"
              name="tags"
              id="imageTags"
              ref={tagsRef}
              onChange={setTags}
              // @ts-ignore
              onKeyDown={backspaceHandle}
            />
          </label>

          <button className="bigBtn">Dodaj</button>
        </form>
      </div>
    </dialog>
  );
}

export default AddPhotoPopup;
