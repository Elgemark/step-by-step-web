import Head from "next/head";
import Layout from "../../components/Layout";
import PostEditable from "../../components/posts/PostEditable";
import StepEditable from "../../components/steps/StepEditable";
import { useStateObject } from "../../utils/object";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Divider } from "@mui/material";
import styled from "styled-components";
import ButtonGroup from "@mui/material/ButtonGroup";
import _ from "lodash";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { useRouter } from "next/router";
import { getPost, getSteps, setPostAndSteps } from "../../utils/firebase/api";

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

const Steps = ({ post, steps }) => {
  return (
    <>
      {" "}
      <Head>
        <title>{post?.title}</title>
      </Head>
      <StyledLayout></StyledLayout>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const postId = query.id;
  const post = await getPost(postId);
  const steps = await getSteps(post?.data?.stepsId);
  return {
    props: {
      post: post?.data || {
        title: "Title",
        descr: "Description",
        media: { imageURI: "" },
        tags: [],
        likes: 0,
      },
      steps: steps?.data || { steps: [] },
    },
  };
}

export default Steps;
