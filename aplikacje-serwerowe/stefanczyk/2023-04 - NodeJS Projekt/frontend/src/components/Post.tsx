import { useState } from "react";
import type { photo } from "../helpers/photoType";
import "./Post.css";

function Post(props: { data: photo; originalImg: string; greenImg: string }) {
  const [currentStyle, setCurentStyle] = useState(0);
  let tagsEl = <></>;

  const flipStyle = () => {
    if (currentStyle === 0) setCurentStyle(1);
    else setCurentStyle(0);
  };

  const img: string[] = [props.greenImg, props.originalImg];

  if (props.data.tags.length > 0) {
    tagsEl = (
      <>
        <div className="grTitle">
          <span className="author">{props.data.owner}</span>:/{props.data.album}
          $ cat tags
        </div>
        <div className="tags">{props.data.tags.toString()}</div>
      </>
    );
  }

  return (
    <div className="post">
      <img src={img[currentStyle]} width="100%" onClick={flipStyle} />
      <div className="postBottom">
        <div className="grTitle">
          <span className="author">{props.data.owner}</span>:/{props.data.album}
          $ open {props.data.originalName}
        </div>
        <div className="grTitle">
          <span className="author">{props.data.owner}</span>:/{props.data.album}
          $ cat description.txt
        </div>
        <div className="description">&gt; {props.data.description}</div>
      </div>
    </div>
  );
}

export default Post;
