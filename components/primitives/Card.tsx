import { Card as MUICard, useTheme } from "@mui/material";
import styled from "styled-components";
import { backgroundBlurMixin } from "../../utils/styleUtils";

const Root = styled(MUICard)`
  ${backgroundBlurMixin}
`;

const Card = ({ children, ...rest }) => {
  const theme = useTheme();
  return (
    <Root theme={theme} {...rest}>
      {children}
    </Root>
  );
};

export default Card;
