import { FC } from "react";
import { deletePost } from "../utils/firebase/api";
import Dialog from "./primitives/Dialog";

const DialogDeletePost: FC<{ open: string; onClose: () => void; onDelete: (id: string) => void; content?: string }> = ({
  open,
  onClose,
  onDelete,
  content = "Are you sure you want to delete this post?",
}) => {
  const onDeleteHandler = ({ id }) => {
    deletePost(id).then(() => {
      onDelete(id);
    });
  };

  return (
    <Dialog
      open={Boolean(open)}
      onClose={onClose}
      onClickOk={() => {
        onDeleteHandler({ id: open });
        onClose();
      }}
      onClickCancel={onClose}
      content={content}
    />
  );
};

export default DialogDeletePost;
