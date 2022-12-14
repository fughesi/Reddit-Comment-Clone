import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts";

const Context = React.createContext();

export function usePost() {
  return useContext(Context);
}

export function PostProvider({ children }) {
  const { id } = useParams();
  const { loading, error, value: post } = useAsync(() => getPost(id), [id]);
  const [comments, setComments] = useState([]);

  const commentsByParentId = useMemo(() => {
    const group = {};
    comments.forEach((comment) => {
      group[comment.parentId] ||= [];
      group[comment.parentId].push(comment);
    });

    return group;
  }, [comments]);

  useEffect(() => {
    if (post?.comments == null) return;
    setComments(post.comments);
  }, [post?.comments]);

  function getReplies(parentId) {
    return commentsByParentId[parentId];
  }

  function createLocalComment(comment) {
    setComments((prev) => {
      return [comment, ...prev];
    });
  }

  function updateLocalComment(id, message) {
    setComments((prev) => {
      return prev.map((i) => {
        if (i.id === id) {
          return { ...i, message };
        } else {
          return i;
        }
      });
    });
  }

  function deleteLocalComment(id) {
    setComments((prev) => {
      return prev.filter((i) => i.id !== id);
    });
  }

  function toggleLocalCommentLike(id, addLike) {
    setComments((i) => {
      return i.map((i) => {
        if (id === i.id) {
          if (addLike) {
            return {
              ...i,
              likeCount: i.likeCount + 1,
              likedByMe: true,
            };
          } else {
            return {
              ...i,
              likeCount: i.likeCount - 1,
              likedByMe: false,
            };
          }
        } else {
          return i;
        }
      });
    });
  }

  return (
    <Context.Provider
      value={{
        post: { id, ...post },
        rootComments: commentsByParentId[null],
        getReplies,
        createLocalComment,
        updateLocalComment,
        deleteLocalComment,
        toggleLocalCommentLike,
      }}
    >
      {loading ? (
        <h1>LOADING...</h1>
      ) : error ? (
        <h1 className="error-msg">{error}</h1>
      ) : (
        children
      )}
    </Context.Provider>
  );
}
