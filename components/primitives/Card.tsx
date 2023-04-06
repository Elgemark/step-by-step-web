import { alpha, Card as MUICard, useTheme } from "@mui/material";
import styled from "styled-components";

const Root = styled(MUICard)`
  background-color: ${({ theme }) => alpha(theme.palette.background.paper, 0.35)};
  backdrop-filter: blur(20px);
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
