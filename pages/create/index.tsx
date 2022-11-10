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
import { setPost, setSteps } from "../../utils/firebase/api";

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

const Create = () => {
  // post object:
  const { object: dataPost, setValue: setPostValue } = useStateObject({
    title: "Title",
    descr: "Description",
    media: { imageURI: "" },
    steps: "ref",
    likes: 0,
  });

  console.log(dataPost);

  // step object: {title: "Title",body: "Description",media: { imageURI: "" }}
  const { object: dataSteps, setValue: setStepsValue } = useStateObject({
    steps: [],
  });

  const onClickAddStepHandler = () => {
    const steps = [...dataSteps.steps];
    steps.push({});
    setStepsValue("steps", steps);
  };

  const onClickSaveHandler = async () => {
    debugger;
    const resultSteps = await setSteps(dataSteps);
    setPostValue("steps", "/steps/" + resultSteps.id);
    const resultPost = await setPost(dataPost);
    console.log("resultSteps", resultSteps, "resultPost", resultPost);
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
          {...dataPost}
        />
        <StyledDivider />
        {dataSteps.steps.map((dataStep, index) => (
          <>
            <StepEditable
              index={index}
              onChangeBody={(value) => setStepsValue("steps." + index + ".body", value)}
              onChangeTitle={(value) => setStepsValue("steps." + index + ".title", value)}
              onChangeImage={(value) => setStepsValue("steps." + index + ".media.imageURI", value)}
              {...dataStep}
            />
            <StyledDivider />
          </>
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
      </StyledLayout>
    </>
  );
};

export default Create;
