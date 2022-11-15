import "./App.css";
import { Route, Routes } from "react-router-dom";
import { PostList } from "./components/PostList";
import { PostProvider } from "./contexts/PostContext";
import { Post } from "./components/Post";
import { Signature } from "./components/signature";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route
          path="/posts/:id"
          element={
            <PostProvider>
              <Post />
            </PostProvider>
          }
        />
      </Routes>

      <Signature />
    </div>
  );
}

export default App;
