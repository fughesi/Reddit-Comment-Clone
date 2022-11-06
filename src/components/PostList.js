import { getPosts } from "../services/posts";
import { Link } from "react-router-dom";
import "../App.css";
import { useAsync } from "../hooks/useAsync";

export function PostList() {
  const { loading, error, value: posts } = useAsync(getPosts);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1 className="error-msg">{error}</h1>;

  return (
    <>
      {posts.map((i) => {
        return (
          <h1 key={i.id}>
            <Link to={`/posts/${i.id}`}>{i.title}</Link>
          </h1>
        );
      })}
    </>
  );
}
