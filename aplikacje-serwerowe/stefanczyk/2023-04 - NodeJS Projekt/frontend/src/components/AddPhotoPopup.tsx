// @ts-ignore
import { ReactComponent as AddBtn } from "../assets/add-button.svg";
// @ts-ignore
import { ReactComponent as CloseBtn } from "../assets/close-button.svg";
import { useRef, ReactEventHandler, useEffect, useState } from "react";
import "./Popup.css";
import { useSelector } from "react-redux";
import { storeType } from "../store/store";
import { imgDataLite } from "../pages/Feed";

function AddPhotoPopup(props: {
  visible: boolean;
  makeInvisible: (imgData?: imgDataLite) => void;
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
  const [imgUrl, setImgUrl] = useState("");

  if (props.visible) {
    (popup.current as HTMLDialogElement | null)?.removeAttribute("open");
    (popup.current as HTMLDialogElement | null)?.showModal();
  }

  useEffect(() => {
    if (imgUrl !== "") {
      setPreview(
        <>
          <label htmlFor="imageInput" className="imgUpload">
            <img src={imgUrl} style={{ width: "100%" }} alt="Uploaded image" />
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
          </label>
        </>
      );
    }
  }, [imgUrl]);

  const closeAndClear = (photoId?: string) => {
    setPreview(defaultInput);
    updateTags([]);
    (descriptionRef.current! as HTMLInputElement).value = "";
    (fileInput.current! as HTMLInputElement).value = "";
    (popup.current! as HTMLDialogElement).close();
    if(photoId)
      props.makeInvisible({url: imgUrl, id: photoId});
    else
      props.makeInvisible();
  };

  const addPhoto = async () => {
    const formData = new FormData(
      document.getElementById("addPhotoForm")! as HTMLFormElement
    );
    formData.delete("tags");
    formData.append("album", "default");

    const promises = [];
    const res = await fetch("/api/photos", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + user.authToken,
      },
      body: formData,
    }).then((res) => res.json());

    const photoId = res.returnValue!

    if (tags.length > 0)
      promises.push(
        fetch("/api/photos/tags", {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + user.authToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: photoId,
            tags: tags,
          }),
        })
      );

    Promise.all(promises).then(props.reloadAfterUpload);
    closeAndClear(photoId);
  };


  const updateInput = () => {
    if (
      fileInput.current &&
      (fileInput.current! as HTMLInputElement).files![0]
    ) {
      setImgUrl(
        URL.createObjectURL((fileInput.current! as HTMLInputElement).files![0])
      );
      return;
    }

    setPreview(defaultInput);
    setImgUrl("");
  };

  /// <---------- tags ----------<

  const setTags = () => {
    const el = tagsRef.current! as HTMLInputElement;
    const rx = /^(\S+)\s/;
    const arr = el.value.match(rx);

    if (arr) {
      const tag = arr[0].charAt(0) === "#" ? arr[0] : "#" + arr[0];
      el.value = el.value.replace(rx, "");

      if (!tags.includes(tag)) updateTags([...tags, tag]);

      setTimeout(() => el.focus(), 0);
    }
  };

  const backspaceHandle = (e: KeyboardEvent) => {
    const el = tagsRef.current! as HTMLInputElement;

    if (el.selectionStart === 0 && e.key === "Backspace") {
      tags.pop();
      updateTags([...tags]);

      setTimeout(() => el.focus(), 0);
    }
  };

  const delTag = (i: number) => {
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

  /// >---------- tags ---------->

  return (
      <dialog
        className="newPhoto"
        ref={popup}
        onClose={() => closeAndClear()}
      >
        <div style={{ margin: "1rem" }}>
          <form method="dialog" onSubmit={addPhoto} id="addPhotoForm">
            <CloseBtn
              width="1.5rem"
              height="1.5rem"
              style={{ position: "absolute", right: 0, top: 0 }}
              onClick={() => closeAndClear()}
            />

            <p>Dodaj zdjęcie</p>

            <label htmlFor="imageInput">Zdjęcie</label>
            <input
              type="file"
              name="file"
              id="imageInput"
              ref={fileInput}
              onChange={updateInput}
              required
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
