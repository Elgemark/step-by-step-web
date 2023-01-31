import { useRouter } from "next/router";
import { FC } from "react";
import { deletePost } from "../utils/firebase/api";
import Dialog from "./primitives/Dialog";

const DialogDeletePost: FC<{ open: string; onClose: () => void; content?: string }> = ({
  open,
  onClose,
  content = "Are you sure you want to delete this post?",
}) => {
  const router = useRouter();

  const onDeleteHandler = ({ id }) => {
    deletePost(id).then(() => {
      router.replace(router.asPath);
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
