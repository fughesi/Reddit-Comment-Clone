import { useState } from "react";
import { IconBtn } from "./IconBtn";
import { FaHeart, FaReply, FaTrash, FaEdit, FaRegHeart } from "react-icons/fa";
import { usePost } from "../contexts/PostContext";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { useUser } from "../hooks/useUser";
import { useAsyncFn } from "../hooks/useAsync";
import {
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
} from "../services/comments";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function Comment({
  id,
  message,
  user,
  createdAt,
  likeCount,
  likedByMe,
}) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const {
    post,
    getReplies,
    createLocalComment,
    updateLocalComment,
    deleteLocalComment,
    toggleLocalCommentLike,
  } = usePost();

  const createCommentFn = useAsyncFn(createComment);
  const updateCommentFn = useAsyncFn(updateComment);
  const deleteCommentFn = useAsyncFn(deleteComment);
  const toggleCommentLikeFn = useAsyncFn(toggleCommentLike);
  const childComments = getReplies(id);
  const currentUser = useUser();

  function onCommentReply(message) {
    return createCommentFn
      .execute({ postId: post.id, message, parentId: id })
      .then((comment) => {
        setIsReplying(false);
        createLocalComment(comment);
      });
  }

  function onCommentUpdate(message) {
    return updateCommentFn
      .execute({ postId: post.id, message, id })
      .then((comment) => {
        setIsEditing(false);
        updateLocalComment(id, comment.message);
      });
  }

  function onCommentDelete() {
    return deleteCommentFn
      .execute({ postId: post.id, id })
      .then((comment) => deleteLocalComment(comment.id));
  }

  function onToggleCommentLike() {
    return toggleCommentLikeFn
      .execute({ id, postId: post.id })
      .then(({ addLike }) => toggleLocalCommentLike(id, addLike));
  }

  return (
    <>
      <div className="comment">
        <div className="header">
          <span className="name">{user.name}</span>

          <span className="date">
            {dateFormatter.format(Date.parse(createdAt))}
          </span>
        </div>
        {isEditing ? (
          <CommentForm
            autoFocus
            initialValue={message}
            onSubmit={onCommentUpdate}
            loading={updateCommentFn.loading}
            error={updateCommentFn.error}
          />
        ) : (
          <div className="message">{message}</div>
        )}
        <div className="footer">
          <IconBtn
            onClick={onToggleCommentLike}
            disabled={toggleCommentLikeFn.loading}
            Icon={likedByMe ? FaHeart : FaRegHeart}
            aria-label={likedByMe ? "Unlike" : "Like"}
          >
            {likeCount}
          </IconBtn>
          <IconBtn
            Icon={FaReply}
            aria-label={isReplying ? "Cancel Reply" : "Reply"}
            onClick={() => setIsReplying((prev) => !prev)}
            isActive={isReplying}
          />
          {user.id === currentUser.id && (
            <>
              <IconBtn
                Icon={FaEdit}
                aria-label={isEditing ? "Cancel Edit" : "Edit"}
                onClick={() => setIsEditing((prev) => !prev)}
                isActive={isEditing}
              />
              <IconBtn
                Icon={FaTrash}
                aria-label="Trash"
                onClick={onCommentDelete}
                disabled={deleteCommentFn.loading}
                color="danger"
              />
            </>
          )}
        </div>
        {deleteCommentFn.error && (
          <div className="error-msg mt-1">{deleteCommentFn.error}</div>
        )}
        {isReplying && (
          <div className="mt-1 ml-3">
            <CommentForm
              autoFocus
              onSubmit={onCommentReply}
              loading={createCommentFn.loading}
              error={createCommentFn.error}
            />
          </div>
        )}
      </div>

      {childComments?.length > 0 && (
        <>
          <div
            className={`nested-comments-stack ${
              areChildrenHidden ? "hide" : ""
            }`}
          >
            <button
              className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="nested-comments">
              <CommentList comments={childComments} />
            </div>
          </div>
          <button
            className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            SHOW REPLIES
          </button>
        </>
      )}
    </>
  );
}
