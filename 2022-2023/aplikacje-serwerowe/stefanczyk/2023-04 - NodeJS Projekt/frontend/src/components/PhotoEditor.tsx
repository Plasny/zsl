// @ts-ignore
import { ReactComponent as CloseBtn } from "../assets/close-button.svg";
import { CSSProperties, useEffect, useRef, useState } from "react";
import "./Popup.css";
import { useSelector } from "react-redux";
import { storeType } from "../store/store";

function PhotoEditor(props: {
  imgUrl: string;
  photoId: string;
  visible: boolean;
  callback: Function;
}) {
  if (props.visible === false) return <></>;

  const user = useSelector((state) => (state as storeType).user);
  const editorRef = useRef(null);
  const imgRef = useRef(null);
  const [currentStyle, setStyle] = useState({} as CSSProperties);
  const [rotation, setRotation] = useState(0);
  const [operation, setOperation] = useState({});
  const [cropOpt, setCropOpt] = useState({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  });
  const [ratio, setRatio] = useState({ x: 1, y: 1 });
  const [cropOverlay, setCropOverlay] = useState(false);

  if (props.visible) {
    (editorRef.current as HTMLDialogElement | null)?.removeAttribute("open");
    (editorRef.current as HTMLDialogElement | null)?.showModal();
  }

  const closeAndClear = () => {
    (editorRef.current! as HTMLDialogElement).close();
    setStyle({});
    setOperation({});
    props.callback();
  };

  const save = () => {
    // @ts-ignore
    operation.photoId = props.photoId;
    console.log(operation);

    fetch("api/photos/filters", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + user.authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(operation),
    }).then(closeAndClear);
  };

  useEffect(() => {
    console.log(cropOpt);
    console.log(ratio);
  }, [cropOpt, ratio]);

  useEffect(() => {
    const el = imgRef.current! as HTMLImageElement;
    setRatio({
      x: el.naturalWidth / el.width,
      y: el.naturalHeight / el.height,
    });
  }, [imgRef.current]);

  return (
    <dialog className="editorPopup" ref={editorRef} onClose={closeAndClear}>
      <h2 style={{ width: "100%" }}>Edytor</h2>
      <CloseBtn
        width="2rem"
        height="2rem"
        style={{ position: "absolute", right: 0, top: 0 }}
        onClick={closeAndClear}
      />
      <div>
        <div
          style={{
            position: "relative",
            width: imgRef.current
              ? (imgRef.current as HTMLImageElement).width
              : "100%",
            margin: "auto",
          }}
        >
          <img
            src={props.imgUrl}
            alt="uploaded image"
            style={currentStyle}
            ref={imgRef}
          />
          {cropOverlay ? (
            <div
              style={{
                position: "absolute",
                top: cropOpt.top / ratio.y,
                height: cropOpt.height / ratio.y,
                left: cropOpt.left / ratio.x,
                width: cropOpt.width / ratio.x,
                border: "1px solid red",
              }}
            ></div>
          ) : (
            <></>
          )}
        </div>

        <div>
          <div
            style={{
              borderTop: "2px solid var(--accent-color)",
              marginTop: "-9px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setStyle({ transform: "scaleY(-1)" });
                setOperation({ filter: "flip" });
                setCropOverlay(false);
              }}
            >
              flip &#8597;
            </button>
            <button
              type="button"
              onClick={() => {
                setStyle({});
                setOperation({});
                setCropOverlay(false);
              }}
            >
              clear
            </button>
            <button
              type="button"
              onClick={() => {
                setStyle({ transform: "scaleX(-1)" });
                setOperation({ filter: "flop" });
                setCropOverlay(false);
              }}
            >
              flop &#8596;
            </button>
          </div>

          <div style={{ borderBottom: "2px solid var(--accent-color)" }}>
            <button
              type="button"
              onClick={() => {
                setStyle({ transform: `rotate(${rotation}deg)` });
                setOperation({ filter: "rotate", filterArgs: rotation });
                setCropOverlay(false);
              }}
            >
              rotate {rotation} &#8635;
            </button>
            <input
              type="range"
              min="0"
              max="360"
              defaultValue={rotation}
              // @ts-ignore
              onChange={(e) => setRotation(e.target.value)}
            />
          </div>

          <div style={{ borderBottom: "2px solid var(--accent-color)" }}>
            <button
              type="button"
              onClick={() => {
                setStyle({ filter: "grayscale(1)" });
                setOperation({ filter: "grayscale" });
                setCropOverlay(false);
              }}
            >
              grayscale
            </button>
            <button
              type="button"
              onClick={() => {
                setStyle({ filter: "invert(1)" });
                setOperation({ filter: "negate" });
                setCropOverlay(false);
              }}
            >
              negate???
            </button>
          </div>

          <div style={{ borderBottom: "2px solid var(--accent-color)" }}>
            <button
              type="button"
              onClick={() => {
                setStyle({});
                setCropOverlay(true);
                setOperation({ filter: "crop", filterArgs: cropOpt });
              }}
            >
              crop
            </button>
            <label>
              left:
              <input
                type="range"
                min="0"
                max={
                  imgRef.current
                    ? (imgRef.current as HTMLImageElement).width - 1
                    : 99
                }
                defaultValue={cropOpt.left}
                // @ts-ignore
                onChange={(e) => {
                  setCropOpt({
                    ...cropOpt,
                    left: Math.round(parseInt(e.target.value) * ratio.x),
                  });
                  setOperation({ filter: "crop", filterArgs: cropOpt });
                }}
              />
            </label>
            <label>
              width:
              <input
                type="range"
                min="0"
                max={
                  imgRef.current
                    ? (imgRef.current as HTMLImageElement).width -
                      cropOpt.left / ratio.x
                    : 100
                }
                defaultValue={cropOpt.left}
                // @ts-ignore
                onChange={(e) => {
                  setCropOpt({
                    ...cropOpt,
                    width: Math.round(parseInt(e.target.value) * ratio.x),
                  });
                  setOperation({ filter: "crop", filterArgs: cropOpt });
                }}
              />
            </label>
            <label>
              top:
              <input
                type="range"
                min="0"
                max={
                  imgRef.current
                    ? (imgRef.current as HTMLImageElement).height - 1
                    : 99
                }
                defaultValue={cropOpt.top}
                // @ts-ignore
                onChange={(e) => {
                  setCropOpt({
                    ...cropOpt,
                    top: Math.round(parseInt(e.target.value) * ratio.y),
                  });
                  setOperation({ filter: "crop", filterArgs: cropOpt });
                }}
              />
            </label>
            <label>
              height:
              <input
                type="range"
                min="0"
                max={
                  imgRef.current
                    ? (imgRef.current as HTMLImageElement).height -
                      cropOpt.top / ratio.y
                    : 100
                }
                defaultValue={cropOpt.top}
                // @ts-ignore
                onChange={(e) => {
                  setCropOpt({
                    ...cropOpt,
                    height: Math.round(parseInt(e.target.value) * ratio.y),
                  });
                  setOperation({ filter: "crop", filterArgs: cropOpt });
                }}
              />
            </label>
          </div>

          <button className="bigBtn" onClick={save} type="button">
            Zapisz
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default PhotoEditor;
