import Post from "./Post";
import Masonry from "@mui/lab/Masonry";
import { useState } from "react";
import Dialog from "../primitives/Dialog";
import { FC } from "react";
import { deletePost, likePost, bookmarkPost } from "../../utils/firebase/api";
// Firebase related
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";

const Posts: FC<{
  posts: Array<object>;
  enableLink: boolean;
  onDelete?: Function;
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
      onOkClick: () => deletePost(id),
    });
  };

  const onLikeHandler = async ({ id }) => {
    await likePost(id);
  };

  const onBookmarkHandler = async ({ id }) => {
    await bookmarkPost(id);
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
      <Masonry spacing={2} columns={{ lg: 4, md: 3, sm: 2, xs: 1 }}>
        {posts.map((data, index) => (
          <Post
            key={index}
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
            onBookmark={() => onBookmarkHandler(data)}
            onClickAvatar={() => onClickAvatarHandler(data)}
            // onReport={(() => onReportHandler(data))}
            {...data}
            prerequisites={[]}
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
