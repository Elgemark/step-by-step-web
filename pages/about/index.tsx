import Layout from "../../components/Layout";
import LogoResponsive from "../../components/primitives/LogoResponsive";
import SteppoHead from "../../components/SteppoHead";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import { Button, ButtonGroup, Typography, useTheme } from "@mui/material";
import Article from "../../components/primitives/Article";
import { getJSON } from "../../utils/ssrUtils";
import { useGetTexts } from "../../utils/localizationUtils";
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

const AboutPage = ({ texts }) => {
  const theme = useTheme();
  const { texts: locTexts } = useGetTexts(texts);
  return (
    <Layout>
      <SteppoHead description="About Steppo" title="About Steppo" image="/images/steppo_box_origami.png"></SteppoHead>
      <StyledArticle theme={theme} image="/images/steppo_box_origami.png" avatar={"/images/steppo_avatar.png"}>
        <LogoResponsive></LogoResponsive>
        <Typography>{locTexts.body}</Typography>
        <ButtonGroup variant="text">
          <Button href="/about/terms-of-service">{locTexts.termsOfService}</Button>
          <Button href="/about/privacy-policy">{locTexts.privacyPolicy}</Button>
        </ButtonGroup>
      </StyledArticle>
    </Layout>
  );
};

export async function getStaticProps() {
  const jsonData = await getJSON("hosting/public/texts/pages/about.json");
  return {
    props: { texts: jsonData },
  };
}

export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <AboutPage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
