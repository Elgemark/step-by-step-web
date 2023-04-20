import Layout from "../../components/Layout";
import Accordion from "../../components/primitives/Accordion";
import LogoResponsive from "../../components/primitives/LogoResponsive";
import SteppoHead from "../../components/SteppoHead";
import FirebaseWrapper from "../../components/wrappers/FirebaseWrapper";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import styled from "styled-components";
import { backgroundBlurMixin } from "../../utils/styleUtils";
import { Typography, useTheme } from "@mui/material";

const StyledAccordion = styled(Accordion)`
  ${backgroundBlurMixin}
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;
const PrivacyPolicePage = () => {
  return (
    <Layout>
      <SteppoHead description="Terms of service" title="Terms of service"></SteppoHead>
      <LogoResponsive></LogoResponsive>
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
