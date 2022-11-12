import { useState } from "react";
import { IconBtn } from "./IconBtn";
import { FaHeart, FaReply, FaTrash, FaEdit } from "react-icons/fa";
import { usePost } from "../contexts/PostContext";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { useAsyncFn } from "../hooks/useAsync";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});
export function Comment({ id, message, user, createdAt }) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const { post, getReplies, createLocalComment } = usePost();

  const createCommentFn = useAsyncFn();
  const childComments = getReplies(id);

  function onCommentReply(message) {
    return createCommentFn
      .execute({ postId: post.id, message, parentId: id })
      .then((comment) => {
        setIsReplying(false);
        createLocalComment(comment);
      });
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
        <div className="message">{message}</div>
        <div className="footer">
          <IconBtn Icon={FaHeart} aria-label="Like">
            2
          </IconBtn>
          <IconBtn
            Icon={FaReply}
            aria-label={isReplying ? "Cancel Reply" : "Reply"}
            onClick={setIsReplying((prev) => !prev)}
            isActive={isReplying}
          />
          <IconBtn Icon={FaEdit} aria-label="Edit" />
          <IconBtn Icon={FaTrash} aria-label="Trash" color="danger" />
        </div>
      </div>

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
