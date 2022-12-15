import Post from "./Post";
import Masonry from "@mui/lab/Masonry";
import { useState } from "react";
import Dialog from "../primitives/Dialog";
import { FC } from "react";
// Firebase related
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

const Posts: FC<{
  posts: Array<object>;
  enableLink: boolean;
  onEdit?: Function;
  onDelete?: Function;
  onLike?: Function;
  onBookmark?: Function;
  onClickAvatar?: Function;
}> = ({ posts = [], enableLink = false, onEdit, onDelete, onLike, onBookmark, onClickAvatar }) => {
  const [showDialog, setShowDialog] = useState({ open: false, content: "", onOkClick: () => {} });
  const [user] = useAuthState(getAuth());

  if (!posts.length) {
    return null;
  }

  return (
    <>
      <Masonry spacing={2} columns={{ lg: 4, md: 3, sm: 2, xs: 1 }}>
        {posts.map((data, index) => (
          <Post
            key={index}
            style={{ width: "100%" }}
            enableLink={enableLink}
            onEdit={
              user?.uid === data.userId
                ? () => {
                    onEdit(data);
                  }
                : undefined
            }
            onDelete={
              user?.uid === data.userId
                ? () => {
                    onDelete(data);
                  }
                : undefined
            }
            onLike={() => onLike(data)}
            onBookmark={() => onBookmark(data)}
            onClickAvatar={() => onClickAvatar(data)}
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
