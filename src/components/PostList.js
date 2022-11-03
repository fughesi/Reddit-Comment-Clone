import React, { useEffect, useState } from "react";
import { getPosts } from "../services/posts";

export function PostList() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    getPosts(setPosts);
  }, []);

  return <div>{JSON.stringify(posts)}</div>;
}
