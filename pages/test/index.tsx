import LogoResponsive from "../../components/primitives/LogoResponsive";
import SteppoHead from "../../components/SteppoHead";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import { Button, ButtonGroup, Typography, useTheme } from "@mui/material";
import Article from "../../components/primitives/Article";
import styled from "styled-components";

const StyledArticle = styled(Article)`
  .article-content {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .MuiButtonGroup-root {
    align-self: center;
    margin: ${({ theme }) => `${theme.spacing(2)} 0`};
  }
`;

const TestPage = () => {
  const theme = useTheme();
  return (
    <div>
      <SteppoHead description="About Steppo" title="About Steppo" image="/images/steppo_box_origami.png"></SteppoHead>
      <StyledArticle theme={theme} image="/images/steppo_box_origami.png" avatar={"/images/steppo_avatar.png"}>
        <LogoResponsive></LogoResponsive>
        <Typography>{"body"}</Typography>
        <ButtonGroup variant="text">
          <Button href="/about/terms-of-service">{"Link A"}</Button>
          <Button href="/about/privacy-policy">{"Link B"}</Button>
        </ButtonGroup>
      </StyledArticle>
    </div>
  );
};

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <TestPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
