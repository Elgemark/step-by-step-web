import Head from "next/head";
import Layout from "../../../../components/Layout";
import styled from "styled-components";
import { getPost, getSteps, getLists } from "../../../../utils/firebase/api";
import Step from "../../../../components/steps/Step";
import Post from "../../../../components/posts/Post";
import { post as postModel } from "../../../../utils/firebase/models";
import { v4 as uuid } from "uuid";
import { FC, useState } from "react";
import { ListsResponse, Post as PostType } from "../../../../utils/firebase/interface";
import { Lists, Steps } from "../../../../utils/firebase/type";
import FirebaseWrapper from "../../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../../components/wrappers/MUIWrapper";
import DialogDeletePost from "../../../../components/DialogDeletePost";

const StyledLayout = styled(Layout)`
  display: flex;
  justify-content: center;
  .content {
    width: 500px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  section {
    display: flex;
    justify-content: center;
  }
`;

const StyledStep = styled(Step)`
  margin: 10px 0;
`;

const StepsPage: FC<{ id: string; post: PostType; lists: Lists; steps: Steps }> = ({ id, post, steps, lists }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState<string>();

  return (
    <>
      <Head>
        <title>{"STEPS | Review: " + (post?.title || "untitled")}</title>
      </Head>
      <StyledLayout>
        <Post {...post} enableLink={false} lists={lists} />
        {/* STEPS */}
        {steps.map((step, index) => (
          <StyledStep {...step} index={index} />
        ))}
      </StyledLayout>
      {/* DELETE DIALOG */}
      <DialogDeletePost open={showDeleteDialog} onClose={() => setShowDeleteDialog(null)} />
    </>
  );
};

export async function getServerSideProps({ query }) {
  const id = query.id || uuid();
  const post = await getPost(id);
  const stepsResponse = await getSteps(id);
  const listsResp: ListsResponse = await getLists(id);
  return {
    props: {
      post: post.data || { ...postModel, id },
      steps: stepsResponse.data,
      lists: listsResp.data,
      id,
    },
  };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <StepsPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
