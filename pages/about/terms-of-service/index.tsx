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

const TermsOfServicePage = () => {
  const theme = useTheme();
  return (
    <Layout>
      <SteppoHead description="Terms of service" title="Terms of service"></SteppoHead>
      <LogoResponsive></LogoResponsive>
      <StyledAccordion title="Terms of service" theme={theme} collapse={false}>
        <Typography>1. Users must be at least 13 years old to create an account on Steppo.</Typography>
        <Typography>
          2. Users are responsible for the content they post and must ensure they have the necessary rights to share
          that content, including images and text.
        </Typography>
        <Typography>
          3. Steppo has the right to remove any content that violates its community guidelines or terms of service,
          including content that is illegal, infringes on the rights of others, or is otherwise harmful or
          objectionable.
        </Typography>
        <Typography>
          4. Users must not engage in activities that violate the intellectual property rights of others, such as
          posting copyrighted material without permission or using images or text from other sources without proper
          attribution or licensing.
        </Typography>
        <Typography>
          5. Steppo may use data collected from users to improve its services and personalize user experiences, but will
          not share user data with third parties without permission.
        </Typography>
        <Typography>
          6. Steppo encourages users to respect the privacy and personal information of others and to use the platform
          responsibly and respectfully. These
        </Typography>
      </StyledAccordion>
      {/* <StyledAccordion title="1. Our service" theme={theme}>
        <Typography>"..."</Typography>
      </StyledAccordion>
      <StyledAccordion title="2. Using Steppo" theme={theme}>
        <Typography>"..."</Typography>
      </StyledAccordion>
      <StyledAccordion title="3. Your content" theme={theme}>
        <Typography>"..."</Typography>
      </StyledAccordion>
      <StyledAccordion title="4. Copyright policy" theme={theme}>
        <Typography>"..."</Typography>
      </StyledAccordion>
      <StyledAccordion title="5. Security" theme={theme}>
        <Typography>"..."</Typography>
      </StyledAccordion>
      <StyledAccordion title="6. Third party links, sites, and services" theme={theme}>
        <Typography>"..."</Typography>
      </StyledAccordion>
      <StyledAccordion title="7. Termination" theme={theme}>
        <Typography>"..."</Typography>
      </StyledAccordion>
      <StyledAccordion title="8. Indemnity" theme={theme}>
        <Typography>"..."</Typography>
      </StyledAccordion>
      <StyledAccordion title="9. Disclaimers" theme={theme}>
        <Typography>"..."</Typography>
      </StyledAccordion>
      <StyledAccordion title="10. Limitation of liability" theme={theme}>
        <Typography>"..."</Typography>
      </StyledAccordion>
      <StyledAccordion title="11. Arbitration" theme={theme}>
        <Typography>"..."</Typography>
      </StyledAccordion>
      <StyledAccordion title="12. Governing law and jurisdiction" theme={theme}>
        <Typography>"..."</Typography>
      </StyledAccordion>
      <StyledAccordion title="13. General terms" theme={theme}>
        <Typography>"..."</Typography>
      </StyledAccordion> */}
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
