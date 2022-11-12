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
import { getPost, getSteps, setPost, setSteps, setPostAndSteps } from "../../utils/firebase/api";
import _ from "lodash";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import { useRouter } from "next/router";

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

const StyledDivider = styled(Divider)`
  margin: 20px 0;
`;

const StyledBottomBar = styled.div`
  display: flex;
  justify-content: center;
`;

const Create = ({ post, steps, error }) => {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState();
  // post object:
  const { object: dataPost, setValue: setPostValue, replace: replacePost } = useStateObject(post);
  // step object: {title: "Title",body: "Description",media: { imageURI: "" }}
  const {
    object: dataSteps,
    setValue: setStepsValue,
    replace: replaceSteps,
  } = useStateObject(steps);

  console.log("post", post, "steps", steps);

  const onClickAddStepHandler = () => {
    const steps = [...dataSteps.steps];
    steps.push({});
    setStepsValue("steps", steps);
  };

  const _onClickSaveHandler = async () => {
    const resultSteps = await setSteps(dataSteps);
    const resultPost = await setPost({ ...dataPost, steps: "/steps/" + resultSteps.id });
    console.log("resultPost", resultPost);
    // Update internal values...
    replacePost(resultPost.data);
    replaceSteps(resultSteps.data);
    // Success...
    setSuccessMessage("Post saved!");
    // Update route...
    router.replace("/create", { query: { id: resultPost.id } });
  };

  const onClickSaveHandler = async () => {
    const resp = await setPostAndSteps(dataPost, dataSteps);
    resp.postData && replacePost(resp.postData);
    resp.stepsData && replaceSteps(resp.stepsData);
  };

  return (
    <>
      <Head>
        <title>create</title>
      </Head>
      <StyledLayout>
        <PostEditable
          onChangeTitle={(value) => setPostValue("title", value)}
          onChangeBody={(value) => setPostValue("descr", value)}
          onChangeImage={(value) => setPostValue("media.imageURI", value)}
          onAddTag={(value) => {
            setPostValue("tags", _.union(dataPost.tags, value.split(" ")));
          }}
          onRemoveTag={(value) => {
            const tagsCopy = [...dataPost.tags];
            _.remove(tagsCopy, (tag) => tag === value);
            setPostValue("tags", tagsCopy);
          }}
          {...dataPost}
        />
        <StyledDivider />
        {dataSteps.steps.map((dataStep, index) => (
          <div key={"step-" + index}>
            <StepEditable
              index={index}
              onChangeBody={(value) => setStepsValue("steps." + index + ".body", value)}
              onChangeTitle={(value) => setStepsValue("steps." + index + ".title", value)}
              onChangeImage={(value) => setStepsValue("steps." + index + ".media.imageURI", value)}
              {...dataStep}
            />
            <StyledDivider />
          </div>
        ))}
        <StyledBottomBar>
          <ButtonGroup variant="text" aria-label="text button group">
            <Button endIcon={<SaveIcon />} onClick={onClickSaveHandler}>
              Save
            </Button>
            <Button endIcon={<AddIcon />} onClick={onClickAddStepHandler}>
              Step
            </Button>
          </ButtonGroup>
        </StyledBottomBar>
        {/* SNACKBAR */}
        <Snackbar open={successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage()}>
          <Alert onClose={() => setSuccessMessage()} severity="success" sx={{ width: "100%" }}>
            {successMessage}
          </Alert>
        </Snackbar>
      </StyledLayout>
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
      steps: steps?.data || [],
    },
  };
}

export default Create;
