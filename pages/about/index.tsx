import Layout from "../../components/Layout";
import LogoResponsive from "../../components/primitives/LogoResponsive";
import SteppoHead from "../../components/SteppoHead";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import styled from "styled-components";
import { backgroundBlurMixin } from "../../utils/styleUtils";
import { Paper, Typography, useTheme } from "@mui/material";
import Article from "../../components/primitives/Article";

const StyledPaper = styled(Paper)`
  ${backgroundBlurMixin}
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(2)};
  h5 {
    font-weight: bold;
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }
`;
const AboutPage = () => {
  const theme = useTheme();
  return (
    <Layout>
      <SteppoHead description="About Steppo" title="About Steppo" image="/images/steppo_box_origami.png"></SteppoHead>

      <Article image="/images/steppo_box_origami.png" avatar={"/images/steppo_avatar.png"}>
        <LogoResponsive></LogoResponsive>
        {/* <Typography variant="h5">Why Steppo?</Typography> */}
        <Typography>
          The inspiration for this app struck when my daughter had a meltdown over a paper box folding guide she
          stumbled upon on Instagram. That's when I realized there had to be a better way to share step-by-step
          instructions, and Steppo was born!
        </Typography>
      </Article>
    </Layout>
  );
};
export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <AboutPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
