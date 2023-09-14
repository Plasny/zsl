import "./posts.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function PostItem(props) {
  let link;

  if (props.link)
    link = (
      <Link to={"/posts/" + props.id} className="link">
        Read more
      </Link>
    );

  return (
    <div className="post">
      <h3>{props.title}</h3>
      <div className="hr"></div>
      <p>{props.body}</p>

      {link}
    </div>
  );
}

export function Post() {
  const { id } = useParams();
  const [postData, setPostData] = useState({});

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "GET",
      });

      const data = await res.json();
      setPostData(data.find((el) => el.id === parseInt(id)));
    }

    fetchPosts();
  });

  const post = (
    <PostItem title={postData.title} body={postData.body} link={false} />
  );

  return (
    <main>
      <h2>Post {id}</h2>
      <div className="container">{post}</div>
    </main>
  );
}

export function PostsList() {
  const [posts, setPosts] = useState([]);
  const postEls = [];

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "GET",
      });
      const data = await res.json();
      setPosts(data);
    }

    fetchPosts();
  });

  for (const el of posts) {
    postEls.push(
      <PostItem
        key={el.id}
        id={el.id}
        title={el.title}
        body={el.body}
        link={true}
      />
    );
  }

  return (
    <main>
      <h2>Posts</h2>
      <div className="container">{postEls}</div>
    </main>
  );
}
