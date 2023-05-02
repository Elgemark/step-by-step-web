import Layout from "../../components/Layout";
import LogoResponsive from "../../components/primitives/LogoResponsive";
import SteppoHead from "../../components/SteppoHead";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import { Typography, useTheme } from "@mui/material";
import Article from "../../components/primitives/Article";
import { getJSON } from "../../utils/ssrUtils";

const AboutPage = ({ texts }) => {
  const theme = useTheme();
  return (
    <Layout>
      <SteppoHead description="About Steppo" title="About Steppo" image="/images/steppo_box_origami.png"></SteppoHead>
      <Article image="/images/steppo_box_origami.png" avatar={"/images/steppo_avatar.png"}>
        <LogoResponsive></LogoResponsive>
        <Typography>{texts.body["en-global"]}</Typography>
      </Article>
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
