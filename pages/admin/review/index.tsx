import { PostsResponse } from "../../../utils/firebase/interface";
import { getPostsByQuery } from "../../../utils/firebase/api/post";
import Collection from "../../../classes/Collection";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import { likePost, useUser } from "../../../utils/firebase/api";
import Loader from "../../../components/Loader";
import { limit, startAfter, where } from "firebase/firestore";
import PageMain from "../../../components/PageMain";
import Head from "next/head";
import Layout from "../../../components/Layout";
import Masonry from "../../../components/primitives/Masonry";
import DialogReport, { ReportData } from "../../../components/DialogReport";
import DialogDeletePost from "../../../components/DialogDeletePost";
import PostMoreMenu from "../../../components/PostMoreMenu";
import { useRouter } from "next/router";
import { useState } from "react";
import Post from "../../../components/posts/Post";

const collection = new Collection();
let lastDoc;

const ReviewPage = ({ posts }) => {
  const router = useRouter();

  const [report, setReport] = useState<ReportData>();
  const [deletePost, setDeletePost] = useState<string>();

  const { isLoading, data: user } = useUser();

  if (!posts.length) {
    return null;
  }

  const onEditHandler = ({ id }) => {
    router.push("/create/" + id);
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

  if (isLoading) {
    return <Loader />;
  }

  if (!user.roles.includes("admin")) {
    return <h1>Access denied!</h1>;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>{"STEPS | Admin"}</title>
      </Head>
      <Layout>
        <Masonry>
          {posts.map((data, index) => (
            <Post
              key={index}
              currentUserId={user?.uid}
              enableLink={true}
              hrefBasePath="/admin/review/post/"
              action={
                <PostMoreMenu
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
                          setDeletePost(data.id);
                        }
                      : undefined
                  }
                  onReport={() => setReport({ postId: data.id, userId: user.uid })}
                />
              }
              onLike={() => onLikeHandler(data)}
              onClickAvatar={() => onClickAvatarHandler(data)}
              {...data}
            />
          ))}
        </Masonry>
        {/* DELETE DIALOG */}
        <DialogDeletePost open={deletePost} onClose={() => setDeletePost(null)} />
        {/* REPORT DIALOG */}
        <DialogReport open={report} onClose={() => setReport(null)} />
      </Layout>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { search, category } = query;
  let response: PostsResponse = { data: [], error: null };

  const queries: Array<any> = [limit(10), where("visibility", "==", "audit")];

  if (lastDoc) {
    queries.push(startAfter(lastDoc));
  }

  response = await getPostsByQuery(queries);

  lastDoc = response.lastDoc;

  const items = collection.union(response.data, [category, search], () => {
    lastDoc = null;
  });

  return { props: { posts: items } };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <ReviewPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
