import Post from "./Post";
import { useState } from "react";
import { FC } from "react";
import { likePost } from "../../utils/firebase/api";
import Masonry from "../primitives/Masonry";
import { useRouter } from "next/router";
import { Posts } from "../../utils/firebase/type";
import { useUser } from "reactfire";
import PostMoreMenu from "../PostMoreMenu";
import DialogReport, { ReportData } from "../DialogReport";
import DialogDeletePost from "../DialogDeletePost";
import { useMessages } from "../Messages";
import PostAd from "../ads/PostAd";

const Posts: FC<{
  posts: Posts;
  enableLink?: boolean;
  showStatus?: boolean;
}> = ({ posts = [], enableLink = false, showStatus = false }) => {
  const router = useRouter();
  const [report, setReport] = useState<ReportData>();
  const [deletePost, setDeletePost] = useState<string>();
  const [deletedPosts, setDeletedPosts] = useState([]);
  const { addMessage } = useMessages();

  const { data: user } = useUser();

  if (!posts.length) {
    return null;
  }

  const onEditHandler = ({ id }) => {
    router.push("/create/" + id);
  };

  const onDeletePostHandler = (id) => {
    const newDeletedPosts = [...deletedPosts];
    newDeletedPosts.push(id);
    setDeletedPosts(newDeletedPosts);
  };

  const onClickAvatarHandler = ({ uid }) => {
    if (user.uid === uid) {
      router.push("/profile/" + uid);
    } else {
      router.push("/user/" + uid + "/published");
    }
  };

  const onReportHandler = (postId) => {
    if (user?.uid) {
      setReport({ postId, userId: user.uid });
    } else {
      addMessage({ id: "alert", message: "Please sign in to use the report function!" });
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Masonry component="nav" aria-label="posts">
        {posts
          .filter((post) => !deletedPosts.includes(post.id))
          .map((data, index) => (
            <>
              <PostAd index={index} occurrence={2} />
              <Post
                key={index}
                currentUserId={user?.uid}
                enableLink={enableLink}
                action={
                  <PostMoreMenu
                    onEdit={
                      user?.uid === data.uid
                        ? () => {
                            onEditHandler(data);
                          }
                        : undefined
                    }
                    onDelete={
                      user?.uid === data.uid
                        ? () => {
                            setDeletePost(data.id);
                          }
                        : undefined
                    }
                    onReport={() => onReportHandler(data.id)}
                  />
                }
                onClickAvatar={({ uid }) => {
                  onClickAvatarHandler({ uid });
                }}
                {...data}
              />
            </>
          ))}
      </Masonry>
      {/* DELETE DIALOG */}
      <DialogDeletePost onDelete={onDeletePostHandler} open={deletePost} onClose={() => setDeletePost(null)} />
      {/* REPORT DIALOG */}
      <DialogReport open={report} onClose={() => setReport(null)} />
    </div>
  );
};

export default Posts;
