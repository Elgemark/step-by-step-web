import Head from "next/head";
import Layout from "../../components/Layout";
import SplashEditable from "../../components/splashes/SplashEditable";
import { useStateObject } from "../../utils/object";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { Divider } from "@mui/material";
import styled from "styled-components";

const StyledLayout = styled(Layout)`
  display: flex;
  justify-content: center;
  .content {
    background-color: red;
    max-width: 500px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
`;

const StyledDivider = styled(Divider)`
  margin: 20px 0;
`;

const Create = () => {
  // post object:
  const { object: dataPost, setValue: setPostValue } = useStateObject({
    title: "Title",
    descr: "Description",
    media: { imageURI: "" },
    steps: "ref",
  });

  // step object: {title: "Title",body: "Description",media: { imageURI: "" }}
  const { object: dataSteps, setValue: setStepsValue } = useStateObject({
    steps: [],
  });

  const onPressAddStep = () => {
    const steps = [...dataSteps.steps];
    steps.push({});
    setStepsValue("steps", steps);
  };

  return (
    <>
      <Head>
        <title>create</title>
      </Head>
      <StyledLayout>
        <SplashEditable
          onChangeTitle={(value) => setPostValue("title", value)}
          onChangeDescription={(value) => setPostValue("description", value)}
        />
        <StyledDivider />
        <IconButton size="large">
          <AddIcon fontSize="inherit" />
        </IconButton>
      </StyledLayout>
    </>
  );
};

export default Create;
