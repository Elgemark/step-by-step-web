import Post from "./Post";
import { useState } from "react";
import Dialog from "../primitives/Dialog";
import { FC } from "react";
import { deletePost, likePost } from "../../utils/firebase/api";
import Masonry from "../primitives/Masonry";
// Firebase related
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { Posts } from "../../utils/firebase/type";

const Posts: FC<{
  posts: Posts;
  enableLink: boolean;
}> = ({ posts = [], enableLink = false }) => {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState({ open: false, content: "", onOkClick: () => {} });
  const [user] = useAuthState(getAuth());

  if (!posts.length) {
    return null;
  }

  const onEditHandler = ({ id }) => {
    router.push("/create/" + id);
  };

  const onDeleteHandler = ({ id }) => {
    setShowDialog({
      ...showDialog,
      open: true,
      content: "Are you sure you want to delete this post?",
      onOkClick: () => {
        deletePost(id).then(() => {
          router.replace(router.asPath);
        });
      },
    });
  };

  const onLikeHandler = async ({ id }) => {
    await likePost(id);
  };

  const onClickAvatarHandler = ({ userId }) => {
    if (user.uid === userId) {
      router.push("/profile/" + userId);
    } else {
      router.push("/user/" + userId);
    }
  };

  return (
    <>
      <Masonry>
        {posts.map((data, index) => (
          <Post
            key={index}
            currentUserId={user?.uid}
            enableLink={enableLink}
            onEdit={
              user?.uid === data.userId
                ? () => {
                    onEditHandler(data);
                  }
                : undefined
            }
            onDelete={
              user?.uid === data.userId
                ? () => {
                    onDeleteHandler(data);
                  }
                : undefined
            }
            onLike={() => onLikeHandler(data)}
            onClickAvatar={() => onClickAvatarHandler(data)}
            // onReport={(() => onReportHandler(data))}
            {...data}
          />
        ))}
      </Masonry>
      {/* DELETE DIALOG */}
      <Dialog
        open={showDialog.open}
        onClose={() => setShowDialog({ ...showDialog, open: false })}
        onClickOk={() => {
          showDialog.onOkClick();
          setShowDialog({ ...showDialog, open: false });
        }}
        onClickCancel={() => setShowDialog({ ...showDialog, open: false })}
        content={showDialog.content}
      />
    </>
  );
};

export default Posts;
