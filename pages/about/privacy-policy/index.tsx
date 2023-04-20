import Layout from "../../../components/Layout";
import Accordion from "../../../components/primitives/Accordion";
import LogoResponsive from "../../../components/primitives/LogoResponsive";
import SteppoHead from "../../../components/SteppoHead";
import FirebaseWrapper from "../../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../../components/wrappers/MUIWrapper";
import styled from "styled-components";
import { backgroundBlurMixin } from "../../../utils/styleUtils";
import { Typography, useTheme } from "@mui/material";

const StyledAccordion = styled(Accordion)`
  ${backgroundBlurMixin}
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;
const PrivacyPolicePage = () => {
  const theme = useTheme();
  return (
    <Layout>
      <SteppoHead description="Steppo privacy policy" title="Privacy policy"></SteppoHead>
      <LogoResponsive></LogoResponsive>
      <StyledAccordion title="Privacy policy" theme={theme} collapse={false}>
        <Typography>
          1. Steppo collects various types of information from users, such as account and profile information, content
          and activity data, and device and usage information.
        </Typography>
        <Typography>
          2. Steppo uses this information to provide and improve its services, personalize user experiences, and show
          users relevant content.
        </Typography>
        <Typography>
          3. Steppo may share user information with third-party service providers, advertisers, and business partners,
          but only as necessary to provide and improve its services and as permitted by law.
        </Typography>
        <Typography>
          4. Users can control some of the information Steppo collects and how it's used, such as through account
          settings and privacy controls.
        </Typography>
        <Typography>
          5. Steppo takes various measures to protect user information, such as encryption, access controls, and regular
          security assessments.
        </Typography>
      </StyledAccordion>
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
