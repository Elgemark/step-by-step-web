import styled from "styled-components";
import SteppoLogo from "./SteppoLogo";

const Root = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;

  .logo {
    margin: 2rem 0;
    width: 45%;
    max-width: 340px;
    @media (min-width: 600px) {
      max-width: 260px;
    }
  }
`;

const LogoResponsive = (props) => {
  return (
    <Root {...props}>
      <SteppoLogo className="logo" />
    </Root>
  );
};
export default LogoResponsive;
