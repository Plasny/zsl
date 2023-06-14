import { useState } from "react";
import { Link } from "react-router-dom";
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

  const tags: JSX.Element[] = [];
  for (const tag of props.data.tags) {
    tags.push(<span className="tag">{tag.name}</span>);
  }

  if (props.data.tags.length > 0) {
    tagsEl = (
      <>
        <div className="grTitle">
          <Link className="author" to={"/profile/" + props.data.owner}>
            {props.data.owner}
          </Link>
          :/{props.data.album}$ cat {props.data.id}/tags.txt
        </div>
        <div className="tags">
          <span style={{ marginRight: "-0.2rem" }}>&gt; </span>
          {tags}
        </div>
      </>
    );
  }

  return (
    <div className="post">
      <img src={img[currentStyle]} width="100%" onClick={flipStyle} />
      <div className="postBottom">
        {/* <div className="grTitle">
          <Link className="author" to="/profile/{props.data.owner}">{props.data.owner}</Link>:/{props.data.album}
          $ open {props.data.originalName}
        </div> */}
        {tagsEl}
        <div className="grTitle">
          <Link className="author" to={"/profile/" + props.data.owner}>
            {props.data.owner}
          </Link>
          :/{props.data.album}$ cat {props.data.id}/description.txt
        </div>
        <div className="description">&gt; {props.data.description}</div>
      </div>
    </div>
  );
}

export default Post;
