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

const TermsOfServicePage = () => {
  const theme = useTheme();
  return (
    <Layout>
      <SteppoHead description="Terms of service" title="Terms of service"></SteppoHead>
      <StyledArticle theme={theme} avatar={"/images/steppo_avatar.png"}>
        <Typography variant="h4">Terms of service</Typography>
        <ol>
          <li>
            <Typography>Users must be at least 13 years old to create an account on Steppo.</Typography>
          </li>
          <li>
            <Typography>
              Users are responsible for the content they post and must ensure they have the necessary rights to share
              that content, including images and text.
            </Typography>
          </li>
          <li>
            <Typography>
              Steppo has the right to remove any content that violates its community guidelines or terms of service,
              including content that is illegal, infringes on the rights of others, or is otherwise harmful or
              objectionable.
            </Typography>
          </li>
          <li>
            <Typography>
              Users must not engage in activities that violate the intellectual property rights of others, such as
              posting copyrighted material without permission or using images or text from other sources without proper
              attribution or licensing.
            </Typography>
          </li>
          <li>
            <Typography>
              Steppo may use data collected from users to improve its services and personalize user experiences, but
              will not share user data with third parties without permission.
            </Typography>
          </li>
          <li>
            <Typography>
              Steppo encourages users to respect the privacy and personal information of others and to use the platform
              responsibly and respectfully.
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
      <TermsOfServicePage {...props} />
    </FirebaseWrapper>
  </MUIWrapper>
);
