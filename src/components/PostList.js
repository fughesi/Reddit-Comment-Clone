import React, { useEffect, useState } from "react";
import { getPosts } from "../services/posts";

export function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <>
      {posts.map((i) => {
        return (
          <h1 key={i.id}>
            <a href={`/posts/${i.id}`}>{i.title}</a>
          </h1>
        );
      })}
    </>
  );
}
