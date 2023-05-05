import Layout from "../../../components/Layout";
import SteppoHead from "../../../components/SteppoHead";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import styled from "styled-components";
import { Typography, useTheme } from "@mui/material";
import Article from "../../../components/primitives/Article";

const StyledArticle = styled(Article)`
  margin-top: 32px;
  .article-content {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  h4 {
    margin-top: 32px;
    text-align: center;
  }
`;

const PrivacyPolicePage = () => {
  const theme = useTheme();
  return (
    <Layout>
      <SteppoHead description="Steppo privacy policy" title="Privacy policy"></SteppoHead>
      <StyledArticle theme={theme} avatar={"/images/steppo_avatar.png"}>
        <Typography variant="h4">Terms of service</Typography>
        <ol>
          <li>
            <Typography>
              Steppo collects various types of information from users, such as account and profile information, content
              and activity data, and device and usage information.
            </Typography>
          </li>
          <li>
            <Typography>
              Steppo uses this information to provide and improve its services, personalize user experiences, and show
              users relevant content.
            </Typography>
          </li>
          <li>
            <Typography>
              Steppo may share user information with third-party service providers, advertisers, and business partners,
              but only as necessary to provide and improve its services and as permitted by law.
            </Typography>
          </li>
          <li>
            <Typography>
              Users can control some of the information Steppo collects and how it's used, such as through account
              settings and privacy controls.
            </Typography>
          </li>
          <li>
            <Typography>
              Steppo takes various measures to protect user information, such as encryption, access controls, and
              regular security assessments.
            </Typography>
          </li>
        </ol>
      </StyledArticle>
    </Layout>
  );
};
export default (props) => (
  <MUIWrapper>
    <FirebaseWrapper>
      <PrivacyPolicePage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
